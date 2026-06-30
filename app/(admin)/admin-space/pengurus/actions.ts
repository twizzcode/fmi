"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import { departmentProfiles } from "@/lib/site-data"
import { deleteStorageObject } from "@/lib/supabase/storage"

export type StructureActionState = {
  error: string | null
  success: string | null
}

type StructurePayload = {
  id: string
  orderLabel: string
  name: string
  theme: string
  philosophy: string
  logoPath: string
  isDefault: boolean
  sections: Array<{
    department: string
      members: Array<{
        id: string
        name: string
        nickname: string
        position: string
        program: string
        entryYear: string
        gender: "ikhwan" | "akhwat"
        quote: string
        photoPath: string
        instagram?: string
        linkedin?: string
        github?: string
        website?: string
        tiktok?: string
        youtube?: string
      }>

  }>
}

const departmentNames = departmentProfiles.map((department) => department.name)

export async function saveStructureAction(
  _previousState: StructureActionState,
  formData: FormData
): Promise<StructureActionState> {
  const authResult = await requireAdminSession()
  if (authResult) return authResult

  const payloadValue = formData.get("payload")
  if (typeof payloadValue !== "string" || !payloadValue.trim()) {
    return { error: "Payload struktur tidak valid.", success: null }
  }

  let parsedPayload: unknown

  try {
    parsedPayload = JSON.parse(payloadValue)
  } catch {
    return { error: "Format payload struktur tidak valid.", success: null }
  }

  if (!Array.isArray(parsedPayload)) {
    return { error: "Data kabinet harus berbentuk array.", success: null }
  }

  const cabinets = normalizeStructurePayload(parsedPayload)

  try {
    const [existingCabinets, existingMembers] = await Promise.all([
      db.select().from(schema.structureCabinets),
      db.select().from(schema.structureMembers),
    ])

    await db.transaction(async (tx) => {
      await tx.delete(schema.structureMembers)
      await tx.delete(schema.structureCabinets)

      if (cabinets.length === 0) {
        return
      }

      await tx.insert(schema.structureCabinets).values(
        cabinets.map((cabinet) => ({
          id: cabinet.id,
          orderLabel: cabinet.orderLabel,
          name: cabinet.name,
          theme: cabinet.theme,
          philosophy: cabinet.philosophy,
          logoPath: cabinet.logoPath,
          isDefault: cabinet.isDefault,
        }))
      )

      const members = cabinets.flatMap((cabinet) =>
        cabinet.sections.flatMap((section) =>
          section.members.map((member) => ({
            id: member.id,
            cabinetId: cabinet.id,
            department: section.department,
            name: member.name,
            nickname: member.nickname,
            position: member.position,
            program: member.program,
            entryYear: member.entryYear,
            gender: member.gender,
            quote: member.quote,
            photoPath: member.photoPath,
            instagram: member.instagram ?? "",
            linkedin: member.linkedin ?? "",
            github: member.github ?? "",
            website: member.website ?? "",
            tiktok: member.tiktok ?? "",
            youtube: member.youtube ?? "",
          }))
        )
      )

      if (members.length > 0) {
        await tx.insert(schema.structureMembers).values(members)
      }
    })

    const removedPaths = getRemovedStructureAssetPaths({
      existingCabinets,
      existingMembers,
      nextCabinets: cabinets,
    })

    await Promise.all(
      removedPaths.map((path) => deleteStorageObject(path).catch(() => undefined))
    )

    revalidatePath("/admin-space/pengurus")
    revalidatePath("/struktur")
    revalidatePath("/struktur-fmiunnes")

    return {
      error: null,
      success: "Struktur pengurus berhasil disimpan ke database.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal menyimpan struktur pengurus.",
      success: null,
    }
  }
}

