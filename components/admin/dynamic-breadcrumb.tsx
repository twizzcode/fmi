"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const pathNameMap: Record<string, string> = {
  "": "Dashboard",
  "admin": "Admin",
  "berita": "Berita",
  "galeri": "Galeri",
  "testimoni": "Testimoni",
  "layanan": "Layanan",
  "pengurus": "Pengurus",
  "anggota": "Anggota",
  "my-account": "My Account",
  "admin-space": "",
  "tambah": "Tambah",
  "edit": "Edit",
}

export function DynamicBreadcrumb({ adminOrigin }: { adminOrigin: string }) {
  const pathname = usePathname()
  
  const segments = pathname
    .split("/")
    .filter((segment) => segment !== "" && segment !== "admin-space")
    .map((segment) => ({
      name: pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: segment,
    }))

  if (segments.length === 0) {
    segments.push({ name: "Dashboard", path: "" })
  }

  const breadcrumbItems = segments.map((segment, index) => {
    const isLast = index === segments.length - 1
    const href = `${adminOrigin}/${segments.slice(0, index + 1).map(s => s.path).join("/")}`

    return (
      <div key={segment.path + index} className="contents">
        {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{segment.name}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>{segment.name}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </div>
    )
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={adminOrigin}>
            FMI Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
