import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { CollectionProvider } from "@/lib/CollectionContext";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://nihon-ryoko-zukan.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "日本旅行図鑑 | 日本を旅して、図鑑を埋めよう。",
    template: "%s | 日本旅行図鑑",
  },
  description:
    "都道府県・観光地・世界遺産・郷土料理・温泉地・市区町村をコレクションする旅行図鑑サイト。行った場所、行きたい場所を記録して、自分だけの日本地図を完成させよう。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "日本旅行図鑑",
    title: "日本旅行図鑑 | 日本を旅して、図鑑を埋めよう。",
    description:
      "都道府県・観光地・世界遺産・郷土料理・温泉地・市区町村をコレクションする旅行図鑑サイト。",
  },
  twitter: {
    card: "summary_large_image",
    title: "日本旅行図鑑",
    description: "日本を旅して、図鑑を埋めよう。",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CollectionProvider>
          <SiteHeader />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <BottomNav />
        </CollectionProvider>
      </body>
    </html>
  );
}
