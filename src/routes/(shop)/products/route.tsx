import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ProductFilters } from "@/components/shop/product/product-filters";
import { shopCategoriesQueryOptions } from "@/lib/shop/query-options";

export const Route = createFileRoute("/(shop)/products")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(shopCategoriesQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const categoriesQuery = useQuery(shopCategoriesQueryOptions());
  const categories = categoriesQuery.data ?? [];

  return (
    <div className="shop-shell py-10 sm:py-14">
      <div className="flex gap-10">
        <aside className="hidden w-52 shrink-0 sm:block">
          <ProductFilters categories={categories} />
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
