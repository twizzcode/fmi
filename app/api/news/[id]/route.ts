import { NextResponse } from "next/server"
import { eq, sql } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { createSignedStorageUrl } from "@/lib/supabase/storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [item] = await db
      .select()
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.id, id))
      .limit(1)

    if (!item) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      )
    }

    let imageUrl = item.imagePath
    try {
      imageUrl = await createSignedStorageUrl(item.imagePath)
    } catch {
      imageUrl = item.imagePath
    }

    const newsArticle = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      author: item.author,
      imagePath: item.imagePath,
      imageUrl,
      bodyJson: item.bodyJson,
      status: item.status,
      views: item.views,
      publishedAt: item.publishedAt,
      date: formatDate(item.publishedAt),
      dateISO: item.publishedAt.toISOString().slice(0, 10),
    }

    return NextResponse.json(newsArticle)
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data berita" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json().catch(() => null)) as { action?: string } | null

    if (body?.action !== "increment-view") {
      return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 })
    }

    const [item] = await db
      .select({ id: schema.newsArticles.id })
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.id, id))
      .limit(1)

    if (!item) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 })
    }

    await db
      .update(schema.newsArticles)
      .set({
        views: sql`${schema.newsArticles.views} + 1`,
      })
      .where(eq(schema.newsArticles.id, id))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Gagal menambah views berita" }, { status: 500 })
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}
