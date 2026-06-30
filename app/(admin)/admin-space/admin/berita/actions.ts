"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import { deleteStorageObject } from "@/lib/supabase/storage"

export type NewsAdminActionState = {
  error: string | null
  success: string | null
}

export async function publishNewsAction(
  _previousState: NewsAdminActionState,
  formData: FormData
): Promise<NewsAdminActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID berita tidak valid.", success: null }
  }

  try {
    await db
      .update(schema.newsArticles)
      .set({ status: "published" })
      .where(eq(schema.newsArticles.id, id.trim()))

    revalidatePath("/admin-space/admin/berita")
    revalidatePath("/admin-space/berita")
    revalidatePath("/berita")
    revalidatePath("/")

    return {
      error: null,
      success: "Berita berhasil dipublikasi.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal mempublikasi berita.",
      success: null,
    }
  }
}

export async function unpublishNewsAction(
  _previousState: NewsAdminActionState,
  formData: FormData
): Promise<NewsAdminActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID berita tidak valid.", success: null }
  }

  try {
    await db
      .update(schema.newsArticles)
      .set({ status: "draft" })
      .where(eq(schema.newsArticles.id, id.trim()))

    revalidatePath("/admin-space/admin/berita")
    revalidatePath("/admin-space/berita")
    revalidatePath("/berita")
    revalidatePath("/")

    return {
      error: null,
      success: "Berita berhasil di-unpublish.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal unpublish berita.",
      success: null,
    }
  }
}

export async function deleteNewsAdminAction(
  _previousState: NewsAdminActionState,
  formData: FormData
): Promise<NewsAdminActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

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

    await db
      .delete(schema.newsArticles)
      .where(eq(schema.newsArticles.id, existing.id))

    revalidatePath("/admin-space/admin/berita")
    revalidatePath("/admin-space/berita")
    revalidatePath("/berita")
    revalidatePath("/")

    return {
      error: null,
      success: "Berita berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menghapus berita.",
      success: null,
    }
  }
}

async function requireAdminSession(): Promise<NewsAdminActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(session.user.role)) {
    return {
      error: "Unauthorized",
      success: null,
    }
  }

  return null
}
