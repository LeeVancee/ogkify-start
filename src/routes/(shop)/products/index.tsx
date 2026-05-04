import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { ProductFilters } from "@/components/shop/product/product-filters";
import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductPagination } from "@/components/shop/product/product-pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  color: z.union([z.string(), z.array(z.string())]).optional(),
  size: z.union([z.string(), z.array(z.string())]).optional(),
  page: z.number().optional(),
});

const sortOptions = [
  { value: "featured", labelKey: "shop.productFilters.sortFeatured" },
  { value: "price-asc", labelKey: "shop.productFilters.sortPriceAsc" },
  { value: "price-desc", labelKey: "shop.productFilters.sortPriceDesc" },
  { value: "newest", labelKey: "shop.productFilters.sortNewest" },
];

function SortSelect({
  value,
  onValueChange,
  triggerClassName,
  contentClassName,
  contentAlign = "center",
}: {
  value: string;
  onValueChange: (value: string | null) => void;
  triggerClassName: string;
  contentClassName?: string;
  contentAlign?: "start" | "center" | "end";
}) {
  const { t } = useI18n();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={t("shop.productFilters.sortBy")} />
      </SelectTrigger>
      <SelectContent
        align={contentAlign}
        alignItemWithTrigger={false}
        className={contentClassName}
      >
        <SelectGroup>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Route = createFileRoute("/(shop)/products/")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    category: search.category,
    sort: search.sort,
    search: search.search,
    featured: search.featured,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    color: search.color,
    size: search.size,
    page: search.page,
  }),
  loader: ({ context, deps }) => {
    const page = deps.page ?? 1;

    return Promise.all([
      context.queryClient.ensureQueryData(
        shopFilteredProductsQueryOptions({
          category: deps.category,
          sort: deps.sort,
          search: deps.search,
          featured: deps.featured ?? false,
          minPrice: deps.minPrice,
          maxPrice: deps.maxPrice,
          colors: Array.isArray(deps.color)
            ? deps.color
            : deps.color
              ? [deps.color]
              : undefined,
          sizes: Array.isArray(deps.size)
            ? deps.size
            : deps.size
              ? [deps.size]
              : undefined,
          page,
          limit: 12,
        }),
      ),
      context.queryClient.ensureQueryData(shopCategoriesQueryOptions()),
    ]);
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { t } = useI18n();
  const currentPage = search.page ?? 1;
  const selectedCategory = search.category ?? "";
  const selectedSort = search.sort ?? "featured";
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());
  const { data: filteredProducts } = useSuspenseQuery(
    shopFilteredProductsQueryOptions({
      category: search.category,
      sort: search.sort,
      search: search.search,
      featured: search.featured ?? false,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      colors: Array.isArray(search.color)
        ? search.color
        : search.color
          ? [search.color]
          : undefined,
      sizes: Array.isArray(search.size)
        ? search.size
        : search.size
          ? [search.size]
          : undefined,
      page: currentPage,
      limit: 12,
    }),
  );
  const { products, total } = filteredProducts;

  const [filterOpen, setFilterOpen] = useState(false);
  const categoryLabel = useMemo(() => {
    if (!selectedCategory) return t("shop.header.allProducts");
    const category = categories.find((item) => item.name === selectedCategory);
    return category ? category.name : t("shop.productFilters.fallbackProducts");
  }, [categories, selectedCategory, t]);

  const updateSearch = (next: {
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
  }) => {
    navigate({
      to: "/products",
      search: (prev) => ({
        ...prev,
        category:
          typeof next.category === "string" ? next.category : prev.category,
        sort: typeof next.sort === "string" ? next.sort : prev.sort,
        minPrice:
          typeof next.minPrice === "number" ? next.minPrice : prev.minPrice,
        maxPrice:
          typeof next.maxPrice === "number" ? next.maxPrice : prev.maxPrice,
        page: typeof next.page === "number" ? next.page : 1,
      }),
    });
  };

  const clearProductFilters = () => {
    navigate({
      to: "/products",
      search: {},
    });
  };

  const filterSidebar = <ProductFilters categories={categories} />;

  return (
    <div className="shop-shell py-10 sm:py-14">
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
          <SortSelect
            value={selectedSort}
            onValueChange={(value) =>
              updateSearch({ sort: value ?? "featured", page: 1 })
            }
            triggerClassName="hidden h-11 w-[180px] rounded-full border-slate-300 bg-white px-5 text-sm text-slate-700 shadow-none sm:flex"
            contentClassName="w-(--anchor-width)"
            contentAlign="end"
          />

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

      <div className="flex gap-10">
        <aside className="hidden w-52 shrink-0 sm:block">{filterSidebar}</aside>

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
              {filterSidebar}
              <div className="mt-8">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {t("shop.productFilters.sortBy")}
                </h3>
                <SortSelect
                  value={selectedSort}
                  onValueChange={(value) =>
                    updateSearch({ sort: value ?? "featured", page: 1 })
                  }
                  triggerClassName="h-11 w-full rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-none"
                  contentClassName="w-(--anchor-width)"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex-1">
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
        </div>
      </div>
    </div>
  );
}
