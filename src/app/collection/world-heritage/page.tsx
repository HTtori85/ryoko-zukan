import { CategoryFilterableList, type FilterableItem } from "@/components/CategoryFilterableList";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { worldHeritageSites, getPrefecture, regionsOfPrefectureIds } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "世界遺産図鑑",
  description:
    "日本国内に登録されている世界遺産の一覧。文化遺産・自然遺産をあわせて記録し、制覇を目指そう。",
  path: "/collection/world-heritage",
});

export default function WorldHeritageCollectionPage() {
  const items: FilterableItem[] = worldHeritageSites.map((w) => ({
    id: w.id,
    name: w.name,
    kana: w.kana,
    regions: regionsOfPrefectureIds(w.prefectures),
    prefectureId: w.prefectures[0],
    prefectureName: getPrefecture(w.prefectures[0])?.name,
    meta: `${w.type} / ${w.year}年登録`,
    description: w.description,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">世界遺産図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        日本国内の世界遺産、全26件。文化庁の公開情報を基準に整理しています。
      </p>
      <div className="mt-6">
        <CategoryFilterableList category="worldHeritage" items={items} mode="card" />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="worldHeritage" categoryLabel="世界遺産" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
