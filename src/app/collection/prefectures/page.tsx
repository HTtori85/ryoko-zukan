import { CategoryFilterableList, type FilterableItem } from "@/components/CategoryFilterableList";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { prefectures } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "都道府県図鑑",
  description:
    "47都道府県の一覧。行った都道府県・行きたい都道府県を記録して、日本地図を埋めていこう。",
  path: "/collection/prefectures",
});

export default function PrefecturesCollectionPage() {
  const items: FilterableItem[] = prefectures.map((p) => ({
    id: p.id,
    name: p.name,
    kana: p.kana,
    regions: [p.region],
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">都道府県図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        47都道府県。タップして「行った」「行きたい」を記録しよう。
      </p>
      <div className="mt-6">
        <CategoryFilterableList category="prefectures" items={items} mode="pill" />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="prefectures" categoryLabel="都道府県" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
