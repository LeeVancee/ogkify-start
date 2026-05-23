import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import {
  shopCategoriesQueryOptions,
  shopFeaturedProductsQueryOptions,
} from "@/lib/shop/query-options";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/(shop)/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(shopFeaturedProductsQueryOptions(7)),
      context.queryClient.ensureQueryData(shopCategoriesQueryOptions()),
    ]);
  },
});

function RouteComponent() {
  const { t } = useI18n();
  const { data: featuredProducts } = useSuspenseQuery(
    shopFeaturedProductsQueryOptions(7),
  );
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());
  const featured = featuredProducts.slice(0, 4);
  const newArrivals = featuredProducts.slice(4, 7);

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-linear-to-b from-stone-50 via-stone-50 to-stone-100">
        <div className="shop-shell flex min-h-[34rem] items-center justify-center py-20 text-center sm:py-28 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Ogkify General Store
            </p>
            <h1 className="text-5xl font-light leading-[0.96] tracking-tight text-slate-900 sm:text-7xl lg:text-8xl">
              Everyday Finds
              <br />
              All in One Place
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-slate-500 sm:text-xl">
              Shop a curated mix of home goods, accessories, lifestyle picks,
              and useful essentials for every part of your day.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-900 px-9 text-base font-medium text-white transition-colors hover:bg-slate-700"
              >
                Shop All Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                search={{ sort: "newest" }}
                className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-9 text-base font-medium text-slate-700 backdrop-blur-sm transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-950"
              >
                View New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="bg-stone-100">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {t("shop.home.browse")}
            </p>
            <h2 className="text-3xl font-light tracking-tight text-slate-900">
              {t("shop.home.shopByCategory")}
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
      <section className="bg-stone-50">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {t("shop.home.handpicked")}
              </p>
              <h2 className="text-3xl font-light tracking-tight text-slate-900">
                {t("shop.home.featuredPicks")}
              </h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              {t("shop.home.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
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
        <section className="bg-stone-100">
          <div className="shop-shell py-20 sm:py-24">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {t("shop.home.justIn")}
                </p>
                <h2 className="text-3xl font-light tracking-tight text-slate-900">
                  {t("shop.home.newArrivals")}
                </h2>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                {t("shop.home.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="group -mx-4 flex items-center gap-5 rounded-xl px-4 py-5 transition-colors hover:bg-white/70 cursor-pointer"
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
