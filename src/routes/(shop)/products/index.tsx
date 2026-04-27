import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

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
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { getCategories } from "@/server/categories";
import { getFilteredProducts } from "@/server/get-filtered-products";

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
  loader: async ({ deps }) => {
    let page = 1;
    if (deps.page) {
      page = deps.page;
    }
    const minPrice = deps.minPrice;
    const maxPrice = deps.maxPrice;

    const [{ products, total }, categories] = await Promise.all([
      getFilteredProducts({
        data: {
          category: deps.category,
          sort: deps.sort,
          search: deps.search,
          featured: deps.featured ? deps.featured : false,
          minPrice,
          maxPrice,
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
        },
      }),
      getCategories(),
    ]);

    return {
      products,
      total,
      categories,
      currentPage: page,
      minPrice,
      maxPrice,
      selectedCategory: deps.category ? deps.category : "",
      selectedSort: deps.sort ? deps.sort : "featured",
    };
  },
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 30,
  component: CategoriesPage,
});

function CategoriesPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { t } = useI18n();
  const {
    products,
    total,
    categories,
    currentPage,
    minPrice,
    maxPrice,
    selectedCategory,
    selectedSort,
  } = Route.useLoaderData();

  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const nextMinPrice = typeof minPrice === "number" ? minPrice : 0;
    const nextMaxPrice = typeof maxPrice === "number" ? maxPrice : 5000;
    return [nextMinPrice, nextMaxPrice];
  });

  useEffect(() => {
    const nextMinPrice = typeof minPrice === "number" ? minPrice : 0;
    const nextMaxPrice = typeof maxPrice === "number" ? maxPrice : 5000;
    setPriceRange([nextMinPrice, nextMaxPrice]);
  }, [minPrice, maxPrice]);

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

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    navigate({
      to: "/products",
      search: (prev) => ({
        ...prev,
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sort: "featured",
        page: 1,
      }),
    });
  };

  const filterSidebar = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          {t("shop.productFilters.categories")}
        </h3>
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => updateSearch({ category: "", page: 1 })}
            className={
              !selectedCategory
                ? "block w-full border-l-2 border-slate-900 pl-3 py-1.5 text-left text-sm font-semibold text-slate-900"
                : "block w-full border-l-2 border-transparent pl-3 py-1.5 text-left text-sm text-slate-500 transition-colors hover:text-slate-900 hover:border-slate-300 cursor-pointer"
            }
          >
            {t("shop.productFilters.all")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => updateSearch({ category: category.name, page: 1 })}
              className={
                selectedCategory === category.name
                  ? "block w-full border-l-2 border-slate-900 pl-3 py-1.5 text-left text-sm font-semibold text-slate-900"
                  : "block w-full border-l-2 border-transparent pl-3 py-1.5 text-left text-sm text-slate-500 transition-colors hover:text-slate-900 hover:border-slate-300 cursor-pointer"
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          {t("shop.productFilters.priceRange")}
        </h3>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommitted={(value) => {
            const [nextMin, nextMax] = value as [number, number];
            updateSearch({ minPrice: nextMin, maxPrice: nextMax, page: 1 });
          }}
          className="mb-3"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );

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
                onClick={resetFilters}
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
