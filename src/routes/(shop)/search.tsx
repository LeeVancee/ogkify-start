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
    const query = deps.q || "";
    const products = await searchProducts({ data: query });
    return { products, query };
  },
  // Cache search results for 5 minutes since search results can change more frequently
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 15, // 15 minutes (keep in memory)
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { products, query } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState(query);

  const submitSearch = () => {
    if (!searchQuery.trim()) {
      throw new Error("Search query is required");
    }

    navigate({
      to: "/search",
      search: { q: searchQuery.trim() },
    });
  };

  return (
    <div className="shop-shell py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
            placeholder="Search products..."
            className="w-full rounded-full border border-border bg-background py-4 pl-14 pr-14 text-base text-foreground shadow-sm outline-none transition-colors focus:border-foreground/30"
          />
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Search Results
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} result{products.length === 1 ? "" : "s"} for "{query}"
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-xl font-medium text-foreground">No products found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a different keyword or browse the collection instead.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="max-w-sm">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
