"use client";

import { useMemo, useState } from "react";
import { useCollection } from "@/lib/CollectionContext";
import { CollectionItemPill } from "@/components/CollectionItemPill";
import { REGIONS, getPrefecturesByRegion, prefectures } from "@/lib/data";
import type { Municipality } from "@/lib/types";

export function MunicipalitiesBrowser({ municipalities }: { municipalities: Municipality[] }) {
  const [region, setRegion] = useState<string>("all");
  const [prefectureId, setPrefectureId] = useState<string>("all");
  const [unvisitedOnly, setUnvisitedOnly] = useState(false);
  const { getStatus, hydrated } = useCollection();

  const prefOptions = region === "all" ? prefectures : getPrefecturesByRegion(region);

  const filtered = useMemo(() => {
    return municipalities.filter((m) => {
      if (prefectureId !== "all" && m.prefecture !== prefectureId) return false;
      if (prefectureId === "all" && region !== "all") {
        const inRegion = prefOptions.some((p) => p.id === m.prefecture);
        if (!inRegion) return false;
      }
      if (unvisitedOnly && hydrated && getStatus("municipalities", m.id) === "visited") {
        return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipalities, region, prefectureId, unvisitedOnly, hydrated, getStatus]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setPrefectureId("all");
          }}
          className="min-h-[40px] rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-foreground"
        >
          <option value="all">地方: すべて</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={prefectureId}
          onChange={(e) => setPrefectureId(e.target.value)}
          className="min-h-[40px] rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-foreground"
        >
          <option value="all">都道府県: すべて</option>
          {prefOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
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

      <p className="mb-3 text-sm text-muted">{filtered.length.toLocaleString("ja-JP")}件</p>

      <div className="flex flex-wrap gap-2">
        {filtered.map((m) => (
          <CollectionItemPill
            key={m.id}
            category="municipalities"
            id={m.id}
            label={m.name}
            kana={m.kana}
          />
        ))}
      </div>
    </div>
  );
}
