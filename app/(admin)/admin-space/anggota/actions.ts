"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { canAccessAdmin } from "@/lib/app-config"
import { auth, getSessionUserRole } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { roleValues, type UserRole } from "@/lib/db/schema"

export type MemberRoleActionResult = {
  error: string | null
  success: string | null
}

export async function updateMemberRoleAction(
  userId: string,
  role: UserRole
): Promise<MemberRoleActionResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(getSessionUserRole(session))) {
    return { error: "Unauthorized", success: null }
  }

  if (typeof userId !== "string" || !userId.trim()) {
    return { error: "ID anggota tidak valid.", success: null }
  }

  if (!roleValues.includes(role)) {
    return { error: "Role tidak valid.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Anggota tidak ditemukan.", success: null }
  }

  if (existing.role === "developer" && role !== "developer") {
    return {
      error: "Role developer tidak bisa diubah dari halaman ini.",
      success: null,
    }
  }

  if (existing.role === role) {
    return {
      error: null,
      success: `${existing.email} sudah memiliki role ${role}.`,
    }
  }

  await db
    .update(schema.users)
    .set({
      role,
    })
    .where(eq(schema.users.id, existing.id))

  revalidatePath("/admin-space/anggota")

  return {
    error: null,
    success: `${existing.email} berhasil diubah menjadi ${role}.`,
  }
}
