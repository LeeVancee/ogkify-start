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
    <div className="shop-shell py-12 sm:py-16">
      <div className="flex gap-10 lg:gap-14">
        <aside className="hidden w-44 shrink-0 border-r border-border pr-8 sm:block lg:w-52">
          <ProductFilters categories={categories} />
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
