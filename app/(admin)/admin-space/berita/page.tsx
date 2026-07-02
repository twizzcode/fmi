import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { PlusCircleIcon, PencilIcon } from "lucide-react"

import { auth, getSessionUserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { DeleteNewsButton } from "./delete-news-button"
import { AdminPagination } from "@/components/admin/admin-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPaginatedAdminNewsArticles } from "@/lib/news"

export default async function AdminBeritaPage({
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

  const role = getSessionUserRole(session)
  const { items, totalCount } = await getPaginatedAdminNewsArticles({
    page: currentPage,
    pageSize: itemsPerPage,
    userId: role === "admin" || role === "developer" ? undefined : session.user.id,
  })
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const paginatedItems =
    safeCurrentPage === currentPage
      ? items
      : (
          await getPaginatedAdminNewsArticles({
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
              Workplace
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Berita
            </h1>
              <p className="mt-2 text-sm text-slate-500">
               {totalCount} berita tersimpan.
             </p>

          </div>
          <Button asChild variant="outline" className="bg-white hover:bg-slate-50">
            <Link href="/berita/tambah" prefetch={false}>
              <PlusCircleIcon className="mr-2 size-4" />
              Tambah Berita
            </Link>
          </Button>
        </div>

        <>
          <div className="overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Belum ada berita
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Klik tombol &quot;Tambah Berita&quot; untuk membuat berita pertama.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
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
                    <TableCell className="max-w-xs font-medium">
                      <p className="line-clamp-2">{item.title}</p>
                    </TableCell>
                    <TableCell className="text-slate-600">{item.category}</TableCell>
                    <TableCell className="text-slate-600">{item.author}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {item.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon-sm" asChild>
                          <Link href={`/berita/${item.id}/edit`} prefetch={false}>
                            <PencilIcon className="size-4" />
                          </Link>
                        </Button>
                        <DeleteNewsButton newsId={item.id} />
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
            getHref={(page) => `/berita?page=${page}`}
          />
        </div>
        </>
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
        Published
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
      Draft
    </span>
  )
}
