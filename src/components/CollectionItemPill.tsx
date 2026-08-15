"use client";

import { useCollection, type ItemStatus } from "@/lib/CollectionContext";
import type { CollectionCategory } from "@/lib/types";
import { Ruby } from "@/components/Ruby";

const ICONS: Record<ItemStatus, string> = {
  none: "○",
  visited: "✓",
  wishlist: "♡",
};

const NEXT_STATUS: Record<ItemStatus, ItemStatus> = {
  none: "visited",
  visited: "wishlist",
  wishlist: "none",
};

export function CollectionItemPill({
  category,
  id,
  label,
  kana,
}: {
  category: CollectionCategory;
  id: string;
  label: string;
  kana?: string;
}) {
  const { getStatus, setStatus, hydrated } = useCollection();
  const status = hydrated ? getStatus(category, id) : "none";

  const colorClass =
    status === "visited"
      ? "border-visited bg-visited/10 text-visited"
      : status === "wishlist"
      ? "border-wishlist bg-wishlist/10 text-wishlist"
      : "border-border bg-surface text-foreground hover:border-accent";

  return (
    <button
      type="button"
      onClick={() => setStatus(category, id, NEXT_STATUS[status])}
      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${colorClass}`}
      aria-label={`${label}: ${
        status === "visited" ? "行った" : status === "wishlist" ? "行きたい" : "未登録"
      }`}
      suppressHydrationWarning
    >
      <span aria-hidden>{ICONS[status]}</span>
      <Ruby text={label} kana={kana} />
    </button>
  );
}
