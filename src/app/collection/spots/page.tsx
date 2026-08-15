import { CategoryFilterableList, type FilterableItem } from "@/components/CategoryFilterableList";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { touristSpots, getPrefecture, regionOfPrefecture } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "観光地図鑑",
  description:
    "全国の観光名所・自然・歴史文化スポットの一覧。行った観光地を記録して、日本を旅した記録を残そう。",
  path: "/collection/spots",
});

export default function SpotsCollectionPage() {
  const items: FilterableItem[] = touristSpots.map((s) => {
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
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">観光地図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        全国の観光名所・自然・歴史文化スポットなど、代表的な観光地を集めました。
      </p>
      <div className="mt-6">
        <CategoryFilterableList category="spots" items={items} mode="card" />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="spots" categoryLabel="観光地" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
