import { StructureAdminEditor } from "@/components/admin/structure-admin-editor"
import { getStructureCabinets } from "@/lib/structure"

export const dynamic = "force-dynamic"

export default async function AdminPengurusPage() {
  const cabinets = await getStructureCabinets()

  return (
    <StructureAdminEditor
      initialCabinets={cabinets.map((cabinet) => ({
        id: cabinet.id,
        orderLabel: cabinet.orderLabel,
        name: cabinet.name,
        theme: cabinet.theme,
        logoPath: cabinet.logoPath,
        logoPreviewUrl: cabinet.logoUrl,
        philosophy: cabinet.philosophy,
        isDefault: cabinet.isDefault,
        sections: cabinet.sections.map((section) => ({
          department: section.department,
          members: section.members.map((member) => ({
            id: member.id,
            name: member.name,
            nickname: member.nickname,
            position: member.position,
            program: member.program,
            entryYear: member.entryYear,
            gender: member.gender,
            quote: member.quote,
            photoPath: member.photoPath,
            photoPreviewUrl: member.photoUrl,
            instagram: member.instagram,
            linkedin: member.linkedin,
            github: member.github,
            website: member.website,
            tiktok: member.tiktok,
            youtube: member.youtube,
          })),
        })),
      }))}
    />
  )
}
