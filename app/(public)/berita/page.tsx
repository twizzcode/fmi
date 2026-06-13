import { NewsListPage } from "@/components/news/news-list-page"
import { getNewsArticles } from "@/lib/news"

export default async function NewsPage() {
  const items = await getNewsArticles()
  return <NewsListPage items={items} />
}
