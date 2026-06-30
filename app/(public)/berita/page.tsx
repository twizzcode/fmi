import type { Metadata } from "next"

import { NewsListPage } from "@/components/news/news-list-page"
import { getNewsArticles } from "@/lib/news"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Berita",
  description: "Baca berita terbaru FMI FMIPA UNNES tentang kegiatan, pembinaan, dan gerak organisasi.",
  alternates: {
    canonical: "/berita",
  },
}

export default async function NewsPage() {
  const items = await getNewsArticles()
  return <NewsListPage items={items} />
}
