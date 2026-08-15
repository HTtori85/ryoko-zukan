import { CategoryFilterableList, type FilterableItem } from "@/components/CategoryFilterableList";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { localFoods, getPrefecture, regionOfPrefecture } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "郷土料理図鑑",
  description:
    "各都道府県の代表的な郷土料理・ご当地グルメの一覧。食べたことのある料理を記録しよう。",
  path: "/collection/food",
});

export default function FoodCollectionPage() {
  const items: FilterableItem[] = localFoods.map((f) => {
    const pref = getPrefecture(f.prefecture);
    return {
      id: f.id,
      name: f.name,
      kana: f.kana,
      regions: [regionOfPrefecture(f.prefecture) ?? ""],
      prefectureId: f.prefecture,
      prefectureName: pref?.name,
      meta: `${f.category} / ${f.area}`,
      description: f.description,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">郷土料理図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        各都道府県の代表的な郷土料理・ご当地グルメを集めました。
      </p>
      <div className="mt-6">
        <CategoryFilterableList category="foods" items={items} mode="card" />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="foods" categoryLabel="郷土料理" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
