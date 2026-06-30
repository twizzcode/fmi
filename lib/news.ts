import { and, desc, eq, ne } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { newsItems as fallbackNewsItems } from "@/lib/site-data"
import { createSignedStorageUrl } from "@/lib/supabase/storage"
import type { NewsStatus } from "@/lib/db/schema"

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorImageUrl: string | null
  imagePath: string
  imageUrl: string
  bodyJson: string
  status: NewsStatus
  views: number
  publishedAt: Date
  date: string
  dateISO: string
}

export async function getNewsArticles() {
  const hasStoredItems = await hasStoredNewsArticles()
  const items = await db
    .select({
      article: schema.newsArticles,
      authorImage: schema.users.image,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(eq(schema.newsArticles.status, "published"))
    .orderBy(desc(schema.newsArticles.publishedAt))

  if (items.length === 0 && !hasStoredItems) {
    return fallbackNewsItems.map(mapFallbackNewsItem)
  }

  return Promise.all(items.map(mapDbNewsArticle))
}

export async function getLatestNewsArticles(limit = 3) {
  const items = await getNewsArticles()
  return items.slice(0, limit)
}

export async function getNewsArticleBySlug(slug: string) {
  const hasStoredItems = await hasStoredNewsArticles()
  const [item] = await db
    .select({
      article: schema.newsArticles,
      authorImage: schema.users.image,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(
      and(
        eq(schema.newsArticles.slug, slug),
        eq(schema.newsArticles.status, "published")
      )
    )
    .limit(1)

  if (!item) {
    const fallback = hasStoredItems
      ? null
      : fallbackNewsItems.find((entry) => entry.slug === slug)
    return fallback ? mapFallbackNewsItem(fallback) : null
  }

  return mapDbNewsArticle(item)
}

export async function getRelatedNewsArticles(slug: string, limit = 3) {
  const hasStoredItems = await hasStoredNewsArticles()

  if (!hasStoredItems) {
    return fallbackNewsItems
      .filter((item) => item.slug !== slug)
      .slice(0, limit)
      .map(mapFallbackNewsItem)
  }

  const items = await db
    .select({
      article: schema.newsArticles,
      authorImage: schema.users.image,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(
      and(
        ne(schema.newsArticles.slug, slug),
        eq(schema.newsArticles.status, "published")
      )
    )
    .orderBy(desc(schema.newsArticles.publishedAt))
    .limit(limit)

  return Promise.all(items.map(mapDbNewsArticle))
}

export async function getNewsArticleSlugs() {
  const hasStoredItems = await hasStoredNewsArticles()

  if (!hasStoredItems) {
    return fallbackNewsItems.map((item) => item.slug)
  }

  const items = await db
    .select({ slug: schema.newsArticles.slug })
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.status, "published"))

  return items.map((item) => item.slug)
}

export async function getAdminNewsArticles(userId?: string) {
  const items = await db
    .select({
      article: schema.newsArticles,
      authorImage: schema.users.image,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(userId ? eq(schema.newsArticles.userId, userId) : undefined)
    .orderBy(desc(schema.newsArticles.publishedAt))

  if (items.length === 0) {
    return []
  }

  return Promise.all(items.map(mapDbNewsArticle))
}

async function hasStoredNewsArticles() {
  const [item] = await db.select({ id: schema.newsArticles.id }).from(schema.newsArticles).limit(1)
  return Boolean(item)
}

export function createBodyJsonFromParagraphs(paragraphs: string[]) {
  return JSON.stringify({
    root: {
      children: paragraphs.map((paragraph) => ({
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: paragraph,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
        textFormat: 0,
        textStyle: "",
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  })
}

async function mapDbNewsArticle({
  article,
  authorImage,
}: {
  article: typeof schema.newsArticles.$inferSelect
  authorImage: string | null
}): Promise<NewsArticle> {
  let imageUrl = article.imagePath

  try {
    imageUrl = await createSignedStorageUrl(article.imagePath)
  } catch {
    imageUrl = article.imagePath
  }

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    authorImageUrl: authorImage,
    imagePath: article.imagePath,
    imageUrl,
    bodyJson: article.bodyJson,
    status: article.status,
    views: article.views,
    publishedAt: article.publishedAt,
    date: formatDate(article.publishedAt),
    dateISO: article.publishedAt.toISOString().slice(0, 10),
  }
}

function mapFallbackNewsItem(
  item: (typeof fallbackNewsItems)[number]
): NewsArticle {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    author: item.author,
    authorImageUrl: null,
    imagePath: item.image,
    imageUrl: item.image,
    bodyJson: createBodyJsonFromParagraphs(item.content),
    status: "published",
    views: item.views,
    publishedAt: new Date(item.dateISO),
    date: item.date,
    dateISO: item.dateISO,
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}
