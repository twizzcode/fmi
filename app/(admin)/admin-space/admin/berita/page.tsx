import { CheckIcon } from "lucide-react"

import { NewsFilterTabs } from "@/components/admin/news-filter-tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getAdminNewsArticles } from "@/lib/news"
import { PublishNewsButton, UnpublishNewsButton, DeleteNewsButton } from "./actions-buttons"

export default async function AdminBeritaManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const params = await searchParams
  const currentTab = params.tab || "all"
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 10

  const allItems = await getAdminNewsArticles()

  const filteredItems =
    currentTab === "published"
      ? allItems.filter((item) => item.status === "published")
      : currentTab === "draft"
        ? allItems.filter((item) => item.status === "draft")
        : allItems

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">

      <section className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Berita</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredItems.length} berita ditemukan
            </p>
          </div>
          
          <NewsFilterTabs currentTab={currentTab} />
        </div>

        <NewsTable items={paginatedItems} />
        
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1
                      ? `/admin/berita?tab=${currentTab}&page=${currentPage - 1}`
                      : "#"
                  }
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => {
                if (totalPages === 0) {
                  return (
                    <PaginationItem key={1}>
                      <PaginationLink
                        href={`/admin/berita?tab=${currentTab}&page=1`}
                        isActive={true}
                      >
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
                        href={`/admin/berita?tab=${currentTab}&page=${page}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
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
                      ? `/admin/berita?tab=${currentTab}&page=${currentPage + 1}`
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

type NewsArticle = Awaited<ReturnType<typeof getAdminNewsArticles>>[number]

function NewsTable({ items }: { items: NewsArticle[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
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
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center">
                <p className="text-sm text-slate-500">Tidak ada berita</p>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                    {item.imageUrl ? (
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
                    {item.status === "draft" && <PublishNewsButton newsId={item.id} />}
                    {item.status === "published" && <UnpublishNewsButton newsId={item.id} />}
                    <DeleteNewsButton newsId={item.id} />
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
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
        <CheckIcon className="h-3 w-3" />
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
