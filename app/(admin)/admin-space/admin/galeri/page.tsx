import { CheckIcon, XIcon } from "lucide-react"

import { GalleryFilterTabs } from "@/components/admin/gallery-filter-tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getGalleryActivities } from "@/lib/gallery"
import { ApproveGalleryButton, RejectGalleryButton, DeleteGalleryButton } from "./actions-buttons"

export default async function AdminGaleriManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const params = await searchParams
  const currentTab = params.tab || "all"
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 10

  const items = await getGalleryActivities()
  const filteredItems =
    currentTab === "pending"
      ? items.filter((item) => item.status === "pending")
      : currentTab === "approved"
        ? items.filter((item) => item.status === "approved")
        : currentTab === "rejected"
          ? items.filter((item) => item.status === "rejected")
          : items

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Galeri</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredItems.length} galeri ditemukan
            </p>
          </div>

          <GalleryFilterTabs currentTab={currentTab} />
        </div>

        <GalleryTable items={paginatedItems} />

        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1
                      ? `/admin/galeri?tab=${currentTab}&page=${currentPage - 1}`
                      : "#"
                  }
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => {
                if (totalPages === 0) {
                  return (
                    <PaginationItem key={1}>
                      <PaginationLink href={`/admin/galeri?tab=${currentTab}&page=1`} isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/admin/galeri?tab=${currentTab}&page=${page}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? `/admin/galeri?tab=${currentTab}&page=${currentPage + 1}`
                      : "#"
                  }
                  className={
                    currentPage >= totalPages || totalPages === 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </div>
  )
}

type GalleryActivity = Awaited<ReturnType<typeof getGalleryActivities>>[number]

function GalleryTable({ items }: { items: GalleryActivity[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Nama Kegiatan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jumlah Foto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center">
                <p className="text-sm text-slate-500">Tidak ada galeri</p>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-slate-600">{item.eventDateLabel}</TableCell>
                <TableCell className="text-slate-600">{item.photoCount} foto</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.status !== "approved" && (
                      <ApproveGalleryButton galleryId={item.id} />
                    )}
                    {item.status !== "rejected" && (
                      <RejectGalleryButton galleryId={item.id} />
                    )}
                    <DeleteGalleryButton galleryId={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
        <CheckIcon className="h-3 w-3" />
        Disetujui
      </span>
    )
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        <XIcon className="h-3 w-3" />
        Ditolak
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
      Pending
    </span>
  )
}
