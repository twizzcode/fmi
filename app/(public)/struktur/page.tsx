import { redirect } from "next/navigation"

import { getStructureCabinetHref, getStructurePageData } from "@/lib/structure"

export default async function StructureIndexPage() {
  const { defaultCabinetId } = await getStructurePageData()

  if (!defaultCabinetId) {
    redirect("/tentang-fmiunnes")
  }

  redirect(getStructureCabinetHref(defaultCabinetId))
}
