import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function AdminPagination({
  currentPage,
  totalPages,
  getHref,
}: {
  currentPage: number
  totalPages: number
  getHref: (page: number) => string
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? getHref(currentPage - 1) : "#"}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1).map((page) => {
          if (totalPages === 0) {
            return (
              <PaginationItem key={1}>
                <PaginationLink href={getHref(1)} isActive>
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
                <PaginationLink href={getHref(page)} isActive={currentPage === page}>
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
            href={currentPage < totalPages ? getHref(currentPage + 1) : "#"}
            className={
              currentPage >= totalPages || totalPages === 0
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
