"use client";

import Link from "next/link";
import { useCollection } from "@/lib/CollectionContext";
import { CATEGORY_ICONS, CATEGORY_LABELS, getItemInfo } from "@/lib/data";
import type { CollectionCategory } from "@/lib/types";

const ORDER: CollectionCategory[] = [
  "prefectures",
  "spots",
  "worldHeritage",
  "foods",
  "hotSprings",
  "municipalities",
  "sake",
];

export function WishlistOverview() {
  const { wishlistItems, hydrated } = useCollection();

  if (!hydrated) return null;

  const rows = ORDER.flatMap((category) =>
    wishlistItems(category)
      .map((id) => {
        const info = getItemInfo(category, id);
        if (!info) return null;
        return { category, id, ...info };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  );

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted">
        「♡ 行きたい」に登録した場所がここに表示されます。
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {rows.map((row) => (
        <Link
          key={`${row.category}-${row.id}`}
          href={row.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-wishlist/40 bg-wishlist/10 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-wishlist"
        >
          <span aria-hidden>{CATEGORY_ICONS[row.category]}</span>
          {row.name}
          <span className="text-xs text-muted">{CATEGORY_LABELS[row.category]}</span>
        </Link>
      ))}
    </div>
  );
}
