import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import ProductCard from "@/components/shop/product/product-card";
import { searchProducts } from "@/server/search";

const searchParamsSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/(shop)/search")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    q: search.q,
  }),
  component: RouteComponent,
  loader: async ({ deps }) => {
    if (!deps.q || !deps.q.trim()) {
      return { products: [], query: "" };
    }

    const query = deps.q.trim();
    const products = await searchProducts({ data: query });
    return { products, query };
  },
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 15,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { products, query } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState(query);

  const submitSearch = () => {
    if (!searchQuery.trim()) return;

    navigate({
      to: "/search",
      search: { q: searchQuery.trim() },
    });
  };

  return (
    <div className="shop-shell py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Search</p>
          <h1 className="mt-1 text-3xl font-light tracking-tight text-slate-900">
            Find Products
          </h1>
        </div>
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="Search products..."
            autoFocus
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-base text-slate-900 shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-0"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {!query ? (
        <div className="py-24 text-center text-slate-400">
          <Search className="mx-auto mb-4 h-10 w-10 text-slate-200" />
          <p className="text-sm">Type a keyword and press Enter to search</p>
        </div>
      ) : (
        <>
          <div className="mt-10 mb-6 flex items-end justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-light text-slate-900">
                Results for <span className="font-semibold">"{query}"</span>
              </h2>
              <p className="mt-0.5 text-sm text-slate-400">
                {products.length} product{products.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-light text-slate-500">No products found for "{query}"</p>
              <p className="mt-2 text-sm text-slate-400">
                Try a different keyword or browse the collection instead.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
