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
      <section className="overflow-hidden border-b border-border bg-background">
        <div className="shop-shell flex min-h-[34rem] items-center justify-center py-20 text-center sm:py-28 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <p className="geist-label mb-5">Ogkify General Store</p>
            <h1 className="text-5xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-7xl lg:text-8xl">
              Everyday Finds
              <br />
              All in One Place
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-6 text-muted-foreground sm:text-lg">
              Shop a curated mix of home goods, accessories, lifestyle picks,
              and useful essentials for every part of your day.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-ring"
              >
                Shop All Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                search={{ sort: "newest" }}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-[#00000036] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-ring"
              >
                View New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="border-b border-border bg-secondary">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-12 text-center">
            <p className="geist-label mb-2">{t("shop.home.browse")}</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
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
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-md border border-border bg-muted shadow-[0_2px_2px_rgba(0,0,0,0.04)]"
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 p-4 text-sm font-medium text-white transition-transform duration-300 group-hover:-translate-y-0.5">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Picks */}
      <section className="border-b border-border bg-background">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="geist-label mb-1">{t("shop.home.handpicked")}</p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
                {t("shop.home.featuredPicks")}
              </h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                <div className="relative mb-3 aspect-3/4 overflow-hidden rounded-md border border-border bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="truncate text-sm font-medium text-foreground">
                  {product.name}
                </h3>
                <div className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(product.price)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 ? (
        <section className="bg-secondary">
          <div className="shop-shell py-20 sm:py-24">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="geist-label mb-1">{t("shop.home.justIn")}</p>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
                  {t("shop.home.newArrivals")}
                </h2>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("shop.home.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="group -mx-4 flex cursor-pointer items-center gap-5 rounded-md px-4 py-5 transition-colors hover:bg-background"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-md border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-foreground">
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
