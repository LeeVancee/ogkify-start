import { useNavigate } from "@tanstack/react-router";
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

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            onClick={() => {
              navigate({
                to: "/products",
                search: (prev) => ({ ...prev, page }),
              });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={
              page === currentPage
                ? "h-9 w-9 rounded-full bg-foreground text-sm text-background transition-colors"
                : "h-9 w-9 rounded-full text-sm text-muted-foreground transition-colors hover:bg-muted"
            }
          >
            {page}
          </button>
        );
      })}
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
