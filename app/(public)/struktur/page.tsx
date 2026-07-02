import type { Metadata } from "next"
import { redirect } from "next/navigation"

import {
  getDefaultStructureCabinetId,
  getStructureCabinetHref,
} from "@/lib/structure"

export const revalidate = 300

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
}

export default async function StructureIndexPage() {
  const defaultCabinetId = await getDefaultStructureCabinetId()

  if (!defaultCabinetId) {
    redirect("/tentang-fmiunnes")
  }

  redirect(getStructureCabinetHref(defaultCabinetId))
}
