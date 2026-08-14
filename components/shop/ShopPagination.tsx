"use client";

interface ShopPaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function ShopPagination({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((pageNumber) => {
    if (totalPages <= 7) {
      return true;
    }

    if (pageNumber === 1 || pageNumber === totalPages) {
      return true;
    }

    return pageNumber >= page - 1 && pageNumber <= page + 1;
  });

  return (
    <nav aria-label="Shop pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1 || isLoading}
        className="h-10 rounded-xl border border-[#F8EFD8] px-4 text-sm font-semibold transition hover:bg-[#FFF8EC] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((pageNumber, index) => {
        const previousPage = pages[index - 1];

        const showEllipsis = previousPage !== undefined && pageNumber - previousPage > 1;

        return (
          <div key={pageNumber} className="flex items-center gap-2">
            {showEllipsis && <span className="px-1 text-muted-foreground">…</span>}

            <button
              type="button"
              onClick={() => onPageChange(pageNumber)}
              disabled={isLoading}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition ${
                pageNumber === page
                  ? "border-[#3F7DFF] bg-[#3F7DFF] text-white"
                  : "border-[#F8EFD8] hover:bg-[#FFF8EC]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {pageNumber}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages || isLoading}
        className="h-10 rounded-xl border border-[#F8EFD8] px-4 text-sm font-semibold transition hover:bg-[#FFF8EC] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
