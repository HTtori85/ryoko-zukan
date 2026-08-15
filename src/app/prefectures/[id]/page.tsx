import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusToggle } from "@/components/StatusToggle";
import { CollectionItemPill } from "@/components/CollectionItemPill";
import { MunicipalityMap } from "@/components/MunicipalityMap";
import { SakeIllustration } from "@/components/SakeIllustration";
import { SweetnessGauge } from "@/components/SweetnessGauge";
import { PrefectureCompletion, type CompletionGroup } from "@/components/PrefectureCompletion";
import { ResetPrefectureButton } from "@/components/ResetPrefectureButton";
import { Ruby } from "@/components/Ruby";
import { AdSlot } from "@/components/AdSlot";
import { MUNICIPALITY_MAP_REGISTRY } from "@/lib/municipality-maps/registry";
import {
  prefectures,
  getSpotsByPrefecture,
  getFoodsByPrefecture,
  getHotSpringsByPrefecture,
  getWorldHeritageByPrefecture,
  getMunicipalitiesByPrefecture,
  getSakeByPrefecture,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return prefectures.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pref = prefectures.find((p) => p.id === id);
  if (!pref) return {};

  return buildMetadata({
    title: `${pref.name}の観光地・世界遺産・郷土料理・温泉・市区町村図鑑`,
    description: `${pref.intro} ${pref.name}の観光地、郷土料理、温泉地、市区町村をコレクションしよう。`,
    path: `/prefectures/${pref.id}`,
  });
}

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pref = prefectures.find((p) => p.id === id);
  if (!pref) notFound();

  const spots = getSpotsByPrefecture(pref.id);
  const foods = getFoodsByPrefecture(pref.id);
  const hotSprings = getHotSpringsByPrefecture(pref.id);
  const worldHeritage = getWorldHeritageByPrefecture(pref.id);
  const municipalities = getMunicipalitiesByPrefecture(pref.id);
  const sake = getSakeByPrefecture(pref.id);
  const municipalityMapLoader = MUNICIPALITY_MAP_REGISTRY[pref.id];
  const municipalityMap = municipalityMapLoader ? await municipalityMapLoader() : null;
  const completionGroups: CompletionGroup[] = [
    { category: "spots", ids: spots.map((s) => s.id) },
    { category: "worldHeritage", ids: worldHeritage.map((w) => w.id) },
    { category: "foods", ids: foods.map((f) => f.id) },
    { category: "hotSprings", ids: hotSprings.map((h) => h.id) },
    { category: "sake", ids: sake.map((s) => s.id) },
    { category: "municipalities", ids: municipalities.map((m) => m.id) },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-muted">{pref.region}地方</p>
      <h1 className="font-heading mt-1 text-3xl font-bold text-foreground">
        <Ruby text={pref.name} kana={pref.kana} />
      </h1>
      <p className="mt-3 text-base leading-relaxed text-foreground/80">
        {pref.intro}
      </p>

      <section className="mt-6 rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold text-muted">あなたの記録</h2>
        <StatusToggle category="prefectures" id={pref.id} />
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface p-4">
        <PrefectureCompletion prefId={pref.id} groups={completionGroups} />
        <div className="mt-4 border-t border-border pt-4">
          <ResetPrefectureButton
            prefId={pref.id}
            prefName={pref.name}
            groups={completionGroups}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span aria-hidden>🏯</span> 観光地
        </h2>
        {spots.length === 0 ? (
          <p className="text-sm text-muted">観光地データは準備中です。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {spots.map((spot) => (
              <div key={spot.id} className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-medium text-accent">{spot.category}</span>
                <h3 className="font-semibold text-foreground">
                  <Ruby text={spot.name} kana={spot.kana} />
                </h3>
                <p className="mt-1 text-sm text-muted">{spot.description}</p>
                <div className="mt-3">
                  <CollectionItemPill category="spots" id={spot.id} label="行った?" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {worldHeritage.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
            <span aria-hidden>🏛️</span> 世界遺産
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {worldHeritage.map((site) => (
              <div key={site.id} className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-medium text-accent">
                  {site.type} / {site.year}年登録
                </span>
                <h3 className="font-semibold text-foreground">
                  <Ruby text={site.name} kana={site.kana} />
                </h3>
                <p className="mt-1 text-sm text-muted">{site.description}</p>
                <div className="mt-3">
                  <CollectionItemPill category="worldHeritage" id={site.id} label="行った?" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span aria-hidden>🍜</span> 郷土料理
        </h2>
        {foods.length === 0 ? (
          <p className="text-sm text-muted">郷土料理データは準備中です。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {foods.map((food) => (
              <div key={food.id} className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-medium text-accent">
                  {food.category} / {food.area}
                </span>
                <h3 className="font-semibold text-foreground">
                  <Ruby text={food.name} kana={food.kana} />
                </h3>
                <p className="mt-1 text-sm text-muted">{food.description}</p>
                <div className="mt-3">
                  <CollectionItemPill category="foods" id={food.id} label="食べた?" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span aria-hidden>♨️</span> 温泉
        </h2>
        {hotSprings.length === 0 ? (
          <p className="text-sm text-muted">温泉データは準備中です。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {hotSprings.map((hs) => (
              <div key={hs.id} className="rounded-xl border border-border bg-surface p-4">
                <h3 className="font-semibold text-foreground">
                  <Ruby text={hs.name} kana={hs.kana} />
                </h3>
                <p className="mt-1 text-sm text-muted">{hs.description}</p>
                <div className="mt-3">
                  <CollectionItemPill category="hotSprings" id={hs.id} label="行った?" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span aria-hidden>🍶</span> お酒
        </h2>
        {sake.length === 0 ? (
          <p className="text-sm text-muted">お酒データは準備中です。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sake.map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start gap-3">
                  <SakeIllustration category={s.category} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-accent">{s.category}</span>
                    <h3 className="font-semibold text-foreground">
                      <Ruby text={s.name} kana={s.kana} />
                    </h3>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                  </div>
                </div>
                {typeof s.sweetness === "number" && (
                  <div className="mt-3">
                    <SweetnessGauge value={s.sweetness} />
                  </div>
                )}
                <div className="mt-3">
                  <CollectionItemPill category="sake" id={s.id} label="飲んだ?" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="my-10">
        <AdSlot />
      </section>

      <section className="mt-10">
        <h2 className="font-heading mb-1 flex items-center gap-2 text-xl font-bold text-foreground">
          <span aria-hidden>🏙️</span> 市区町村
        </h2>
        <p className="mb-4 text-sm text-muted">
          {pref.name}内の市区町村({municipalities.length}件)
          {municipalityMap && "。地図をタップして記録できます。"}
        </p>
        {municipalityMap ? (
          <>
            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
              <MunicipalityMap
                viewBox={municipalityMap.MUNICIPALITY_MAP_VIEWBOX}
                shapes={municipalityMap.MUNICIPALITY_SHAPES}
              />
            </div>
            {municipalityMap.REMOTE_MUNICIPALITY_IDS.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-muted">
                  離島など地図に収まらない市区町村
                </p>
                <div className="flex flex-wrap gap-2">
                  {municipalities
                    .filter((m) => municipalityMap.REMOTE_MUNICIPALITY_IDS.includes(m.id))
                    .map((m) => (
                      <CollectionItemPill
                        key={m.id}
                        category="municipalities"
                        id={m.id}
                        label={m.name}
                        kana={m.kana}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {municipalities.map((m) => (
              <CollectionItemPill
                key={m.id}
                category="municipalities"
                id={m.id}
                label={m.name}
                kana={m.kana}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
