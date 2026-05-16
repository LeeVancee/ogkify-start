import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ProductFilters } from "@/components/shop/product/product-filters";
import { shopCategoriesQueryOptions } from "@/lib/shop/query-options";

export const Route = createFileRoute("/(shop)/products")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(shopCategoriesQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());

  return (
    <div className="shop-shell py-10 sm:py-14">
      <div className="flex gap-10">
        <aside className="hidden w-56 shrink-0 sm:block">
          <ProductFilters categories={categories} />
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
