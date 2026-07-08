import { redirect } from "next/navigation"

import { StructureAdminEditor } from "@/components/admin/structure-admin-editor"
import { getRequestSession, getSessionUserRole } from "@/lib/auth"
import { appOrigin } from "@/lib/app-config"
import { getStructureCabinets } from "@/lib/structure"

export const dynamic = "force-dynamic"

export default async function StaffPengurusWorkspacePage() {
  const session = await getRequestSession()
  const role = getSessionUserRole(session)

  if (!session || (role !== "staff" && role !== "admin" && role !== "developer")) {
    redirect(appOrigin)
  }

  const cabinets = await getStructureCabinets()
  const defaultCabinet = cabinets.find((cabinet) => cabinet.isDefault)

  return (
    <StructureAdminEditor
      mode="staff"
      initialCabinets={defaultCabinet ? [{
        id: defaultCabinet.id,
        orderLabel: defaultCabinet.orderLabel,
        name: defaultCabinet.name,
        theme: defaultCabinet.theme,
        logoPath: defaultCabinet.logoPath,
        logoPreviewUrl: defaultCabinet.logoUrl,
        philosophy: defaultCabinet.philosophy,
        isDefault: defaultCabinet.isDefault,
        sections: defaultCabinet.sections.map((section) => ({
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
      }] : []}
    />
  )
}
