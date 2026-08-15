"use client";

import { useCollection } from "@/lib/CollectionContext";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/data";
import type { CollectionCategory } from "@/lib/types";

export interface CompletionGroup {
  category: CollectionCategory;
  ids: string[];
}

export function PrefectureCompletion({
  prefId,
  groups,
}: {
  prefId: string;
  groups: CompletionGroup[];
}) {
  const { getStatus, hydrated } = useCollection();

  const prefVisited = hydrated && getStatus("prefectures", prefId) === "visited" ? 1 : 0;

  const breakdown = groups
    .filter((g) => g.ids.length > 0)
    .map((group) => {
      const visited = hydrated
        ? group.ids.filter((id) => getStatus(group.category, id) === "visited").length
        : 0;
      return { category: group.category, visited, total: group.ids.length };
    });

  const total = 1 + breakdown.reduce((sum, g) => sum + g.total, 0);
  const visited = prefVisited + breakdown.reduce((sum, g) => sum + g.visited, 0);

  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
  const isPerfect = hydrated && total > 0 && visited === total;

  return (
    <div suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted">この県の制覇率</span>
        {isPerfect && (
          <span className="inline-flex items-center gap-1 rounded-full bg-wishlist/15 px-2.5 py-1 text-xs font-bold text-wishlist">
            🏆 完全制覇！
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all ${isPerfect ? "bg-wishlist" : "bg-accent"}`}
            style={{ width: `${hydrated ? pct : 0}%` }}
          />
        </div>
        <span className="font-heading shrink-0 text-lg font-bold text-foreground">
          {hydrated ? pct : 0}%
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">{hydrated ? visited : 0} / {total}件</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {breakdown.map((g) => {
          const gPct = g.total > 0 ? Math.round((g.visited / g.total) * 100) : 0;
          return (
            <div key={g.category} className="rounded-lg bg-background p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span aria-hidden>{CATEGORY_ICONS[g.category]}</span>
                {CATEGORY_LABELS[g.category]}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground">
                  {hydrated ? g.visited : 0}
                </span>
                <span className="text-xs text-muted">/ {g.total}</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${hydrated ? gPct : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
