import { and, desc, eq, ne, sql } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { createSignedStorageUrl } from "@/lib/supabase/storage"
import type { NewsStatus } from "@/lib/db/schema"
import { resolveUserImage } from "@/lib/user-image"

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string | null
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
  const items = await db
    .select({
      article: schema.newsArticles,
      authorName: schema.users.name,
      authorRole: schema.users.role,
      authorImage: schema.users.image,
      authorUploadedImagePath: schema.users.uploadedImagePath,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(eq(schema.newsArticles.status, "published"))
    .orderBy(desc(schema.newsArticles.publishedAt))

  return Promise.all(items.map(mapDbNewsArticle))
}

export async function getLatestNewsArticles(limit = 3) {
  const items = await db
    .select({
      article: schema.newsArticles,
      authorName: schema.users.name,
      authorRole: schema.users.role,
      authorImage: schema.users.image,
      authorUploadedImagePath: schema.users.uploadedImagePath,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(eq(schema.newsArticles.status, "published"))
    .orderBy(desc(schema.newsArticles.publishedAt))
    .limit(limit)

  return Promise.all(items.map(mapDbNewsArticle))
}

export async function getNewsArticleBySlug(slug: string) {
  const [item] = await db
    .select({
      article: schema.newsArticles,
      authorName: schema.users.name,
      authorRole: schema.users.role,
      authorImage: schema.users.image,
      authorUploadedImagePath: schema.users.uploadedImagePath,
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
    return null
  }

  return mapDbNewsArticle(item)
}

export async function getRelatedNewsArticles(slug: string, limit = 3) {
  const items = await db
    .select({
      article: schema.newsArticles,
      authorName: schema.users.name,
      authorRole: schema.users.role,
      authorImage: schema.users.image,
      authorUploadedImagePath: schema.users.uploadedImagePath,
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
      authorName: schema.users.name,
      authorRole: schema.users.role,
      authorImage: schema.users.image,
      authorUploadedImagePath: schema.users.uploadedImagePath,
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

export async function getPaginatedAdminNewsArticles({
  page,
  pageSize,
  userId,
  status,
}: {
  page: number
  pageSize: number
  userId?: string
  status?: NewsStatus | "all"
}): Promise<{ totalCount: number; items: NewsArticle[] }> {
  const currentPage = Math.max(1, page)
  const offset = (currentPage - 1) * pageSize
  const whereClause =
    userId && status && status !== "all"
      ? and(eq(schema.newsArticles.userId, userId), eq(schema.newsArticles.status, status))
      : userId
        ? eq(schema.newsArticles.userId, userId)
        : status && status !== "all"
          ? eq(schema.newsArticles.status, status)
          : undefined

  const [countResult, items] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.newsArticles)
      .where(whereClause),
    db
      .select({
        id: schema.newsArticles.id,
        slug: schema.newsArticles.slug,
        title: schema.newsArticles.title,
        excerpt: schema.newsArticles.excerpt,
        category: schema.newsArticles.category,
        author: schema.newsArticles.author,
        imagePath: schema.newsArticles.imagePath,
        status: schema.newsArticles.status,
        views: schema.newsArticles.views,
        publishedAt: schema.newsArticles.publishedAt,
        userId: schema.newsArticles.userId,
        authorName: schema.users.name,
        authorRole: schema.users.role,
        authorImage: schema.users.image,
        authorUploadedImagePath: schema.users.uploadedImagePath,
      })
      .from(schema.newsArticles)
      .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
      .where(whereClause)
      .orderBy(desc(schema.newsArticles.publishedAt))
      .limit(pageSize)
      .offset(offset),
  ])

  return {
    totalCount: countResult[0]?.count ?? 0,
    items: await Promise.all(items.map(mapDbNewsArticleMinimal)),
  }
}

export async function getAdminNewsArticleById(id: string, userId?: string) {
  const [item] = await db
    .select({
      article: schema.newsArticles,
      authorName: schema.users.name,
      authorRole: schema.users.role,
      authorImage: schema.users.image,
      authorUploadedImagePath: schema.users.uploadedImagePath,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.users, eq(schema.newsArticles.userId, schema.users.id))
    .where(
      userId
        ? and(eq(schema.newsArticles.id, id), eq(schema.newsArticles.userId, userId))
        : eq(schema.newsArticles.id, id)
    )
    .limit(1)

  if (!item) {
    return null
  }

  return mapDbNewsArticle(item)
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
  authorName,
  authorRole,
  authorImage,
  authorUploadedImagePath,
}: {
  article: typeof schema.newsArticles.$inferSelect
  authorName: string | null
  authorRole: typeof schema.users.$inferSelect.role | null
  authorImage: string | null
  authorUploadedImagePath: string | null
}): Promise<NewsArticle> {
  let imageUrl = article.imagePath

  try {
    imageUrl = await createSignedStorageUrl(article.imagePath)
  } catch {
    imageUrl = article.imagePath
  }

  const authorImageUrl = await resolveUserImage({
    image: authorImage,
    uploadedImagePath: authorUploadedImagePath,
  })

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    author: authorName?.trim() || article.author,
    authorRole: getAuthorRoleLabel(authorRole),
    authorImageUrl,
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

async function mapDbNewsArticleMinimal({
  id,
  slug,
  title,
  excerpt,
  category,
  author,
  imagePath,
  status,
  views,
  publishedAt,
  authorName,
  authorRole,
  authorImage,
  authorUploadedImagePath,
}: {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  imagePath: string
  status: (typeof schema.newsArticles.$inferSelect)["status"]
  views: number
  publishedAt: Date
  userId: string | null
  authorName: string | null
  authorRole: (typeof schema.users.$inferSelect)["role"] | null
  authorImage: string | null
  authorUploadedImagePath: string | null
}): Promise<NewsArticle> {
  let imageUrl = imagePath

  try {
    imageUrl = await createSignedStorageUrl(imagePath)
  } catch {
    imageUrl = imagePath
  }

  const authorImageUrl = await resolveUserImage({
    image: authorImage,
    uploadedImagePath: authorUploadedImagePath,
  })

  return {
    id,
    slug,
    title,
    excerpt,
    category,
    author: authorName?.trim() || author,
    authorRole: getAuthorRoleLabel(authorRole),
    authorImageUrl,
    imagePath,
    imageUrl,
    bodyJson: "",
    status,
    views,
    publishedAt,
    date: formatDate(publishedAt),
    dateISO: publishedAt.toISOString().slice(0, 10),
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function getAuthorRoleLabel(role: typeof schema.users.$inferSelect.role | null) {
  switch (role) {
    case "staff":
      return "Staff"
    case "admin":
      return "Admin"
    case "developer":
      return "Developer"
    case "alumni":
      return "Alumni"
    case "user":
      return "User"
    default:
      return null
  }
}
