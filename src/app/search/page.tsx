import { SearchBox } from "@/components/SearchBox";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "検索",
  description:
    "都道府県・市区町村・観光地・世界遺産・郷土料理・温泉地をまとめて検索できます。",
  path: "/search",
});

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">検索</h1>
      <p className="mt-2 text-sm text-muted">
        気になる場所の名前を入力してください。
      </p>
      <div className="mt-6">
        <SearchBox />
      </div>
    </div>
  );
}
