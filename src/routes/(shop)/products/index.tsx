import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { ProductFilters } from "@/components/shop/product/product-filters";
import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductPagination } from "@/components/shop/product/product-pagination";
import { ProductsLoading } from "@/components/shop/product/products-loading";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import {
  shopCategoriesQueryOptions,
  shopFilteredProductsQueryOptions,
} from "@/lib/shop/query-options";

const searchParamsSchema = z.object({
  category: z.string().optional(),
  sort: z.enum(["featured", "newest", "price-asc", "price-desc"]).optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  page: z.number().int().positive().optional(),
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
  component: CategoriesPage,
});

function CategoriesPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const { t, locale } = useI18n();
  const currentPage = search.page ?? 1;
  const selectedCategory = search.category ?? "";
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());
  const {
    data: productsData,
    isPending,
    isError,
    error,
  } = useQuery(
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
  if (isError) throw error;
  const products = productsData?.products ?? [];
  const total = productsData?.total ?? 0;
  const categoryLabel = selectedCategory
    ? (categories.find((item) => item.name === selectedCategory)?.name ??
      t("shop.productFilters.fallbackProducts"))
    : t("shop.header.allProducts");

  const clearProductFilters = () => {
    router.navigate({
      to: "/products",
      search: {},
    });
  };

  const mobileFilters = <ProductFilters categories={categories} />;

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-7">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t(
              total === 1
                ? "shop.productFilters.productCount_one"
                : "shop.productFilters.productCount_other",
              { count: total },
            )}
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 sm:text-5xl">
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

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent className="shop-theme overflow-y-auto p-6 data-[side=right]:w-full data-[side=right]:sm:max-w-sm">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("shop.productFilters.filters")}</SheetTitle>
          </SheetHeader>
          {mobileFilters}
          <Button className="mt-8 w-full" onClick={() => setFilterOpen(false)}>
            {locale === "en"
              ? "Show results"
              : locale === "zh-CN"
                ? "显示结果"
                : "顯示結果"}
          </Button>
        </SheetContent>
      </Sheet>

      {isPending ? (
        <ProductsLoading />
      ) : products.length === 0 ? (
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
