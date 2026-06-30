"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { auth, getSessionUserRole } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import { deleteStorageObject } from "@/lib/supabase/storage"

export type TestimonialApprovalActionState = {
  error: string | null
  success: string | null
}

export async function approveTestimonialAction(
  _previousState: TestimonialApprovalActionState,
  formData: FormData
): Promise<TestimonialApprovalActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID testimoni tidak valid.", success: null }
  }

  try {
    await db
      .update(schema.testimonials)
      .set({ status: "approved" })
      .where(eq(schema.testimonials.id, id.trim()))

    revalidatePath("/admin-space/admin/testimoni")
    revalidatePath("/admin-space/testimoni")
    revalidatePath("/testimoni")
    revalidatePath("/")

    return {
      error: null,
      success: "Testimoni berhasil disetujui.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menyetujui testimoni.",
      success: null,
    }
  }
}

export async function rejectTestimonialAction(
  _previousState: TestimonialApprovalActionState,
  formData: FormData
): Promise<TestimonialApprovalActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID testimoni tidak valid.", success: null }
  }

  try {
    await db
      .update(schema.testimonials)
      .set({ status: "rejected" })
      .where(eq(schema.testimonials.id, id.trim()))

    revalidatePath("/admin-space/admin/testimoni")
    revalidatePath("/admin-space/testimoni")
    revalidatePath("/testimoni")
    revalidatePath("/")

    return {
      error: null,
      success: "Testimoni berhasil ditolak.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menolak testimoni.",
      success: null,
    }
  }
}

export async function deleteTestimonialAdminAction(
  _previousState: TestimonialApprovalActionState,
  formData: FormData
): Promise<TestimonialApprovalActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID testimoni tidak valid.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Testimoni tidak ditemukan.", success: null }
  }

  try {
    if (existing.imagePath) {
      await deleteStorageObject(existing.imagePath)
    }

    await db
      .delete(schema.testimonials)
      .where(eq(schema.testimonials.id, existing.id))

    revalidatePath("/admin-space/admin/testimoni")
    revalidatePath("/admin-space/testimoni")
    revalidatePath("/testimoni")
    revalidatePath("/")

    return {
      error: null,
      success: "Testimoni berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menghapus testimoni.",
      success: null,
    }
  }
}

async function requireAdminSession(): Promise<TestimonialApprovalActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(getSessionUserRole(session))) {
    return {
      error: "Unauthorized",
      success: null,
    }
  }

  return null
}
