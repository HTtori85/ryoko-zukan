"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCollection } from "@/lib/CollectionContext";
import { CollectionItemPill } from "@/components/CollectionItemPill";
import { SakeIllustration } from "@/components/SakeIllustration";
import { SweetnessGauge } from "@/components/SweetnessGauge";
import { Ruby } from "@/components/Ruby";
import { REGIONS } from "@/lib/data";
import type { CollectionCategory } from "@/lib/types";

export interface FilterableItem {
  id: string;
  name: string;
  kana?: string;
  regions: string[];
  prefectureId?: string;
  prefectureName?: string;
  meta?: string;
  description?: string;
  sweetness?: number;
}

export function CategoryFilterableList({
  category,
  items,
  mode = "pill",
}: {
  category: CollectionCategory;
  items: FilterableItem[];
  mode?: "pill" | "card";
}) {
  const [region, setRegion] = useState<string>("all");
  const [unvisitedOnly, setUnvisitedOnly] = useState(false);
  const { getStatus, hydrated } = useCollection();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (region !== "all" && !item.regions.includes(region)) return false;
      if (unvisitedOnly && hydrated && getStatus(category, item.id) === "visited") {
        return false;
      }
      return true;
    });
  }, [items, region, unvisitedOnly, hydrated, getStatus, category]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setRegion("all")}
          className={`min-h-[40px] rounded-full border px-3.5 py-2 text-sm transition-colors ${
            region === "all"
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-surface text-muted hover:border-accent"
          }`}
        >
          すべて
        </button>
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`min-h-[40px] rounded-full border px-3.5 py-2 text-sm transition-colors ${
              region === r
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface text-muted hover:border-accent"
            }`}
          >
            {r}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={unvisitedOnly}
            onChange={(e) => setUnvisitedOnly(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          まだ行っていないものだけ表示
        </label>
      </div>

      <p className="mb-3 text-sm text-muted">{filtered.length}件</p>

      {mode === "pill" ? (
        <div className="flex flex-wrap gap-2">
          {filtered.map((item) => (
            <CollectionItemPill
              key={item.id}
              category={category}
              id={item.id}
              label={item.name}
              kana={item.kana}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start gap-3">
                {category === "sake" && <SakeIllustration category={item.meta ?? "日本酒"} />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.meta && (
                        <span className="text-xs font-medium text-accent">{item.meta}</span>
                      )}
                      <h3 className="font-semibold text-foreground">
                        <Ruby text={item.name} kana={item.kana} />
                      </h3>
                    </div>
                    {item.prefectureId && (
                      <Link
                        href={`/prefectures/${item.prefectureId}`}
                        className="shrink-0 text-xs text-muted underline hover:text-accent"
                      >
                        {item.prefectureName}
                      </Link>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  )}
                </div>
              </div>
              {typeof item.sweetness === "number" && (
                <div className="mt-3">
                  <SweetnessGauge value={item.sweetness} />
                </div>
              )}
              <div className="mt-3">
                <CollectionItemPill category={category} id={item.id} label="行った?" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
