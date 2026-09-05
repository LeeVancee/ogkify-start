import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";

import { ProductGrid } from "@/components/shop/product/product-grid";
import { useI18n } from "@/lib/i18n";
import {
  shopCategoriesQueryOptions,
  shopFeaturedProductsQueryOptions,
  shopFilteredProductsQueryOptions,
} from "@/lib/shop/query-options";
import { formatPrice } from "@/lib/utils";

const arrivalsOptions = () =>
  shopFilteredProductsQueryOptions({ sort: "newest", limit: 8 });
export const Route = createFileRoute("/(shop)/")({
  component: HomePage,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(shopFeaturedProductsQueryOptions(4)),
      context.queryClient.ensureQueryData(shopCategoriesQueryOptions()),
      context.queryClient.ensureQueryData(arrivalsOptions()),
    ]);
  },
});
function HomePage() {
  const { t, locale } = useI18n();
  const { data: featured } = useSuspenseQuery(
    shopFeaturedProductsQueryOptions(4),
  );
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());
  const { data: arrivals } = useSuspenseQuery(arrivalsOptions());
  const [isBrowseOpen, setIsBrowseOpen] = useState(true);
  const hero = featured[0] ?? arrivals.products[0];
  const english = locale === "en";
  const simplified = locale === "zh-CN";
  return (
    <div className="shop-shell">
      <section className="grid border-b border-border lg:grid-cols-2">
        <div className="flex flex-col items-start justify-center pb-10 pt-12 sm:py-20 lg:pr-16">
          <p className="mb-8 text-[11px] tracking-[0.18em] text-muted-foreground">
            THE COLLECTOR’S EDIT — 01
          </p>
          <h1 className="text-5xl font-medium leading-[1.15] tracking-[-0.055em] sm:text-6xl xl:text-7xl">
            {english ? (
              <>
                A little space.
                <br />A lot of character.
              </>
            ) : simplified ? (
              <>
                收藏，
                <br />
                始于喜欢。
              </>
            ) : (
              <>
                收藏，
                <br />
                始於喜歡。
              </>
            )}
          </h1>
          <p className="mb-9 mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
            {english
              ? "From the first piece to the one you’ve been looking for. Find something that feels like you."
              : simplified
                ? "从第一件心动，到期待已久的那一款。为你的日常，添一点自己的模样。"
                : "從第一件心動，到期待已久的那一款。為你的日常，添一點自己的模樣。"}
          </p>
          <Link to="/products" className="shop-pill-button h-12 gap-10 px-6">
            {t("shop.home.shopAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {hero && (
          <Link
            to="/product/$id"
            params={{ id: hero.id }}
            className="group relative my-5 flex min-h-80 flex-col sm:my-8 lg:ml-6"
          >
            <div className="flex items-center justify-between p-5 text-[10px] tracking-[0.12em] text-muted-foreground">
              <span>{t("shop.home.heroFeatured")}</span>
              <span>NO. 001</span>
            </div>
            <div className="product-photo flex min-h-0 flex-1 items-center justify-center overflow-hidden">
              {hero.images[0] && (
                <img
                  src={hero.images[0]}
                  alt={hero.name}
                  fetchPriority="high"
                  className="h-72 w-full object-contain transition-transform duration-700 group-hover:scale-105 sm:h-80 lg:h-96"
                />
              )}
            </div>
            <div className="flex items-end justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] text-muted-foreground">
                  {hero.category}
                </p>
                <h2 className="line-clamp-1 text-sm font-medium">
                  {hero.name}
                </h2>
                <p className="mt-2 text-xs">{formatPrice(hero.price)}</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center border border-foreground/20">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        )}
      </section>
      <nav
        aria-label={t("shop.home.shopByCategory")}
        className="-mx-5 flex items-stretch overflow-x-auto border-b border-border px-5 text-xs whitespace-nowrap sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14"
      >
        <button
          type="button"
          aria-expanded={isBrowseOpen}
          onClick={() => setIsBrowseOpen((open) => !open)}
          className="mr-2 flex h-14 shrink-0 items-center gap-2 border-r border-border pr-6 text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("shop.home.browse")}
          <ChevronDown
            className={`size-3.5 transition-transform ${isBrowseOpen ? "rotate-180" : ""}`}
          />
        </button>
        <Link
          to="/products"
          className="flex h-14 shrink-0 items-center px-5 font-medium transition-colors hover:bg-secondary hover:text-foreground"
        >
          {t("shop.header.allProducts")}
        </Link>
        {isBrowseOpen
          ? categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                search={{ category: category.name }}
                className="flex h-14 shrink-0 items-center px-5 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {category.name}
              </Link>
            ))
          : null}
      </nav>
      <section className="pb-4 pt-14 sm:pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[10px] tracking-[0.16em] text-muted-foreground">
              JUST LANDED
            </p>
            <h2 className="text-3xl font-medium tracking-tight">
              {t("shop.home.newArrivals")}
            </h2>
          </div>
          <Link
            to="/products"
            search={{ sort: "newest" }}
            className="flex items-center gap-5 pb-1 text-xs transition-colors hover:text-muted-foreground"
          >
            {t("shop.home.viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {arrivals.products.length ? (
          <ProductGrid
            products={arrivals.products}
            className="lg:grid-cols-4"
          />
        ) : (
          <p className="border-y border-border py-16 text-sm text-muted-foreground">
            {english
              ? "New pieces are on their way. Check back soon."
              : simplified
                ? "新作品正在准备中，欢迎稍后回来看看。"
                : "新作品正在準備中，歡迎稍後回來看看。"}
          </p>
        )}
      </section>
      {featured.length > 1 && (
        <section className="mt-16 border-t border-border pt-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-medium tracking-tight">
              {t("shop.home.featuredPicks")}
            </h2>
            <Link
              to="/products"
              search={{ featured: true }}
              className="text-xs transition-colors hover:text-muted-foreground"
            >
              {t("shop.home.viewAll")}
            </Link>
          </div>
          <ProductGrid products={featured} className="lg:grid-cols-4" />
        </section>
      )}
    </div>
  );
}
