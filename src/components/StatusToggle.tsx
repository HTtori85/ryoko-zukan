"use client";

import { useCollection } from "@/lib/CollectionContext";
import type { CollectionCategory } from "@/lib/types";

export function StatusToggle({
  category,
  id,
  size = "md",
}: {
  category: CollectionCategory;
  id: string;
  size?: "sm" | "md";
}) {
  const { getStatus, setStatus, hydrated } = useCollection();
  const status = hydrated ? getStatus(category, id) : "none";

  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";

  return (
    <div className="inline-flex items-center gap-2" suppressHydrationWarning>
      <button
        type="button"
        onClick={() =>
          setStatus(category, id, status === "visited" ? "none" : "visited")
        }
        aria-pressed={status === "visited"}
        className={`${padding} rounded-full border font-medium transition-colors ${
          status === "visited"
            ? "border-visited bg-visited text-white"
            : "border-border bg-surface text-muted hover:border-visited hover:text-visited"
        }`}
      >
        ✓ 行った
      </button>
      <button
        type="button"
        onClick={() =>
          setStatus(category, id, status === "wishlist" ? "none" : "wishlist")
        }
        aria-pressed={status === "wishlist"}
        className={`${padding} rounded-full border font-medium transition-colors ${
          status === "wishlist"
            ? "border-wishlist bg-wishlist text-white"
            : "border-border bg-surface text-muted hover:border-wishlist hover:text-wishlist"
        }`}
      >
        ♡ 行きたい
      </button>
    </div>
  );
}
