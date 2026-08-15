import type { CollectionCategory } from "./types";
import { STORAGE_KEY, createEmptyState, type CollectionState } from "./storage";

type Listener = () => void;

const CATEGORIES: CollectionCategory[] = [
  "prefectures",
  "spots",
  "worldHeritage",
  "foods",
  "hotSprings",
  "municipalities",
  "sake",
];

let state: CollectionState = createEmptyState();
let initialized = false;
const listeners = new Set<Listener>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const next = createEmptyState();
      for (const cat of CATEGORIES) {
        if (Array.isArray(parsed?.visited?.[cat])) next.visited[cat] = parsed.visited[cat];
        if (Array.isArray(parsed?.wishlist?.[cat])) next.wishlist[cat] = parsed.wishlist[cat];
      }
      state = next;
    }
  } catch {
    // localStorageが使えない/壊れている場合は初期状態のまま
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 保存できない環境(プライベートモード等)では何もしない
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): CollectionState {
  ensureInitialized();
  return state;
}

const SERVER_SNAPSHOT: CollectionState = createEmptyState();

export function getServerSnapshot(): CollectionState {
  return SERVER_SNAPSHOT;
}

function removeFrom(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : list;
}

export function setItemStatus(
  category: CollectionCategory,
  id: string,
  status: "none" | "visited" | "wishlist"
) {
  ensureInitialized();
  const next: CollectionState = {
    visited: { ...state.visited },
    wishlist: { ...state.wishlist },
  };
  next.visited[category] = removeFrom(next.visited[category], id);
  next.wishlist[category] = removeFrom(next.wishlist[category], id);
  if (status === "visited") {
    next.visited[category] = [...next.visited[category], id];
  } else if (status === "wishlist") {
    next.wishlist[category] = [...next.wishlist[category], id];
  }
  state = next;
  persist();
  emit();
}

/** 全カテゴリの記録を空にする */
export function resetAll() {
  ensureInitialized();
  state = createEmptyState();
  persist();
  emit();
}

/** 指定したカテゴリだけ、全件の記録を空にする */
export function resetCategory(category: CollectionCategory) {
  ensureInitialized();
  const next: CollectionState = {
    visited: { ...state.visited, [category]: [] },
    wishlist: { ...state.wishlist, [category]: [] },
  };
  state = next;
  persist();
  emit();
}

/** 指定した(category, id)の組をまとめて「未登録」に戻す */
export function removeItems(entries: { category: CollectionCategory; id: string }[]) {
  ensureInitialized();
  const next: CollectionState = {
    visited: { ...state.visited },
    wishlist: { ...state.wishlist },
  };
  for (const cat of CATEGORIES) {
    next.visited[cat] = [...next.visited[cat]];
    next.wishlist[cat] = [...next.wishlist[cat]];
  }
  for (const { category, id } of entries) {
    next.visited[category] = removeFrom(next.visited[category], id);
    next.wishlist[category] = removeFrom(next.wishlist[category], id);
  }
  state = next;
  persist();
  emit();
}
