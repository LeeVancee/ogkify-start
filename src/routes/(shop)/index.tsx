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
  const heroProduct = featuredProducts[0];

  return (
    <>
      <section className="overflow-hidden border-b border-border bg-background">
        <div className="shop-shell grid min-h-[42rem] items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.86fr)_minmax(32rem,1.14fr)] lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-foreground" />
              <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                {t("shop.home.heroEyebrow")}
              </p>
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.75rem]">
              {t("shop.home.heroTitleLineOne")}
              <br />
              <span className="font-medium text-muted-foreground">
                {t("shop.home.heroTitleLineTwo")}
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {t("shop.home.heroDescription")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/products" className="shop-pill-button h-11 px-5">
                {t("shop.home.shopAll")} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/products"
                search={{ sort: "newest" }}
                className="group inline-flex h-11 items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-8 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t("shop.home.newArrivals")}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {heroProduct ? (
            <div className="relative">
              <div className="absolute -inset-12 -z-10 rounded-full bg-[radial-gradient(circle,rgba(160,139,109,0.18),transparent_68%)] blur-2xl" />
              <div className="rounded-[1.75rem] bg-secondary p-3 shadow-[0_28px_90px_rgba(57,48,38,0.12)]">
                <Link
                  to="/product/$id"
                  params={{ id: heroProduct.id }}
                  className="group relative block min-h-[29rem] overflow-hidden rounded-[1.15rem] bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[35rem]"
                >
                  <img
                    src={heroProduct.images[0]}
                    alt={heroProduct.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/25 to-transparent px-5 pb-5 pt-20 text-white">
                    <p className="text-[10px] font-medium tracking-[0.16em] text-white/70 uppercase">
                      {t("shop.home.heroFeatured")}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium sm:text-base">
                      {heroProduct.name}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Shop By Category */}
      <section className="border-b border-border bg-secondary">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-12 max-w-xl">
            <p className="geist-label mb-2">{t("shop.home.browse")}</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              {t("shop.home.shopByCategory")}
            </h2>
          </div>
          <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] lg:grid-cols-12 lg:auto-rows-[13rem]">
            {categories.map((category, index) => {
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
                  className={`group relative cursor-pointer overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-secondary ${getCategoryLayoutClass(index)}`}
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <span className="text-sm font-medium text-white sm:text-base">
                      {category.name}
                    </span>
                    <span className="font-mono text-[10px] text-white/65">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
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
                className="group cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="relative mb-3 aspect-3/4 overflow-hidden rounded-md bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mb-1 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                  {product.category}
                </p>
                <h3 className="truncate text-sm font-medium text-foreground">
                  {product.name}
                </h3>
                <div className="mt-1 text-sm text-foreground tabular-nums">
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

function getCategoryLayoutClass(index: number) {
  if (index === 0) {
    return "col-span-2 row-span-2 lg:col-span-6";
  }

  if (index >= 5) {
    return "col-span-2 lg:col-span-6";
  }

  return "col-span-1 lg:col-span-3";
}
