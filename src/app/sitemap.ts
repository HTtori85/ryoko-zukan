import type { MetadataRoute } from "next";
import { prefectures, CATEGORY_SLUGS } from "@/lib/data";

export const dynamic = "force-static";

const SITE_URL = "https://nihon-ryoko-zukan.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/collection`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/search`, changeFrequency: "monthly", priority: 0.5 },
    ...Object.values(CATEGORY_SLUGS).map((slug) => ({
      url: `${SITE_URL}/collection/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const prefectureRoutes: MetadataRoute.Sitemap = prefectures.map((p) => ({
    url: `${SITE_URL}/prefectures/${p.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...prefectureRoutes];
}
