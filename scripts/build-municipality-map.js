// 市区町村レベルの地図データ(SVGパス)を生成するスクリプト。
// 使い方: node scripts/build-municipality-map.js <prefId> <geojsonPath> <outTsPath>
const fs = require("fs");
const path = require("path");

const [, , prefId, geojsonPath, outTsPath] = process.argv;
if (!prefId || !geojsonPath || !outTsPath) {
  console.error("usage: node build-municipality-map.js <prefId> <geojsonPath> <outTsPath>");
  process.exit(1);
}

const gj = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
const municipalities = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "municipalities.json"), "utf-8")
).filter((m) => m.prefecture === prefId);
const nameToId = new Map(municipalities.map((m) => [m.name, m.id]));

function groupKey(props) {
  if (props.N03_003 && props.N03_003.endsWith("市")) return props.N03_003;
  return props.N03_004;
}

// 市区町村ごとにfeatureをまとめる
const byName = new Map();
for (const feature of gj.features) {
  const key = groupKey(feature.properties);
  const id = nameToId.get(key);
  if (!id) continue; // 所属未定地など、対象外の地形はスキップ
  if (!byName.has(id)) byName.set(id, { id, name: key, rings: [] });
  const entry = byName.get(id);
  const geom = feature.geometry;
  if (geom.type === "Polygon") {
    entry.rings.push(...geom.coordinates);
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.coordinates) entry.rings.push(...poly);
  }
}

console.log(`matched ${byName.size} / ${municipalities.length} municipalities`);
const missing = municipalities.filter((m) => !byName.has(m.id));
if (missing.length) {
  console.log("missing:", missing.map((m) => m.name).join(", "));
}

// 緯度平均でcosをかけて経度方向のアスペクト比を補正した平面座標に変換
let latSum = 0;
let latCount = 0;
for (const entry of byName.values()) {
  for (const ring of entry.rings) {
    for (const [, lat] of ring) {
      latSum += lat;
      latCount++;
    }
  }
}
const latMeanRad = (latSum / latCount) * (Math.PI / 180);
const cosLat = Math.cos(latMeanRad);

function centroidOf(entry) {
  let sx = 0,
    sy = 0,
    n = 0;
  for (const ring of entry.rings) {
    for (const [lon, lat] of ring) {
      sx += lon * cosLat;
      sy += lat;
      n++;
    }
  }
  return [sx / n, sy / n];
}

for (const entry of byName.values()) {
  entry.centroid = centroidOf(entry);
}

// 本土から極端に離れた離島(例: 東京都の伊豆・小笠原諸島)を検出し、地図の投影範囲から除外する。
// 中央値からの距離をもとに外れ値を判定する(ロバストな手法)。
const entries = [...byName.values()];
function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
const medianX = median(entries.map((e) => e.centroid[0]));
const medianY = median(entries.map((e) => e.centroid[1]));
const distances = entries.map((e) => Math.hypot(e.centroid[0] - medianX, e.centroid[1] - medianY));
const medianDist = median(distances) || 0.01;

const REMOTE_THRESHOLD = 6; // 中央値距離の6倍以上離れていたら「離島」扱い
const coreEntries = [];
const remoteEntries = [];
entries.forEach((e, i) => {
  if (distances[i] > medianDist * REMOTE_THRESHOLD && distances[i] > 0.3) {
    remoteEntries.push(e);
  } else {
    coreEntries.push(e);
  }
});

if (remoteEntries.length) {
  console.log(
    "remote (excluded from map, shown as list):",
    remoteEntries.map((e) => e.name).join(", ")
  );
}

let lonMin = Infinity,
  lonMax = -Infinity,
  latMin = Infinity,
  latMax = -Infinity;
for (const entry of coreEntries) {
  for (const ring of entry.rings) {
    for (const [lon, lat] of ring) {
      const x = lon * cosLat;
      if (x < lonMin) lonMin = x;
      if (x > lonMax) lonMax = x;
      if (lat < latMin) latMin = lat;
      if (lat > latMax) latMax = lat;
    }
  }
}

const VIEW_SIZE = 1000;
const PADDING = 20;
const width = lonMax - lonMin;
const height = latMax - latMin;
const scale = (VIEW_SIZE - PADDING * 2) / Math.max(width, height);
const viewW = width * scale + PADDING * 2;
const viewH = height * scale + PADDING * 2;

function project([lon, lat]) {
  const x = (lon * cosLat - lonMin) * scale + PADDING;
  const y = (latMax - lat) * scale + PADDING;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function ringToPath(ring) {
  const pts = ring.map(project);
  return "M" + pts.map((p) => p.join(",")).join("L") + "Z";
}

const output = coreEntries.map((entry) => ({
  id: entry.id,
  name: entry.name,
  d: entry.rings.map(ringToPath).join(" "),
}));

const remoteIds = remoteEntries.map((e) => e.id);

const ts = `// ${prefId} の市区町村地図データ(国土数値情報 行政区域データを加工/出典: 国土交通省 国土数値情報、スマートニュース メディア研究所 japan-topography)
export interface MunicipalityShape {
  id: string;
  name: string;
  d: string;
}

export const MUNICIPALITY_MAP_VIEWBOX = "0 0 ${Math.round(viewW)} ${Math.round(viewH)}";

export const MUNICIPALITY_SHAPES: MunicipalityShape[] = ${JSON.stringify(output)};

// 本土から大きく離れているため地図には描画せず、一覧表示にまわす市区町村のID
export const REMOTE_MUNICIPALITY_IDS: string[] = ${JSON.stringify(remoteIds)};
`;

fs.writeFileSync(outTsPath, ts, "utf-8");
console.log("written:", outTsPath, `(${Math.round(fs.statSync(outTsPath).size / 1024)} KB)`);
