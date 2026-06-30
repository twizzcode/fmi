import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getStructureCabinetHref, getStructurePageData } from "@/lib/structure"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
}

export default async function StructureIndexPage() {
  const { defaultCabinetId } = await getStructurePageData()

  if (!defaultCabinetId) {
    redirect("/tentang-fmiunnes")
  }

  redirect(getStructureCabinetHref(defaultCabinetId))
}
