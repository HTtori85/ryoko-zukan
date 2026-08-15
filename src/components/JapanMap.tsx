"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  JAPAN_MAP_BOUNDARY_INNER,
  JAPAN_MAP_ENTRIES,
  JAPAN_MAP_OUTER_TRANSFORM,
  JAPAN_MAP_PREFECTURES_TRANSFORM,
} from "@/lib/japan-map-data";
import { useCollection, type ItemStatus } from "@/lib/CollectionContext";
import { getPrefecture } from "@/lib/data";
import { MapTooltip } from "@/components/MapTooltip";
import { Ruby } from "@/components/Ruby";

function statusClassName(status: ItemStatus) {
  if (status === "visited") return "fill-visited";
  if (status === "wishlist") return "fill-wishlist";
  return "fill-none";
}

const STATUS_LABEL: Record<ItemStatus, string> = {
  none: "未登録",
  visited: "行った",
  wishlist: "行きたい",
};

interface TooltipState {
  id: string;
  x: number;
  y: number;
  pinned: boolean;
}

export function JapanMap() {
  const { getStatus, cycleStatus, hydrated } = useCollection();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // カーソルが図形とツールチップの間の隙間を通っている間に消えてしまわないよう、
  // 少し待ってから(ピン留めされていなければ)閉じる
  const scheduleHide = (id: string) => {
    cancelHide();
    hideTimeoutRef.current = setTimeout(() => {
      setTooltip((cur) => (cur?.id === id && !cur.pinned ? null : cur));
    }, 200);
  };

  const showTooltipAt = (id: string, clientX: number, clientY: number, pinned: boolean) => {
    cancelHide();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ id, x: clientX - rect.left, y: clientY - rect.top, pinned });
  };

  useEffect(() => {
    return () => cancelHide();
  }, []);

  // ピン留めされたツールチップは、地図の外側をクリックしたときだけ閉じる
  useEffect(() => {
    if (!tooltip?.pinned) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setTooltip(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [tooltip?.pinned]);

  const activeEntry = tooltip ? JAPAN_MAP_ENTRIES.find((e) => e.id === tooltip.id) : null;
  const activePref = activeEntry ? getPrefecture(activeEntry.id) : null;
  const activeStatus =
    activeEntry && hydrated ? getStatus("prefectures", activeEntry.id) : "none";

  return (
    <div className="japan-map">
      <div ref={containerRef} className="relative">
        <svg
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="日本地図。都道府県をタップすると名前と「行った/行きたい/未登録」が表示され、切り替えられます。"
          className="h-auto w-full"
        >
          <g transform={JAPAN_MAP_OUTER_TRANSFORM}>
            <g transform={JAPAN_MAP_PREFECTURES_TRANSFORM}>
              {JAPAN_MAP_ENTRIES.map((entry) => {
                const status = hydrated ? getStatus("prefectures", entry.id) : "none";
                const pref = getPrefecture(entry.id);
                const name = pref ? pref.name : entry.title;
                return (
                  <g
                    key={entry.id}
                    className={`prefecture-shape ${statusClassName(status)}`}
                    data-code={entry.code}
                    transform={entry.transform}
                    role="button"
                    tabIndex={0}
                    aria-label={`${name}: ${STATUS_LABEL[status]}。タップで切り替え`}
                    onMouseEnter={(e) => {
                      if (tooltip?.pinned && tooltip.id === entry.id) return;
                      showTooltipAt(entry.id, e.clientX, e.clientY, false);
                    }}
                    onMouseLeave={() => {
                      scheduleHide(entry.id);
                    }}
                    onFocus={(e) => {
                      if (tooltip?.pinned && tooltip.id === entry.id) return;
                      const rect = (e.target as SVGGElement).getBoundingClientRect();
                      showTooltipAt(entry.id, rect.left + rect.width / 2, rect.top, false);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      showTooltipAt(entry.id, e.clientX, e.clientY, true);
                      cycleStatus("prefectures", entry.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        cycleStatus("prefectures", entry.id);
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: entry.inner }}
                  />
                );
              })}
            </g>
            <g
              className="boundary-line"
              stroke="#ffffff"
              strokeWidth={1.5}
              strokeLinejoin="round"
              pointerEvents="none"
              dangerouslySetInnerHTML={{ __html: JAPAN_MAP_BOUNDARY_INNER }}
            />
          </g>
        </svg>

        {tooltip && activeEntry && (
          <MapTooltip
            x={tooltip.x}
            y={tooltip.y}
            onMouseEnter={cancelHide}
            onMouseLeave={() => {
              if (!tooltip.pinned) scheduleHide(tooltip.id);
            }}
          >
            <span className="font-semibold">
              {activePref ? (
                <Ruby text={activePref.name} kana={activePref.kana} />
              ) : (
                activeEntry.title
              )}
            </span>
            <span className="ml-2 opacity-80">{STATUS_LABEL[activeStatus]}</span>
            {activePref && (
              <Link
                href={`/prefectures/${activePref.id}`}
                className="ml-2 underline decoration-background/60 underline-offset-2 hover:decoration-background"
              >
                詳細を見る →
              </Link>
            )}
          </MapTooltip>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-visited" aria-hidden /> 行った
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-wishlist" aria-hidden /> 行きたい
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" aria-hidden /> 未登録
        </span>
        <span className="ml-auto">タップで記録を切り替え</span>
      </div>

      <p className="mt-2 text-right text-xs text-stone-400">
        地図データ:{" "}
        <a
          href="https://github.com/geolonia/japanese-prefectures"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-stone-600"
        >
          Geolonia (GFDL)
        </a>
      </p>
    </div>
  );
}
