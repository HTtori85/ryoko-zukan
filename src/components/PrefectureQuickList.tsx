"use client";

import Link from "next/link";
import { useCollection } from "@/lib/CollectionContext";
import { REGIONS, getPrefecturesByRegion } from "@/lib/data";
import { Ruby } from "@/components/Ruby";

function dotClass(status: "none" | "visited" | "wishlist") {
  if (status === "visited") return "bg-visited";
  if (status === "wishlist") return "bg-wishlist";
  return "bg-border";
}

export function PrefectureQuickList() {
  const { getStatus, hydrated } = useCollection();

  return (
    <div className="space-y-5" suppressHydrationWarning>
      {REGIONS.map((region) => (
        <div key={region}>
          <h3 className="mb-2 text-xs font-semibold text-muted">{region}</h3>
          <div className="flex flex-wrap gap-2">
            {getPrefecturesByRegion(region).map((pref) => {
              const status = hydrated ? getStatus("prefectures", pref.id) : "none";
              return (
                <Link
                  key={pref.id}
                  href={`/prefectures/${pref.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent"
                >
                  <span className={`h-2 w-2 rounded-full ${dotClass(status)}`} aria-hidden />
                  <Ruby text={pref.name} kana={pref.kana} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
