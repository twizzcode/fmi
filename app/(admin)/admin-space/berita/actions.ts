"use server"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import type { NewsStatus } from "@/lib/db/schema"
import {
  deleteStorageObject,
  uploadImageToStorage,
} from "@/lib/supabase/storage"

export type NewsActionState = {
  error: string | null
  success: string | null
}

type ParsedNewsFields =
  | NewsActionState
  | {
      title: string
      slug: string
      excerpt: string
      category: string
      bodyJson: string
      status: NewsStatus
      publishedAt: Date
      image: FormDataEntryValue | null
    }

export async function createNewsArticleAction(
  _previousState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(session.user.role)) {
    return { error: "Unauthorized", success: null }
  }

  const parsed = parseNewsFields(formData)
  if (isNewsActionState(parsed)) return parsed

  if (!(parsed.image instanceof File) || parsed.image.size === 0) {
    return {
      error: "Gambar berita wajib diunggah.",
      success: null,
    }
  }

  const [existing] = await db
    .select()
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.slug, parsed.slug))
    .limit(1)

  if (existing) {
    return {
      error: "Slug berita sudah dipakai.",
      success: null,
    }
  }

  try {
    const imagePath = await uploadImageToStorage({
      file: parsed.image,
      folder: "news",
    })

    await db.insert(schema.newsArticles).values({
      id: randomUUID(),
      userId: session.user.id,
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      category: parsed.category,
      author: session.user.name,
      imagePath,
      bodyJson: parsed.bodyJson,
        status: "draft",

      views: 0,
      publishedAt: parsed.publishedAt,
    })

    revalidateNewsPaths(parsed.slug)

    return {
      error: null,
      success: "Berita berhasil ditambahkan.",
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menambahkan berita.",
      success: null,
    }
  }
}

export async function updateNewsArticleAction(
  _previousState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const authResult = await requireAdminSession()
  if (authResult) return authResult

  const id = formData.get("id")
  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID berita tidak valid.", success: null }
  }

  const parsed = parseNewsFields(formData)
  if (isNewsActionState(parsed)) return parsed

  const replaceImage = formData.get("replaceImage") === "on"
  const image = formData.get("image")

  const [existing] = await db
    .select()
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Berita tidak ditemukan.", success: null }
  }

  const [slugConflict] =
    parsed.slug === existing.slug
      ? []
      : await db
          .select()
          .from(schema.newsArticles)
          .where(eq(schema.newsArticles.slug, parsed.slug))
          .limit(1)

  if (slugConflict) {
    return { error: "Slug berita sudah dipakai.", success: null }
  }

  if (replaceImage && (!(image instanceof File) || image.size === 0)) {
    return { error: "Unggah gambar baru untuk mengganti gambar lama.", success: null }
  }

  try {
    let imagePath = existing.imagePath

    if (replaceImage && image instanceof File && image.size > 0) {
      imagePath = await uploadImageToStorage({
        file: image,
        folder: "news",
      })
    }

    await db
      .update(schema.newsArticles)
      .set({
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        category: parsed.category,
        imagePath,
        bodyJson: parsed.bodyJson,
      status: "draft",

        publishedAt: parsed.publishedAt,
      })
      .where(eq(schema.newsArticles.id, existing.id))

    if (replaceImage && imagePath !== existing.imagePath) {
      await deleteStorageObject(existing.imagePath).catch(() => undefined)
    }

    revalidateNewsPaths(parsed.slug, existing.slug)

    return {
      error: null,
      success: "Berita berhasil diperbarui.",
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal memperbarui berita.",
      success: null,
    }
  }
}

export async function deleteNewsArticleAction(
  _previousState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const authResult = await requireAdminSession()
  if (authResult) return authResult

  const id = formData.get("id")
  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID berita tidak valid.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Berita tidak ditemukan.", success: null }
  }

  try {
    await deleteStorageObject(existing.imagePath)
    await db.delete(schema.newsArticles).where(eq(schema.newsArticles.id, existing.id))
    revalidateNewsPaths(existing.slug)

    return {
      error: null,
      success: "Berita berhasil dihapus.",
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus berita.",
      success: null,
    }
  }
}

function parseNewsFields(formData: FormData): ParsedNewsFields {
  const title = formData.get("title")
  const slug = formData.get("slug")
  const excerpt = formData.get("excerpt")
  const category = formData.get("category")
  const bodyJson = formData.get("bodyJson")
  const statusValue = formData.get("status")
  const publishedAtValue = formData.get("publishedAt")
  const image = formData.get("image")

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Judul berita wajib diisi.", success: null }
  }
  if (typeof slug !== "string" || !slug.trim()) {
    return { error: "Slug berita wajib diisi.", success: null }
  }
  if (typeof excerpt !== "string" || !excerpt.trim()) {
    return { error: "Ringkasan berita wajib diisi.", success: null }
  }
  if (typeof category !== "string" || !category.trim()) {
    return { error: "Kategori berita wajib diisi.", success: null }
  }
  if (typeof bodyJson !== "string" || !bodyJson.trim()) {
    return { error: "Isi inti berita wajib diisi.", success: null }
  }
  if (statusValue !== "draft" && statusValue !== "published") {
    return { error: "Status berita tidak valid.", success: null }
  }
  if (typeof publishedAtValue !== "string" || !publishedAtValue.trim()) {
    return { error: "Tanggal publikasi wajib diisi.", success: null }
  }

  const publishedAt = new Date(publishedAtValue)
  if (Number.isNaN(publishedAt.getTime())) {
    return { error: "Tanggal publikasi tidak valid.", success: null }
  }

  return {
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim(),
    category: category.trim(),
    bodyJson: bodyJson.trim(),
    status: statusValue,
    publishedAt,
    image,
  }
}

function isNewsActionState(value: ParsedNewsFields): value is NewsActionState {
  return "error" in value
}

async function requireAdminSession(): Promise<NewsActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(session.user.role)) {
    return { error: "Unauthorized", success: null }
  }

  return null
}

function revalidateNewsPaths(slug: string, previousSlug?: string) {
  revalidatePath("/admin-space/berita")
  revalidatePath("/berita")
  revalidatePath("/")
  revalidatePath(`/berita/${slug}`)
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/berita/${previousSlug}`)
  }
}
