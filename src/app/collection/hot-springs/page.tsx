import { CategoryFilterableList, type FilterableItem } from "@/components/CategoryFilterableList";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { hotSprings, getPrefecture, regionOfPrefecture } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "温泉地図鑑",
  description:
    "全国の代表的な温泉地の一覧。行った温泉地・行きたい温泉地を記録して、次の旅先を見つけよう。",
  path: "/collection/hot-springs",
});

export default function HotSpringsCollectionPage() {
  const items: FilterableItem[] = hotSprings.map((h) => {
    const pref = getPrefecture(h.prefecture);
    return {
      id: h.id,
      name: h.name,
      kana: h.kana,
      regions: [regionOfPrefecture(h.prefecture) ?? ""],
      prefectureId: h.prefecture,
      prefectureName: pref?.name,
      description: h.description,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">温泉地図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        旅先として代表的な、全国の温泉地を集めました。
      </p>
      <div className="mt-6">
        <CategoryFilterableList category="hotSprings" items={items} mode="card" />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="hotSprings" categoryLabel="温泉地" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
