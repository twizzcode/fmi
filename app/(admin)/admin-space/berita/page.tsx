import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { PlusCircleIcon, PencilIcon } from "lucide-react"

import { auth, getSessionUserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { DeleteNewsButton } from "./delete-news-button"
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
import { getAdminNewsArticles } from "@/lib/news"

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

  const items = await getAdminNewsArticles(
    getSessionUserRole(session) === "admin" || getSessionUserRole(session) === "developer"
      ? undefined
      : session.user.id
  )
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)

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
              {items.length} berita tersimpan.
            </p>
          </div>
          <Button asChild variant="outline" className="bg-white hover:bg-slate-50">
            <Link href="/berita/tambah">
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
                      <div className="h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
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
                          <Link href={`/berita/${item.id}/edit`}>
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? `/berita?page=${currentPage - 1}` : "#"}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => {
                if (totalPages === 0) {
                  return (
                    <PaginationItem key={1}>
                      <PaginationLink href="/berita?page=1" isActive>
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
                      <PaginationLink href={`/berita?page=${page}`} isActive={currentPage === page}>
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
                  href={currentPage < totalPages ? `/berita?page=${currentPage + 1}` : "#"}
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
