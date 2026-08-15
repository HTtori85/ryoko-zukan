"use client";

import { useState } from "react";
import { useCollection } from "@/lib/CollectionContext";

export function ResetAllButton() {
  const { resetAll } = useCollection();
  const [done, setDone] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          const ok = window.confirm(
            "すべての図鑑の記録をリセットします。この操作は取り消せません。よろしいですか?"
          );
          if (!ok) return;
          resetAll();
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
        className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-wishlist hover:text-wishlist"
      >
        図鑑をすべてリセット
      </button>
      {done && <span className="text-sm text-visited">リセットしました</span>}
    </div>
  );
}
