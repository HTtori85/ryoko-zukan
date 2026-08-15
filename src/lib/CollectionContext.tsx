"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CollectionCategory } from "./types";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setItemStatus,
  resetAll as resetAllInStore,
  removeItems as removeItemsInStore,
  resetCategory as resetCategoryInStore,
} from "./store";
import { getTotalCount } from "./data";

export type ItemStatus = "none" | "visited" | "wishlist";

function noopSubscribe() {
  return () => {};
}

/** サーバーでは false、クライアントでのマウント後は true を返す(hydrationミスマッチを起こさない) */
function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * このコンポーネントは後方互換のために残しているだけで、Contextは使用しない。
 * 状態は lib/store.ts のモジュール単位のストアで一元管理している。
 */
export function CollectionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCollection() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();

  const getStatus = useCallback(
    (category: CollectionCategory, id: string): ItemStatus => {
      if (state.visited[category].includes(id)) return "visited";
      if (state.wishlist[category].includes(id)) return "wishlist";
      return "none";
    },
    [state]
  );

  const setStatus = useCallback(
    (category: CollectionCategory, id: string, status: ItemStatus) => {
      setItemStatus(category, id, status);
    },
    []
  );

  const cycleStatus = useCallback(
    (category: CollectionCategory, id: string) => {
      const current = getStatus(category, id);
      const nextStatus: ItemStatus =
        current === "none" ? "visited" : current === "visited" ? "wishlist" : "none";
      setStatus(category, id, nextStatus);
    },
    [getStatus, setStatus]
  );

  const counts = useCallback(
    (category: CollectionCategory) => ({
      visited: state.visited[category].length,
      wishlist: state.wishlist[category].length,
      total: getTotalCount(category),
    }),
    [state]
  );

  const wishlistItems = useCallback(
    (category: CollectionCategory) => state.wishlist[category],
    [state]
  );

  const resetAll = useCallback(() => {
    resetAllInStore();
  }, []);

  const removeItems = useCallback(
    (entries: { category: CollectionCategory; id: string }[]) => {
      removeItemsInStore(entries);
    },
    []
  );

  const resetCategory = useCallback((category: CollectionCategory) => {
    resetCategoryInStore(category);
  }, []);

  return {
    hydrated,
    getStatus,
    setStatus,
    cycleStatus,
    counts,
    wishlistItems,
    resetAll,
    removeItems,
    resetCategory,
  };
}
