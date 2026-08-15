export type CollectionCategory =
  | "prefectures"
  | "spots"
  | "worldHeritage"
  | "foods"
  | "hotSprings"
  | "municipalities"
  | "sake";

export interface Prefecture {
  id: string;
  name: string;
  kana: string;
  region: string;
  capital: string;
  intro: string;
}

export interface Municipality {
  id: string;
  prefecture: string;
  name: string;
  kana: string;
}

export interface TouristSpot {
  id: string;
  prefecture: string;
  name: string;
  kana: string;
  category: string;
  description: string;
}

export interface WorldHeritageSite {
  id: string;
  name: string;
  kana: string;
  prefectures: string[];
  type: "文化" | "自然";
  year: number;
  description: string;
  relatedSpots: string[];
}

export interface LocalFood {
  id: string;
  prefecture: string;
  name: string;
  kana: string;
  area: string;
  category: string;
  description: string;
}

export interface HotSpring {
  id: string;
  prefecture: string;
  name: string;
  kana: string;
  description: string;
}

export interface SakeItem {
  id: string;
  prefecture: string;
  name: string;
  kana: string;
  category: string;
  /** 甘辛度の目安。-3(甘口)〜+3(辛口)。日本酒以外や不明な場合は省略。 */
  sweetness?: number;
  description: string;
}
