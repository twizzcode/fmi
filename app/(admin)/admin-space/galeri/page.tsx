import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { CheckIcon, PlusCircleIcon, PencilIcon, XIcon } from "lucide-react"

import { deleteGalleryEntryAction } from "@/app/(admin)/admin-space/galeri/actions"
import { DeleteGalleryButton } from "@/components/admin/delete-gallery-button"
import { auth, getSessionUserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
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
import { isSupabaseStorageConfigured } from "@/lib/supabase/config"

export default async function AdminGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 10

  const isConfigured = isSupabaseStorageConfigured()
  const role = getSessionUserRole(session)
  const { items, totalCount } = isConfigured
    ? await getPaginatedGalleryActivities({
        page: currentPage,
        pageSize: itemsPerPage,
        userId: role === "admin" || role === "developer" ? undefined : session.user.id,
      })
    : { items: [], totalCount: 0 }
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const paginatedItems =
    !isConfigured || safeCurrentPage === currentPage
      ? items
      : (
          await getPaginatedGalleryActivities({
            page: safeCurrentPage,
            pageSize: itemsPerPage,
            userId: role === "admin" || role === "developer" ? undefined : session.user.id,
          })
        ).items

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Galeri
            </h1>
              <p className="mt-2 text-sm text-slate-500">
               {totalCount} kegiatan tersimpan.
             </p>

          </div>
          <Button asChild variant="outline" className="bg-white hover:bg-slate-50" disabled={!isConfigured}>
            <Link href="/galeri/tambah" prefetch={false}>
              <PlusCircleIcon className="mr-2 size-4" />
              Tambah Kegiatan
            </Link>
          </Button>
        </div>

        <>
          <div className="overflow-hidden rounded-xl border border-slate-200">
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
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Belum ada kegiatan galeri
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Klik tombol &quot;Tambah Kegiatan&quot; untuk membuat galeri pertama.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
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
                        <Button variant="outline" size="icon-sm" asChild>
                          <Link href={`/galeri/${item.id}/edit`} prefetch={false}>
                            <PencilIcon className="size-4" />
                          </Link>
                        </Button>
                        <DeleteGalleryButton
                          id={item.id}
                          title={item.title}
                          action={deleteGalleryEntryAction}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <AdminPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            getHref={(page) => `/galeri?page=${page}`}
          />
        </div>
        </>
      </section>
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
