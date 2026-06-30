import { CheckIcon, XIcon } from "lucide-react"

import { TestimonialFilterTabs } from "@/components/admin/testimonial-filter-tabs"
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
import { ApproveTestimonialButton, RejectTestimonialButton, DeleteTestimonialButton } from "./actions-buttons"

export default async function AdminTestimoniManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const params = await searchParams
  const currentTab = params.tab || "all"
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 10

  const testimonials = await getTestimonialsWithImageUrls()
  const filteredTestimonials =
    currentTab === "pending"
      ? testimonials.filter((item) => item.status === "pending")
      : currentTab === "approved"
        ? testimonials.filter((item) => item.status === "approved")
        : currentTab === "rejected"
          ? testimonials.filter((item) => item.status === "rejected")
          : testimonials

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Testimoni</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTestimonials.length} testimoni ditemukan
            </p>
          </div>

          <TestimonialFilterTabs currentTab={currentTab} />
        </div>

        <TestimonialTable testimonials={paginatedTestimonials} />

        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1
                      ? `/admin/testimoni?tab=${currentTab}&page=${currentPage - 1}`
                      : "#"
                  }
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => {
                if (totalPages === 0) {
                  return (
                    <PaginationItem key={1}>
                      <PaginationLink href={`/admin/testimoni?tab=${currentTab}&page=1`} isActive>
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
                        href={`/admin/testimoni?tab=${currentTab}&page=${page}`}
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
                      ? `/admin/testimoni?tab=${currentTab}&page=${currentPage + 1}`
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

type TestimonialView = Awaited<ReturnType<typeof getTestimonialsWithImageUrls>>[number]

function TestimonialTable({ testimonials }: { testimonials: TestimonialView[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
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
          {testimonials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center">
                <p className="text-sm text-slate-500">Tidak ada testimoni</p>
              </TableCell>
            </TableRow>
          ) : (
            testimonials.map((item) => (
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
                    {item.status !== "approved" && (
                      <ApproveTestimonialButton testimonialId={item.id} />
                    )}
                    {item.status !== "rejected" && (
                      <RejectTestimonialButton testimonialId={item.id} />
                    )}
                    <DeleteTestimonialButton testimonialId={item.id} />
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
