import type { CollectionCategory } from "./types";

export const STORAGE_KEY = "nihon-ryoko-zukan:v1";

export type CollectionState = {
  visited: Record<CollectionCategory, string[]>;
  wishlist: Record<CollectionCategory, string[]>;
};

const CATEGORIES: CollectionCategory[] = [
  "prefectures",
  "spots",
  "worldHeritage",
  "foods",
  "hotSprings",
  "municipalities",
  "sake",
];

export function createEmptyState(): CollectionState {
  return {
    visited: {
      prefectures: [],
      spots: [],
      worldHeritage: [],
      foods: [],
      hotSprings: [],
      municipalities: [],
      sake: [],
    },
    wishlist: {
      prefectures: [],
      spots: [],
      worldHeritage: [],
      foods: [],
      hotSprings: [],
      municipalities: [],
      sake: [],
    },
  };
}

export function loadState(): CollectionState {
  if (typeof window === "undefined") return createEmptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    const parsed = JSON.parse(raw);
    const empty = createEmptyState();
    for (const cat of CATEGORIES) {
      if (Array.isArray(parsed?.visited?.[cat])) {
        empty.visited[cat] = parsed.visited[cat];
      }
      if (Array.isArray(parsed?.wishlist?.[cat])) {
        empty.wishlist[cat] = parsed.wishlist[cat];
      }
    }
    return empty;
  } catch {
    return createEmptyState();
  }
}

export function saveState(state: CollectionState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorageが使えない環境(プライベートモード等)では何もしない
  }
}
