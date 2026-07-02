import Image from "next/image"
import { CheckIcon, XIcon } from "lucide-react"

import { GalleryFilterTabs } from "@/components/admin/gallery-filter-tabs"
import { AdminPagination } from "@/components/admin/admin-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPaginatedGalleryActivities } from "@/lib/gallery"
import { ApproveGalleryButton, RejectGalleryButton, DeleteGalleryButton } from "./actions-buttons"

export default async function AdminGaleriManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const params = await searchParams
  const currentTab =
    params.tab === "pending" || params.tab === "approved" || params.tab === "rejected"
      ? params.tab
      : "all"
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 10

  const { items, totalCount } = await getPaginatedGalleryActivities({
    page: currentPage,
    pageSize: itemsPerPage,
    status: currentTab,
  })
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const paginatedItems =
    safeCurrentPage === currentPage
      ? items
      : (
          await getPaginatedGalleryActivities({
            page: safeCurrentPage,
            pageSize: itemsPerPage,
            status: currentTab,
          })
        ).items

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Galeri</h2>
            <p className="mt-1 text-sm text-slate-500">
              {totalCount} galeri ditemukan
            </p>
          </div>

          <GalleryFilterTabs currentTab={currentTab} />
        </div>

        <GalleryTable items={paginatedItems} />

        <div className="mt-6">
          <AdminPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            getHref={(page) => `/admin/galeri?tab=${currentTab}&page=${page}`}
          />
        </div>
      </section>
    </div>
  )
}

type GalleryActivity = Awaited<ReturnType<typeof getPaginatedGalleryActivities>>["items"][number]

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
                  <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
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
