import prefecturesData from "@/data/prefectures.json";
import municipalitiesData from "@/data/municipalities.json";
import touristSpotsData from "@/data/tourist-spots.json";
import worldHeritageData from "@/data/world-heritage.json";
import localFoodsData from "@/data/local-foods.json";
import hotSpringsData from "@/data/hot-springs.json";
import sakeData from "@/data/sake.json";
import type {
  Prefecture,
  Municipality,
  TouristSpot,
  WorldHeritageSite,
  LocalFood,
  HotSpring,
  SakeItem,
  CollectionCategory,
} from "./types";

export const prefectures = prefecturesData as Prefecture[];
export const municipalities = municipalitiesData as Municipality[];
export const touristSpots = touristSpotsData as TouristSpot[];
export const worldHeritageSites = worldHeritageData as WorldHeritageSite[];
export const localFoods = localFoodsData as LocalFood[];
export const hotSprings = hotSpringsData as HotSpring[];
export const sakeItems = sakeData as SakeItem[];

export const REGIONS = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "関西",
  "中国",
  "四国",
  "九州・沖縄",
] as const;

export const CATEGORY_LABELS: Record<CollectionCategory, string> = {
  prefectures: "都道府県",
  spots: "観光地",
  worldHeritage: "世界遺産",
  foods: "郷土料理",
  hotSprings: "温泉地",
  municipalities: "市区町村",
  sake: "お酒",
};

export const CATEGORY_SLUGS: Record<CollectionCategory, string> = {
  prefectures: "prefectures",
  spots: "spots",
  worldHeritage: "world-heritage",
  foods: "food",
  hotSprings: "hot-springs",
  municipalities: "municipalities",
  sake: "sake",
};

export const SLUG_TO_CATEGORY: Record<string, CollectionCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category as CollectionCategory])
) as Record<string, CollectionCategory>;

export const CATEGORY_ICONS: Record<CollectionCategory, string> = {
  prefectures: "🗾",
  spots: "🏯",
  worldHeritage: "🏛️",
  foods: "🍜",
  hotSprings: "♨️",
  municipalities: "🏙️",
  sake: "🍶",
};

export function getTotalCount(category: CollectionCategory): number {
  switch (category) {
    case "prefectures":
      return prefectures.length;
    case "spots":
      return touristSpots.length;
    case "worldHeritage":
      return worldHeritageSites.length;
    case "foods":
      return localFoods.length;
    case "hotSprings":
      return hotSprings.length;
    case "municipalities":
      return municipalities.length;
    case "sake":
      return sakeItems.length;
  }
}

const prefectureById = new Map(prefectures.map((p) => [p.id, p]));

export function getPrefecture(id: string): Prefecture | undefined {
  return prefectureById.get(id);
}

export function getMunicipalitiesByPrefecture(prefId: string): Municipality[] {
  return municipalities.filter((m) => m.prefecture === prefId);
}

const municipalityByIdEarly = new Map(municipalities.map((m) => [m.id, m]));

export function getMunicipality(id: string): Municipality | undefined {
  return municipalityByIdEarly.get(id);
}

export function getSpotsByPrefecture(prefId: string): TouristSpot[] {
  return touristSpots.filter((s) => s.prefecture === prefId);
}

export function getFoodsByPrefecture(prefId: string): LocalFood[] {
  return localFoods.filter((f) => f.prefecture === prefId);
}

export function getHotSpringsByPrefecture(prefId: string): HotSpring[] {
  return hotSprings.filter((h) => h.prefecture === prefId);
}

export function getSakeByPrefecture(prefId: string): SakeItem[] {
  return sakeItems.filter((s) => s.prefecture === prefId);
}

export function getWorldHeritageByPrefecture(
  prefId: string
): WorldHeritageSite[] {
  return worldHeritageSites.filter((w) => w.prefectures.includes(prefId));
}

export function getPrefecturesByRegion(region: string): Prefecture[] {
  return prefectures.filter((p) => p.region === region);
}

export function regionOfPrefecture(prefId: string): string | undefined {
  return prefectureById.get(prefId)?.region;
}

export function regionsOfPrefectureIds(prefIds: string[]): string[] {
  return [...new Set(prefIds.map((id) => regionOfPrefecture(id)).filter(Boolean))] as string[];
}

