import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import ProductCard from "@/components/shop/product/product-card";
import { ShopSearchPending } from "@/components/shop/shop-pending";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  shopCategoriesQueryOptions,
  shopSearchResultsQueryOptions,
} from "@/lib/shop/query-options";

export const Route = createFileRoute("/(shop)/search")({
  validateSearch: z.object({ q: z.string().trim().max(200).optional() }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ context, deps }) => {
    void context.queryClient.prefetchQuery(shopCategoriesQueryOptions());
    if (deps.q)
      void context.queryClient.prefetchQuery(
        shopSearchResultsQueryOptions(deps.q),
      );
  },
  component: SearchPage,
});
function SearchPage() {
  const { q = "" } = Route.useSearch();
  return <SearchContent key={q} query={q} />;
}
function SearchContent({ query }: { query: string }) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [input, setInput] = useState(query);
  const { data: categories } = useSuspenseQuery(shopCategoriesQueryOptions());
  return (
    <div className="shop-shell pb-10 pt-14 sm:pt-20">
      <p className="mb-4 text-[10px] tracking-[0.16em] text-muted-foreground">
        FIND YOUR NEXT FAVOURITE
      </p>
      <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
        {locale === "en"
          ? "What catches your eye?"
          : locale === "zh-CN"
            ? "在找哪一件喜欢？"
            : "在找哪一件喜歡？"}
      </h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void router.navigate({
            to: "/search",
            search: { q: input.trim() || undefined },
          });
        }}
        className="mt-9 flex items-center gap-3 border-b border-foreground pb-3"
      >
        <Search
          className="size-5 shrink-0 text-muted-foreground"
          strokeWidth={1.5}
        />
        <Input
          autoFocus
          name="q"
          type="search"
          maxLength={200}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("shop.searchPage.placeholder")}
          aria-label={t("shop.searchPage.placeholder")}
          className="h-12 min-w-0 flex-1 border-0 bg-transparent text-base! shadow-none focus-visible:ring-0"
        />
        {input && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("shop.searchPage.clear")}
            onClick={() => {
              setInput("");
              void router.navigate({ to: "/search", search: {} });
            }}
          >
            <X className="size-4" />
          </Button>
        )}
        <Button
          type="submit"
          aria-label={t("shop.header.search")}
          className="h-11 gap-6 px-5"
        >
          <span className="hidden sm:block">{t("shop.header.search")}</span>
          <ArrowRight className="size-4" />
        </Button>
      </form>
      {!query ? (
        <div className="mt-10">
          <p className="mb-5 text-xs text-muted-foreground">
            {t("shop.home.shopByCategory")}
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                search={{ category: category.name }}
                className="flex items-center gap-6 border border-border px-5 py-3 text-sm transition-colors hover:border-foreground"
              >
                {category.name}
                <ArrowRight className="size-3" />
              </Link>
            ))}
          </div>
          <p className="py-24 text-sm text-muted-foreground">
            {t("shop.searchPage.emptyPrompt")}
          </p>
        </div>
      ) : (
        <SearchResults query={query} />
      )}
    </div>
  );
}
function SearchResults({ query }: { query: string }) {
  const { t } = useI18n();
  const {
    data: products,
    error,
    isError,
    isPending,
  } = useQuery(shopSearchResultsQueryOptions(query));
  if (isPending) return <ShopSearchPending />;
  if (isError) throw error;
  return (
    <section className="pt-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg">
          {t("shop.searchPage.resultsFor")} “{query}”
        </h2>
        <p className="text-xs text-muted-foreground">
          {t(
            products.length === 1
              ? "shop.searchPage.productCount_one"
              : "shop.searchPage.productCount_other",
            { count: products.length },
          )}
        </p>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-y border-border py-20">
          <p className="text-xl">{t("shop.searchPage.noResults", { query })}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("shop.searchPage.noResultsHint")}
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-6 text-sm transition-colors hover:text-muted-foreground"
          >
            {t("shop.home.shopAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
