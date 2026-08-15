const KANJI_RE = /[々〆ケヵヶ㐀-䶿一-鿿豈-﫿]/;

// ひらがな/カタカナの表記ゆれ(例: 名前が「せたな町」で読みが「セタナチョウ」、
// 「一ノ蔵」の「ノ」に対して読みが「の」など)を吸収するため、比較用にすべて
// ひらがなへ正規化する。文字数は変わらないので、正規化後に見つけた位置は
// そのまま元の文字列にも使える。
function toHiragana(str: string): string {
  let out = "";
  for (const ch of str) {
    const code = ch.codePointAt(0)!;
    out += code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : ch;
  }
  return out;
}

interface Segment {
  text: string;
  isKanji: boolean;
}

function splitIntoSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let current = "";
  let currentIsKanji: boolean | null = null;
  for (const ch of text) {
    const isKanji = KANJI_RE.test(ch);
    if (currentIsKanji !== null && isKanji !== currentIsKanji) {
      segments.push({ text: current, isKanji: currentIsKanji });
      current = "";
    }
    current += ch;
    currentIsKanji = isKanji;
  }
  if (current) segments.push({ text: current, isKanji: currentIsKanji! });
  return segments;
}

interface FuriganaPart {
  text: string;
  reading?: string;
}

// 「西都原古墳群」+「さいとばるこふんぐん」のように、漢字と非漢字(ひらがな・
// カタカナ等)が混在するテキストと読みを、非漢字部分を手がかりに位置合わせし、
// 漢字部分にだけふりがなを振れるよう分割する。整合が取れない場合は null を返す。
function alignFurigana(text: string, kana: string): FuriganaPart[] | null {
  const segments = splitIntoSegments(text);
  const normKana = toHiragana(kana);
  const parts: FuriganaPart[] = [];
  let cursor = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg.isKanji) {
      const idx = normKana.indexOf(toHiragana(seg.text), cursor);
      if (idx === -1) return null;
      parts.push({ text: seg.text });
      cursor = idx + seg.text.length;
    } else {
      let end = kana.length;
      for (let j = i + 1; j < segments.length; j++) {
        if (!segments[j].isKanji) {
          const idx2 = normKana.indexOf(toHiragana(segments[j].text), cursor);
          if (idx2 !== -1) end = idx2;
          break;
        }
      }
      const reading = kana.slice(cursor, end);
      if (!reading) return null;
      parts.push({ text: seg.text, reading });
      cursor = end;
    }
  }
  return parts;
}

export function Ruby({ text, kana }: { text: string; kana?: string }) {
  if (!kana || kana === text) return <>{text}</>;

  const parts = alignFurigana(text, kana);
  if (!parts) {
    return (
      <ruby>
        {text}
        <rp>(</rp>
        <rt className="text-[0.6em] font-normal text-muted">{kana}</rt>
        <rp>)</rp>
      </ruby>
    );
  }

  return (
    <>
      {parts.map((part, i) =>
        part.reading ? (
          <ruby key={i}>
            {part.text}
            <rp>(</rp>
            <rt className="text-[0.6em] font-normal text-muted">{part.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          part.text
        )
      )}
    </>
  );
}