function normalizeStructurePayload(payload: unknown[]): StructurePayload[] {
  const normalized = payload.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return []
    }

    const cabinet = item as Partial<StructurePayload>
    if (
      typeof cabinet.id !== "string" ||
      typeof cabinet.orderLabel !== "string" ||
      typeof cabinet.name !== "string"
    ) {
      return []
    }

    const sectionMap = new Map<string, StructurePayload["sections"][number]>()

    if (Array.isArray(cabinet.sections)) {
      for (const rawSection of cabinet.sections) {
        if (
          rawSection &&
          typeof rawSection === "object" &&
          typeof rawSection.department === "string" &&
          Array.isArray(rawSection.members)
        ) {
          sectionMap.set(rawSection.department, {
            department: rawSection.department,
            members: rawSection.members.flatMap((rawMember) => {
              if (!rawMember || typeof rawMember !== "object") {
                return []
              }

              const member = rawMember as Partial<
                StructurePayload["sections"][number]["members"][number]
              >

              if (
                typeof member.id !== "string" ||
                typeof member.name !== "string" ||
                typeof member.position !== "string"
              ) {
                return []
              }

              return [
                {
                  id: member.id,
                  name: member.name,
                  nickname:
                    typeof member.nickname === "string" ? member.nickname : "",
                  position: member.position,
                  program:
                    typeof member.program === "string" ? member.program : "",
                  entryYear:
                    typeof member.entryYear === "string" ? member.entryYear : "",
                  gender: member.gender === "akhwat" ? "akhwat" : "ikhwan",
                  quote: typeof member.quote === "string" ? member.quote : "",
                  photoPath:
                    typeof member.photoPath === "string" ? member.photoPath : "",
                  instagram:
                    typeof member.instagram === "string" ? member.instagram : "",
                  linkedin:
                    typeof member.linkedin === "string" ? member.linkedin : "",
                  github: typeof member.github === "string" ? member.github : "",
                  website:
                    typeof member.website === "string" ? member.website : "",
                  tiktok: typeof member.tiktok === "string" ? member.tiktok : "",
                  youtube:
                    typeof member.youtube === "string" ? member.youtube : "",
                },
              ]
            }),
          })
        }
      }
    }

    return [
      {
        id: cabinet.id,
        orderLabel: cabinet.orderLabel.trim() || "Kabinet",
        name: cabinet.name.trim(),
        theme: typeof cabinet.theme === "string" ? cabinet.theme : "",
        philosophy:
          typeof cabinet.philosophy === "string" ? cabinet.philosophy : "",
        logoPath: typeof cabinet.logoPath === "string" ? cabinet.logoPath : "",
        isDefault: cabinet.isDefault === true,
        sections: departmentNames.map((department) => ({
          department,
          members: sectionMap.get(department)?.members ?? [],
        })),
      },
    ]
  })

  if (normalized.length === 0) {
    return []
  }

  const hasDefault = normalized.some((cabinet) => cabinet.isDefault)

  return normalized.map((cabinet, index) => ({
    ...cabinet,
    isDefault: hasDefault ? cabinet.isDefault : index === 0,
  }))
}

async function requireAdminSession(): Promise<StructureActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(session.user.role)) {
    return { error: "Unauthorized", success: null }
  }

  return null
}

function getRemovedStructureAssetPaths({
  existingCabinets,
  existingMembers,
  nextCabinets,
}: {
  existingCabinets: Array<{ id: string; logoPath: string }>
  existingMembers: Array<{ id: string; photoPath: string }>
  nextCabinets: StructurePayload[]
}) {
  const existingPaths = new Set<string>()
  const nextPaths = new Set<string>()

  for (const cabinet of existingCabinets) {
    if (cabinet.logoPath) {
      existingPaths.add(cabinet.logoPath)
    }
  }

  for (const member of existingMembers) {
    if (member.photoPath) {
      existingPaths.add(member.photoPath)
    }
  }

  for (const cabinet of nextCabinets) {
    if (cabinet.logoPath) {
      nextPaths.add(cabinet.logoPath)
    }

    for (const section of cabinet.sections) {
      for (const member of section.members) {
        if (member.photoPath) {
          nextPaths.add(member.photoPath)
        }
      }
    }
  }

  return [...existingPaths].filter((path) => !nextPaths.has(path))
}