const municipalityById = new Map(municipalities.map((m) => [m.id, m]));
const spotById = new Map(touristSpots.map((s) => [s.id, s]));
const worldHeritageById = new Map(worldHeritageSites.map((w) => [w.id, w]));
const foodById = new Map(localFoods.map((f) => [f.id, f]));
const hotSpringById = new Map(hotSprings.map((h) => [h.id, h]));
const sakeById = new Map(sakeItems.map((s) => [s.id, s]));

export interface SearchEntry {
  id: string;
  category: CollectionCategory;
  name: string;
  kana?: string;
  sub: string;
  href: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  ...prefectures.map((p) => ({
    id: p.id,
    category: "prefectures" as const,
    name: p.name,
    kana: p.kana,
    sub: "都道府県",
    href: `/prefectures/${p.id}`,
  })),
  ...municipalities.map((m) => ({
    id: m.id,
    category: "municipalities" as const,
    name: m.name,
    kana: m.kana,
    sub: `市区町村 / ${getPrefecture(m.prefecture)?.name ?? ""}`,
    href: `/prefectures/${m.prefecture}`,
  })),
  ...touristSpots.map((s) => ({
    id: s.id,
    category: "spots" as const,
    name: s.name,
    kana: s.kana,
    sub: `観光地 / ${getPrefecture(s.prefecture)?.name ?? ""}`,
    href: `/prefectures/${s.prefecture}`,
  })),
  ...worldHeritageSites.map((w) => ({
    id: w.id,
    category: "worldHeritage" as const,
    name: w.name,
    kana: w.kana,
    sub: "世界遺産",
    href: `/prefectures/${w.prefectures[0]}`,
  })),
  ...localFoods.map((f) => ({
    id: f.id,
    category: "foods" as const,
    name: f.name,
    kana: f.kana,
    sub: `郷土料理 / ${getPrefecture(f.prefecture)?.name ?? ""}`,
    href: `/prefectures/${f.prefecture}`,
  })),
  ...hotSprings.map((h) => ({
    id: h.id,
    category: "hotSprings" as const,
    name: h.name,
    kana: h.kana,
    sub: `温泉地 / ${getPrefecture(h.prefecture)?.name ?? ""}`,
    href: `/prefectures/${h.prefecture}`,
  })),
  ...sakeItems.map((s) => ({
    id: s.id,
    category: "sake" as const,
    name: s.name,
    kana: s.kana,
    sub: `お酒 / ${getPrefecture(s.prefecture)?.name ?? ""}`,
    href: `/prefectures/${s.prefecture}`,
  })),
];

export function searchAll(query: string): SearchEntry[] {
  const q = query.trim();
  if (!q) return [];
  const starts: SearchEntry[] = [];
  const includes: SearchEntry[] = [];
  for (const entry of SEARCH_INDEX) {
    if (entry.name.startsWith(q) || entry.kana?.startsWith(q)) {
      starts.push(entry);
    } else if (entry.name.includes(q) || entry.kana?.includes(q)) {
      includes.push(entry);
    }
  }
  return [...starts, ...includes].slice(0, 100);
}

export function getItemInfo(
  category: CollectionCategory,
  id: string
): { name: string; href: string } | undefined {
  switch (category) {
    case "prefectures": {
      const p = prefectureById.get(id);
      return p ? { name: p.name, href: `/prefectures/${p.id}` } : undefined;
    }
    case "municipalities": {
      const m = municipalityById.get(id);
      return m ? { name: m.name, href: `/prefectures/${m.prefecture}` } : undefined;
    }
    case "spots": {
      const s = spotById.get(id);
      return s ? { name: s.name, href: `/prefectures/${s.prefecture}` } : undefined;
    }
    case "worldHeritage": {
      const w = worldHeritageById.get(id);
      return w
        ? { name: w.name, href: `/prefectures/${w.prefectures[0]}` }
        : undefined;
    }
    case "foods": {
      const f = foodById.get(id);
      return f ? { name: f.name, href: `/prefectures/${f.prefecture}` } : undefined;
    }
    case "hotSprings": {
      const h = hotSpringById.get(id);
      return h ? { name: h.name, href: `/prefectures/${h.prefecture}` } : undefined;
    }
    case "sake": {
      const s = sakeById.get(id);
      return s ? { name: s.name, href: `/prefectures/${s.prefecture}` } : undefined;
    }
  }
}
