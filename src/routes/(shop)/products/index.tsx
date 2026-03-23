import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ProductGrid } from "@/components/shop/product/product-grid";
import { ProductPagination } from "@/components/shop/product/product-pagination";
import { Slider } from "@/components/ui/slider";
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
    if (!selectedCategory) return "All Products";
    const category = categories.find((item) => item.name === selectedCategory);
    return category ? category.name : "Products";
  }, [categories, selectedCategory]);

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
        <h3 className="mb-3 text-sm font-medium text-foreground">Category</h3>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => updateSearch({ category: "", page: 1 })}
            className={
              !selectedCategory
                ? "block w-full rounded px-2 py-1.5 text-left text-sm font-medium text-foreground bg-muted"
                : "block w-full rounded px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => updateSearch({ category: category.name, page: 1 })}
              className={
                selectedCategory === category.name
                  ? "block w-full rounded px-2 py-1.5 text-left text-sm font-medium text-foreground bg-muted"
                  : "block w-full rounded px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Price Range
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
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Sort By</h3>
        <select
          value={selectedSort}
          onChange={(e) => updateSearch({ sort: e.target.value, page: 1 })}
          className="w-full rounded-lg border-0 bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="shop-shell py-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-foreground sm:text-3xl">
            {categoryLabel}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} products</p>
        </div>

        <button
          type="button"
          onClick={() => setFilterOpen((open) => !open)}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 sm:block">
          {filterSidebar}
        </aside>

        {filterOpen ? (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto bg-background p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium">Filters</span>
                <button type="button" onClick={() => setFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterSidebar}
            </div>
          </div>
        ) : null}

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-lg">
                No products matched your current filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-sm text-foreground underline underline-offset-4"
              >
                Clear Filters
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
