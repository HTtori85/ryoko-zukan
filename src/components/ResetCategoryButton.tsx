"use client";

import { useState } from "react";
import { useCollection } from "@/lib/CollectionContext";
import type { CollectionCategory } from "@/lib/types";

export function ResetCategoryButton({
  category,
  categoryLabel,
}: {
  category: CollectionCategory;
  categoryLabel: string;
}) {
  const { resetCategory } = useCollection();
  const [done, setDone] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          const ok = window.confirm(
            `${categoryLabel}の記録をすべてリセットします。この操作は取り消せません。よろしいですか?`
          );
          if (!ok) return;
          resetCategory(category);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
        className="rounded-full border border-border px-3.5 py-2 text-xs text-muted transition-colors hover:border-wishlist hover:text-wishlist"
      >
        {categoryLabel}をすべてリセット
      </button>
      {done && <span className="text-xs text-visited">リセットしました</span>}
    </div>
  );
}
