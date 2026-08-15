import { CollectionSummary } from "@/components/CollectionSummary";
import { WishlistOverview } from "@/components/WishlistOverview";
import { ResetAllButton } from "@/components/ResetAllButton";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "図鑑トップ",
  description:
    "都道府県・観光地・世界遺産・郷土料理・温泉地・市区町村、それぞれの図鑑の達成状況をまとめて確認できます。",
  path: "/collection",
});

export default function CollectionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">図鑑トップ</h1>
      <p className="mt-2 text-sm text-muted">
        各カテゴリの達成状況を確認したり、まだ見ぬ日本を探しに行きましょう。
      </p>

      <section className="mt-6">
        <CollectionSummary />
      </section>

      <section className="mt-10">
        <h2 className="font-heading mb-3 text-xl font-bold text-foreground">
          次に行きたい
        </h2>
        <WishlistOverview />
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="font-heading mb-3 text-sm font-semibold text-muted">データの管理</h2>
        <ResetAllButton />
      </section>

      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
