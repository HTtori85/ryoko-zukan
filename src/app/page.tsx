import { JapanMap } from "@/components/JapanMap";
import { CollectionSummary } from "@/components/CollectionSummary";
import { PrefectureQuickList } from "@/components/PrefectureQuickList";
import { ResetAllButton } from "@/components/ResetAllButton";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "日本旅行図鑑 | 日本を旅して、図鑑を埋めよう。",
  description:
    "都道府県・観光地・世界遺産・郷土料理・温泉地・市区町村をコレクションする旅行図鑑サイト。行った場所、行きたい場所を記録して、自分だけの日本地図を完成させよう。",
  path: "/",
});

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          日本旅行図鑑
        </h1>
        <p className="mt-3 text-base text-muted sm:text-lg">
          日本を旅して、図鑑を埋めよう。
        </p>
      </section>

      <section className="mb-10">
        <CollectionSummary />
      </section>

      <section className="mb-8">
        <h2 className="font-heading mb-4 text-xl font-bold text-foreground">
          日本地図
        </h2>
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <JapanMap />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-heading mb-4 text-xl font-bold text-foreground">
          都道府県一覧
        </h2>
        <PrefectureQuickList />
      </section>

      <section className="mb-10 border-t border-border pt-6">
        <h2 className="font-heading mb-3 text-sm font-semibold text-muted">データの管理</h2>
        <ResetAllButton />
      </section>

      <section className="mb-4">
        <AdSlot />
      </section>
    </div>
  );
}
