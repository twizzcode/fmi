import type { MetadataRoute } from "next"

import { createAppUrl } from "@/lib/app-config"
import { getNewsArticles } from "@/lib/news"
import { getStructureCabinets } from "@/lib/structure"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsArticles, cabinets] = await Promise.all([
    getNewsArticles(),
    getStructureCabinets(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: createAppUrl("/").toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: createAppUrl("/berita").toString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: createAppUrl("/galeri-fmiunnes").toString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: createAppUrl("/tentang-fmiunnes").toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: createAppUrl("/tentang-ldj").toString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: createAppUrl("/kontak").toString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: createAppUrl(`/berita/${article.slug}`).toString(),
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const structurePages: MetadataRoute.Sitemap = cabinets.map((cabinet) => ({
    url: createAppUrl(`/struktur/${cabinet.id}`).toString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticPages, ...newsPages, ...structurePages]
}
