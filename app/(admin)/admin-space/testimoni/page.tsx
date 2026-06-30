import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { CheckIcon, PencilIcon, PlusCircleIcon, XIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { DeleteTestimonialButton } from "@/components/admin/delete-testimonial-button"
import { deleteTestimonialAction } from "@/app/(admin)/admin-space/testimoni/actions"
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
import { getTestimonialsWithImageUrls } from "@/lib/testimonials"

export default async function AdminTestimoniPage({
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

  const testimonials = await getTestimonialsWithImageUrls(
    session.user.role === "admin" || session.user.role === "developer"
      ? undefined
      : session.user.id
  )
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Testimoni
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {testimonials.length} testimoni tersimpan.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl bg-white px-4 shadow-sm hover:bg-slate-50"
          >
            <Link href="testimoni/tambah">
              <PlusCircleIcon className="mr-2 size-4" />
              Tambah Testimoni
            </Link>
          </Button>
        </div>

        <>
          <div className="overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Testimoni</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Belum ada testimoni
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Klik tombol &quot;Tambah Testimoni&quot; untuk membuat testimoni pertama.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTestimonials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            N/A
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-slate-600">{item.designation}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2 text-sm text-slate-600">{item.quote}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon-sm" asChild>
                          <Link href={`/testimoni/${item.id}/edit`}>
                            <PencilIcon className="size-4" />
                          </Link>
                        </Button>
                        <DeleteTestimonialButton
                          id={item.id}
                          name={item.name}
                          action={deleteTestimonialAction}
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? `/testimoni?page=${currentPage - 1}` : "#"}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => {
                if (totalPages === 0) {
                  return (
                    <PaginationItem key={1}>
                      <PaginationLink href="/testimoni?page=1" isActive>
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
                      <PaginationLink href={`/testimoni?page=${page}`} isActive={currentPage === page}>
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
                  href={currentPage < totalPages ? `/testimoni?page=${currentPage + 1}` : "#"}
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
