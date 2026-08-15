"use client";

import { useState } from "react";
import { useCollection } from "@/lib/CollectionContext";
import type { CompletionGroup } from "@/components/PrefectureCompletion";

export function ResetPrefectureButton({
  prefId,
  prefName,
  groups,
}: {
  prefId: string;
  prefName: string;
  groups: CompletionGroup[];
}) {
  const { removeItems } = useCollection();
  const [done, setDone] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          const ok = window.confirm(
            `${prefName}の記録をすべてリセットします。この操作は取り消せません。よろしいですか?`
          );
          if (!ok) return;
          removeItems([
            { category: "prefectures", id: prefId },
            ...groups.flatMap((g) => g.ids.map((id) => ({ category: g.category, id }))),
          ]);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
        className="rounded-full border border-border px-3.5 py-2 text-xs text-muted transition-colors hover:border-wishlist hover:text-wishlist"
      >
        この県の記録をリセット
      </button>
      {done && <span className="text-xs text-visited">リセットしました</span>}
    </div>
  );
}
