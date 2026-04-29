import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
}

function ProductPaginationContent({
  currentPage,
  totalPages,
}: ProductPaginationProps) {
  const navigate = useNavigate();

  if (totalPages <= 1) {
    return <></>;
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    navigate({
      to: "/products",
      search: (prev) => ({ ...prev, page }),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={
                isCurrent
                  ? "h-10 w-10 rounded-full bg-slate-900 text-sm font-medium text-white shadow-lg shadow-slate-200 transition-all"
                  : "h-10 w-10 rounded-full text-sm text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              }
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export function ProductPagination(props: ProductPaginationProps) {
  return (
    <Suspense fallback={<></>}>
      <ProductPaginationContent {...props} />
    </Suspense>
  );
}
