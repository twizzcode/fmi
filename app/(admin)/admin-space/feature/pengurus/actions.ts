"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth, getSessionUserRole } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import { departmentProfiles } from "@/lib/site-data"
import {
  createSignedStorageUrl,
  deleteStorageObject,
  uploadImageToStorage,
} from "@/lib/supabase/storage"

export type StructureActionState = {
  error: string | null
  success: string | null
  payload: string | null
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
  const authResult = await requireStructureEditorSession("admin")
  if (authResult) return authResult

  return persistStructure(formData)
}

export async function saveStaffStructureCardsAction(
  _previousState: StructureActionState,
  formData: FormData
): Promise<StructureActionState> {
  const authResult = await requireStructureEditorSession("staff")
  if (authResult) return authResult

  return persistStructure(formData, { mode: "staff" })
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

async function uploadBatch<T, R>(
  items: T[],
  batchSize: number,
  uploadFn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    results.push(...(await Promise.all(batch.map(uploadFn))))
  }
  return results
}

async function uploadStructureAssets({
  cabinets,
  formData,
  uploadedPaths,
}: {
  cabinets: StructurePayload[]
  formData: FormData
  uploadedPaths: string[]
}) {
  return uploadBatch(cabinets, 5, async (cabinet) => {
    let logoPath = cabinet.logoPath
    const logoFile = formData.get(`cabinet-logo:${cabinet.id}`)

    if (logoFile instanceof File && logoFile.size > 0) {
      logoPath = await uploadImageToStorage({
        file: logoFile,
        folder: "pengurus/kabinet",
      })
      uploadedPaths.push(logoPath)
    }

    const sections = await Promise.all(
      cabinet.sections.map(async (section) => ({
        ...section,
        members: await uploadBatch(section.members, 5, async (member) => {
          let photoPath = member.photoPath
          const photoFile = formData.get(`member-photo:${member.id}`)

          if (photoFile instanceof File && photoFile.size > 0) {
            photoPath = await uploadImageToStorage({
              file: photoFile,
              folder: "pengurus/anggota",
            })
            uploadedPaths.push(photoPath)
          }

          return {
            ...member,
            photoPath,
          }
        }),
      }))
    )

    return {
      ...cabinet,
      logoPath,
      sections,
    }
  })
}

async function createStructureResponsePayload(cabinets: StructurePayload[]) {
  return Promise.all(
    cabinets.map(async (cabinet) => ({
      ...cabinet,
      logoPreviewUrl: cabinet.logoPath
        ? await createSignedStorageUrl(cabinet.logoPath).catch(() => cabinet.logoPath)
        : "",
      sections: await Promise.all(
        cabinet.sections.map(async (section) => ({
          ...section,
          members: await Promise.all(
            section.members.map(async (member) => ({
              ...member,
              photoPreviewUrl: member.photoPath
                ? await createSignedStorageUrl(member.photoPath).catch(() => member.photoPath)
                : "",
            }))
          ),
        }))
      ),
    }))
  )
}

