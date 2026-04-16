import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { getCategories } from "@/server/categories";
import { getFeaturedProducts } from "@/server/get-featured-products";

export const Route = createFileRoute("/(shop)/")({
  component: RouteComponent,
  loader: async () => {
    const [featuredProducts, categories] = await Promise.all([
      getFeaturedProducts({ data: 7 }),
      getCategories(),
    ]);

    return {
      featuredProducts,
      categories,
    };
  },
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60,
});

function RouteComponent() {
  const { featuredProducts, categories } = Route.useLoaderData();
  const featured = featuredProducts.slice(0, 4);
  const newArrivals = featuredProducts.slice(4, 7);

  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="shop-shell flex flex-col items-center gap-10 py-20 sm:py-28 lg:flex-row lg:gap-20 lg:py-36">
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Curated Selection
            </p>
            <h1 className="text-5xl font-light leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Built for
              <br />
              Everyday Play
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0">
              Discover standout gear, clean visuals, and a lineup picked for
              your next session.
            </p>
            <Link
              to="/products"
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="w-full max-w-lg flex-1">
            <img
              src="/billboard.webp"
              alt="Spring Summer Collection"
              fetchPriority="high"
              className="w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="bg-slate-50">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Browse
            </p>
            <h2 className="text-3xl font-light tracking-tight text-slate-900">
              Shop By Category
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {categories.map((category) => {
              if (!category.imageUrl) {
                throw new Error(
                  `Category image is missing for category ${category.id}`,
                );
              }

              return (
                <Link
                  key={category.id}
                  to="/products"
                  search={{ category: category.name }}
                  className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 translate-y-1 p-4 text-sm font-semibold tracking-wide text-white transition-transform duration-300 group-hover:translate-y-0">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Picks */}
      <section className="bg-white">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Handpicked
              </p>
              <h2 className="text-3xl font-light tracking-tight text-slate-900">
                Featured Picks
              </h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {featured.map((product) => (
              <Link
                key={product.id}
                to="/product/$id"
                params={{ id: product.id }}
                className="group cursor-pointer"
              >
                <div className="relative mb-3 aspect-3/4 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="truncate text-sm font-medium text-slate-900">
                  {product.name}
                </h3>
                <div className="mt-1 text-sm text-slate-500">
                  {formatPrice(product.price)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 ? (
        <section className="bg-slate-50">
          <div className="shop-shell py-20 sm:py-24">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Just In
                </p>
                <h2 className="text-3xl font-light tracking-tight text-slate-900">
                  New Arrivals
                </h2>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="group flex items-center gap-5 py-5 transition-colors hover:bg-white rounded-xl px-4 -mx-4 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {product.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
