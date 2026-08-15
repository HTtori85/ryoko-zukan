"use client";

import { useEffect, useRef, useState } from "react";
import { useCollection, type ItemStatus } from "@/lib/CollectionContext";
import type { MunicipalityShape } from "@/lib/municipality-maps/fukuoka";
import { MapTooltip } from "@/components/MapTooltip";
import { Ruby } from "@/components/Ruby";
import { getMunicipality } from "@/lib/data";

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

export function MunicipalityMap({
  viewBox,
  shapes,
}: {
  viewBox: string;
  shapes: MunicipalityShape[];
}) {
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

  const activeShape = tooltip ? shapes.find((s) => s.id === tooltip.id) : null;
  const activeStatus =
    activeShape && hydrated ? getStatus("municipalities", activeShape.id) : "none";

  return (
    <div className="japan-map">
      <div ref={containerRef} className="relative">
        <svg
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="市区町村地図。タップすると名前と「行った/行きたい/未登録」が表示され、切り替えられます。"
          className="h-auto w-full"
        >
          {shapes.map((shape) => {
            const status = hydrated ? getStatus("municipalities", shape.id) : "none";
            return (
              <g
                key={shape.id}
                className={`prefecture-shape ${statusClassName(status)}`}
                role="button"
                tabIndex={0}
                aria-label={`${shape.name}: ${STATUS_LABEL[status]}。タップで切り替え`}
                onMouseEnter={(e) => {
                  if (tooltip?.pinned && tooltip.id === shape.id) return;
                  showTooltipAt(shape.id, e.clientX, e.clientY, false);
                }}
                onMouseLeave={() => {
                  scheduleHide(shape.id);
                }}
                onFocus={(e) => {
                  if (tooltip?.pinned && tooltip.id === shape.id) return;
                  const rect = (e.target as SVGGElement).getBoundingClientRect();
                  showTooltipAt(shape.id, rect.left + rect.width / 2, rect.top, false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  showTooltipAt(shape.id, e.clientX, e.clientY, true);
                  cycleStatus("municipalities", shape.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    cycleStatus("municipalities", shape.id);
                  }
                }}
              >
                <path d={shape.d} fillRule="evenodd" />
              </g>
            );
          })}
        </svg>

        {tooltip && activeShape && (
          <MapTooltip
            x={tooltip.x}
            y={tooltip.y}
            onMouseEnter={cancelHide}
            onMouseLeave={() => {
              if (!tooltip.pinned) scheduleHide(tooltip.id);
            }}
          >
            <span className="font-semibold">
              <Ruby text={activeShape.name} kana={getMunicipality(activeShape.id)?.kana} />
            </span>
            <span className="ml-2 opacity-80">{STATUS_LABEL[activeStatus]}</span>
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
        地図データ: 国土交通省 国土数値情報(行政区域データ)を加工
      </p>
    </div>
  );
}
