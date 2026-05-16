import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { ProductFilters } from "@/components/shop/product/product-filters";
import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductPagination } from "@/components/shop/product/product-pagination";
import { useI18n } from "@/lib/i18n";
import {
  shopCategoriesQueryOptions,
  shopFilteredProductsQueryOptions,
} from "@/lib/shop/query-options";

const searchParamsSchema = z.object({
  category: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().optional(),
});

export const Route = createFileRoute("/(shop)/products/")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    category: search.category,
    sort: search.sort,
    search: search.search,
    featured: search.featured,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    page: search.page,
  }),
  loader: ({ context, deps }) => {
    const page = deps.page ?? 1;

    return context.queryClient.ensureQueryData(
      shopFilteredProductsQueryOptions({
        category: deps.category,
        sort: deps.sort,
        search: deps.search,
        featured: deps.featured ?? false,
        minPrice: deps.minPrice,
        maxPrice: deps.maxPrice,
        page,
        limit: 12,
      }),
    );
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { t } = useI18n();
  const currentPage = search.page ?? 1;
  const selectedCategory = search.category ?? "";
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());
  const { data: filteredProducts } = useSuspenseQuery(
    shopFilteredProductsQueryOptions({
      category: search.category,
      sort: search.sort,
      search: search.search,
      featured: search.featured ?? false,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      page: currentPage,
      limit: 12,
    }),
  );
  const { products, total } = filteredProducts;
  const categoryLabel = selectedCategory
    ? (categories.find((item) => item.name === selectedCategory)?.name ??
      t("shop.productFilters.fallbackProducts"))
    : t("shop.header.allProducts");

  const clearProductFilters = () => {
    navigate({
      to: "/products",
      search: {},
    });
  };

  const mobileFilters = <ProductFilters categories={categories} />;

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t(
              total === 1
                ? "shop.productFilters.productCount_one"
                : "shop.productFilters.productCount_other",
              { count: total },
            )}
          </p>
          <h1 className="text-3xl font-light tracking-tight text-slate-900 sm:text-4xl">
            {categoryLabel}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:text-slate-900 sm:hidden cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />{" "}
            {t("shop.productFilters.filters")}
          </button>
        </div>
      </div>

      {filterOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                {t("shop.productFilters.filters")}
              </span>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {mobileFilters}
          </div>
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg font-light text-slate-500">
            {t("shop.productFilters.noMatches")}
          </p>
          <button
            type="button"
            onClick={clearProductFilters}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 cursor-pointer"
          >
            {t("shop.productFilters.clearFilters")}
          </button>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          <ProductPagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / 12)}
          />
        </>
      )}
    </>
  );
}
