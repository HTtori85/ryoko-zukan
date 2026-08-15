import { CategoryFilterableList, type FilterableItem } from "@/components/CategoryFilterableList";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { sakeItems, getPrefecture, regionOfPrefecture } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "お酒図鑑",
  description:
    "各都道府県の代表的な日本酒・焼酎・ワインなどの一覧。飲んだことのあるお酒を記録しよう。",
  path: "/collection/sake",
});

export default function SakeCollectionPage() {
  const items: FilterableItem[] = sakeItems.map((s) => {
    const pref = getPrefecture(s.prefecture);
    return {
      id: s.id,
      name: s.name,
      kana: s.kana,
      regions: [regionOfPrefecture(s.prefecture) ?? ""],
      prefectureId: s.prefecture,
      prefectureName: pref?.name,
      meta: s.category,
      description: s.description,
      sweetness: s.sweetness,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">お酒図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        各都道府県の代表的な日本酒・焼酎・ワインなどを集めました。
      </p>
      <div className="mt-6">
        <CategoryFilterableList category="sake" items={items} mode="card" />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="sake" categoryLabel="お酒" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
