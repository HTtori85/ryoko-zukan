"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_ICONS } from "@/lib/data";
import { searchAll } from "@/lib/data";
import { Ruby } from "@/components/Ruby";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const results = searchAll(query);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="都道府県・市区町村・観光地・世界遺産・郷土料理・温泉地を検索"
        autoFocus
        className="w-full rounded-full border border-border bg-surface px-5 py-3 text-base text-foreground outline-none focus:border-accent"
      />

      {query.trim() && (
        <p className="mt-4 mb-2 text-sm text-muted">
          {results.length > 0 ? `${results.length}件見つかりました` : "見つかりませんでした"}
        </p>
      )}

      <ul className="mt-2 divide-y divide-border">
        {results.map((r) => (
          <li key={`${r.category}-${r.id}`}>
            <Link
              href={r.href}
              className="flex items-center gap-3 py-3 transition-colors hover:text-accent"
            >
              <span className="text-xl" aria-hidden>
                {CATEGORY_ICONS[r.category]}
              </span>
              <span>
                <span className="block font-medium text-foreground">
                  <Ruby text={r.name} kana={r.kana} />
                </span>
                <span className="block text-xs text-muted">{r.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
