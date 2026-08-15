import { MunicipalitiesBrowser } from "@/components/MunicipalitiesBrowser";
import { ResetCategoryButton } from "@/components/ResetCategoryButton";
import { AdSlot } from "@/components/AdSlot";
import { municipalities } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "市区町村図鑑",
  description:
    "日本全国、約1,741の市区町村一覧。県には行ったけどこの市には行ったことがない、というレベルまで旅の記録を残そう。",
  path: "/collection/municipalities",
});

export default function MunicipalitiesCollectionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">市区町村図鑑</h1>
      <p className="mt-2 text-sm text-muted">
        全国 {municipalities.length.toLocaleString("ja-JP")} の市区町村。地方・都道府県で絞り込めます。
      </p>
      <div className="mt-6">
        <MunicipalitiesBrowser municipalities={municipalities} />
      </div>
      <section className="mt-8 border-t border-border pt-4">
        <ResetCategoryButton category="municipalities" categoryLabel="市区町村" />
      </section>
      <section className="mt-10">
        <AdSlot />
      </section>
    </div>
  );
}
