import { asc } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { departmentProfiles } from "@/lib/site-data"
import { createSignedStorageUrl } from "@/lib/supabase/storage"

export type StructureGender = "ikhwan" | "akhwat"

export type StructureMemberData = {
  id: string
  name: string
  nickname: string
  position: string
  program: string
  entryYear: string
  gender: StructureGender
  quote: string
  photoPath: string
  photoUrl: string
  instagram: string
  linkedin: string
  github: string
  website: string
  tiktok: string
  youtube: string
}

export type StructureSectionData = {
  department: string
  members: StructureMemberData[]
}

export type StructureCabinetData = {
  id: string
  orderLabel: string
  name: string
  theme: string
  philosophy: string
  logoPath: string
  logoUrl: string
  isDefault: boolean
  sections: StructureSectionData[]
}

const departmentNames = departmentProfiles.map((department) => department.name)

export function getStructureCabinetHref(cabinetId: string) {
  return `/struktur/${encodeURIComponent(cabinetId)}`
}

export async function getStructureCabinets() {
  const cabinets = await db
    .select()
    .from(schema.structureCabinets)
    .orderBy(asc(schema.structureCabinets.createdAt))

  if (cabinets.length === 0) {
    return []
  }

  const members = await db
    .select()
    .from(schema.structureMembers)
    .orderBy(asc(schema.structureMembers.createdAt))

  return Promise.all(
    cabinets.map(async (cabinet) => {
      const logoUrl = cabinet.logoPath
        ? await createSignedStorageUrl(cabinet.logoPath).catch(() => cabinet.logoPath)
        : ""

      const cabinetMembers = members.filter((member) => member.cabinetId === cabinet.id)
      const sections = await Promise.all(
        departmentNames.map(async (department) => {
          const departmentMembers = cabinetMembers.filter(
            (member) => member.department === department
          )

          return {
            department,
            members: await Promise.all(
              departmentMembers.map(async (member) => ({
                id: member.id,
                name: member.name,
                nickname: member.nickname,
                position: member.position,
                program: member.program,
                entryYear: member.entryYear,
                gender: member.gender as StructureGender,
                quote: member.quote,
                photoPath: member.photoPath,
                photoUrl: member.photoPath
                  ? await createSignedStorageUrl(member.photoPath).catch(
                      () => member.photoPath
                    )
                  : "",
                instagram: member.instagram,
                linkedin: member.linkedin,
                github: member.github,
                website: member.website,
                tiktok: member.tiktok,
                youtube: member.youtube,
              }))
            ),
          } satisfies StructureSectionData
        })
      )

      return {
        id: cabinet.id,
        orderLabel: cabinet.orderLabel,
        name: cabinet.name,
        theme: cabinet.theme,
        philosophy: cabinet.philosophy,
        logoPath: cabinet.logoPath,
        logoUrl,
        isDefault: cabinet.isDefault,
        sections,
      } satisfies StructureCabinetData
    })
  )
}

export async function getStructurePageData() {
  const cabinets = await getStructureCabinets()
  const defaultCabinetId =
    cabinets.find((cabinet) => cabinet.isDefault)?.id ?? cabinets[0]?.id ?? ""

  return {
    cabinets,
    defaultCabinetId,
  }
}

export async function getStructureCabinetPageData(cabinetId: string) {
  const { cabinets, defaultCabinetId } = await getStructurePageData()
  const currentCabinet =
    cabinets.find((cabinet) => cabinet.id === cabinetId) ?? null

  return {
    cabinets,
    defaultCabinetId,
    currentCabinet,
  }
}
