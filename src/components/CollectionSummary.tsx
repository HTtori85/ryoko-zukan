"use client";

import Link from "next/link";
import { useCollection } from "@/lib/CollectionContext";
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/data";
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

export function CollectionSummary() {
  const { counts, hydrated } = useCollection();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" suppressHydrationWarning>
      {ORDER.map((category) => {
        const { visited, total } = counts(category);
        const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
        return (
          <Link
            key={category}
            href={`/collection/${CATEGORY_SLUGS[category]}`}
            className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent"
          >
            <span className="text-xl" aria-hidden>
              {CATEGORY_ICONS[category]}
            </span>
            <span className="text-sm font-medium text-muted">
              {CATEGORY_LABELS[category]}
            </span>
            <span className="font-heading text-lg font-bold text-foreground">
              {hydrated ? visited : 0}
              <span className="text-sm font-normal text-muted"> / {total.toLocaleString("ja-JP")}</span>
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${hydrated ? pct : 0}%` }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
