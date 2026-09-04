import { MetadataRoute } from "next";
import { STATION_NOTES } from "@/lib/transit/network";
import { getAllSlugs } from "@/lib/mdx";

// Required for `output: 'export'` — prerender the sitemap at build time.
export const dynamic = "force-static";

const BASE_URL = "https://jcxal.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/travel/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact/`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/photography/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/music/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/design/`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const guideFiles = new Set(getAllSlugs("travel"));
  const guideRoutes: MetadataRoute.Sitemap = Object.values(STATION_NOTES)
    .map((note) => note.guideSlug)
    .filter((slug): slug is string => Boolean(slug) && guideFiles.has(slug!))
    .map((slug) => ({
      url: `${BASE_URL}/travel/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const postRoutes: MetadataRoute.Sitemap = getAllSlugs("blog").map((slug) => ({
    url: `${BASE_URL}/blog/${slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...guideRoutes, ...postRoutes];
}