async function persistStructure(
  formData: FormData,
  options: { mode?: "admin" | "staff" } = {}
): Promise<StructureActionState> {
  const payloadValue = formData.get("payload")
  if (typeof payloadValue !== "string" || !payloadValue.trim()) {
    return { error: "Payload struktur tidak valid.", success: null, payload: null }
  }

  let parsedPayload: unknown

  try {
    parsedPayload = JSON.parse(payloadValue)
  } catch {
    return { error: "Format payload struktur tidak valid.", success: null, payload: null }
  }

  if (!Array.isArray(parsedPayload)) {
    return { error: "Data kabinet harus berbentuk array.", success: null, payload: null }
  }

  const cabinets = normalizeStructurePayload(parsedPayload)
  const uploadedPaths: string[] = []

  try {
    const existingCabinets = await db.select().from(schema.structureCabinets)
    const existingMembers = await db.select().from(schema.structureMembers)
    const baseCabinets =
      options.mode === "staff"
        ? restrictStaffCabinets({ cabinets, existingCabinets, existingMembers })
        : cabinets

    const nextCabinets = await uploadStructureAssets({
      cabinets: baseCabinets,
      formData,
      uploadedPaths,
    })

    await db.transaction(async (tx) => {
      await tx.delete(schema.structureMembers)
      await tx.delete(schema.structureCabinets)

      if (nextCabinets.length === 0) {
        return
      }

      await tx.insert(schema.structureCabinets).values(
        nextCabinets.map((cabinet) => ({
          id: cabinet.id,
          orderLabel: cabinet.orderLabel,
          name: cabinet.name,
          theme: cabinet.theme,
          philosophy: cabinet.philosophy,
          logoPath: cabinet.logoPath,
          isDefault: cabinet.isDefault,
        }))
      )

      const members = nextCabinets.flatMap((cabinet) =>
        cabinet.sections.flatMap((section) =>
          section.members.map((member, sortOrder) => ({
            id: member.id,
            cabinetId: cabinet.id,
            department: section.department,
            name: member.name,
            nickname: member.nickname,
            position: member.position,
            sortOrder,
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
      nextCabinets,
    })

    await Promise.all(
      removedPaths.map((path) => deleteStorageObject(path).catch(() => undefined))
    )

    const responsePayload = await createStructureResponsePayload(nextCabinets)

    revalidatePath("/admin-space/pengurus")
    revalidatePath("/admin-space/workspace/pengurus")
    revalidatePath("/struktur")

    return {
      error: null,
      success: "Struktur pengurus berhasil disimpan ke database.",
      payload: JSON.stringify(responsePayload),
    }
  } catch (error) {
    await Promise.all(
      uploadedPaths.map((path) => deleteStorageObject(path).catch(() => undefined))
    )

    return {
      error:
        error instanceof Error ? error.message : "Gagal menyimpan struktur pengurus.",
      success: null,
      payload: null,
    }
  }
}

async function requireStructureEditorSession(
  mode: "admin" | "staff"
): Promise<StructureActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })
  const role = getSessionUserRole(session)

  if (!session) {
    return { error: "Unauthorized", success: null, payload: null }
  }

  if (mode === "admin") {
    if (!canAccessAdmin(role)) {
      return { error: "Unauthorized", success: null, payload: null }
    }

    return null
  }

  if (role !== "staff" && role !== "admin" && role !== "developer") {
    return { error: "Unauthorized", success: null, payload: null }
  }

  return null
}

function restrictStaffCabinets({
  cabinets,
  existingCabinets,
  existingMembers,
}: {
  cabinets: StructurePayload[]
  existingCabinets: typeof schema.structureCabinets.$inferSelect[]
  existingMembers: typeof schema.structureMembers.$inferSelect[]
}) {
  const defaultCabinet = existingCabinets.find((cabinet) => cabinet.isDefault)

  if (!defaultCabinet) {
    throw new Error("Kabinet default tidak ditemukan.")
  }

  const submittedDefaultCabinet = cabinets.find((cabinet) => cabinet.id === defaultCabinet.id)

  if (!submittedDefaultCabinet) {
    throw new Error("Data kabinet default tidak valid.")
  }

  const submittedMembers = new Map(
    submittedDefaultCabinet.sections.flatMap((section) =>
      section.members.map((member) => [member.id, { ...member, department: section.department }])
    )
  )

  return existingCabinets.map((cabinet) => ({
    id: cabinet.id,
    orderLabel: cabinet.orderLabel,
    name: cabinet.name,
    theme: cabinet.theme,
    philosophy: cabinet.philosophy,
    logoPath: cabinet.logoPath,
    isDefault: cabinet.isDefault,
    sections: departmentNames.map((department) => ({
      department,
      members: existingMembers
        .filter((member) => member.cabinetId === cabinet.id && member.department === department)
        .map((member) => {
          if (!cabinet.isDefault) {
            return mapExistingMember(member)
          }

          const submitted = submittedMembers.get(member.id)

          if (!submitted || submitted.department !== department) {
            throw new Error("Perubahan data fungsionaris tidak valid.")
          }

          return {
            ...mapExistingMember(member),
            name: submitted.name,
            nickname: submitted.nickname,
            position: submitted.position,
            program: submitted.program,
            entryYear: submitted.entryYear,
            gender: submitted.gender,
            quote: submitted.quote,
            photoPath: submitted.photoPath,
            instagram: submitted.instagram ?? "",
            linkedin: submitted.linkedin ?? "",
            github: submitted.github ?? "",
            website: submitted.website ?? "",
            tiktok: submitted.tiktok ?? "",
            youtube: submitted.youtube ?? "",
          }
        }),
    })),
  }))
}

function mapExistingMember(member: typeof schema.structureMembers.$inferSelect) {
  return {
    id: member.id,
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
  }
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
