import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
  );
}

export function ShopHomePending() {
  return (
    <>
      <section className="bg-white">
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
                className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-9 text-base font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                View New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-12 flex flex-col items-center gap-3">
            <SkeletonBlock className="h-3 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-64" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="aspect-square" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="shop-shell py-20 sm:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-24 rounded-full" />
              <SkeletonBlock className="h-10 w-56" />
            </div>
            <SkeletonBlock className="h-5 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <SkeletonBlock className="aspect-3/4 w-full" />
                <SkeletonBlock className="h-4 w-3/4 rounded-full" />
                <SkeletonBlock className="h-4 w-1/3 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ShopSearchPending() {
  return (
    <>
      <div className="mt-10 mb-6 flex items-end justify-between border-b border-slate-100 pb-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-52 rounded-full" />
          <SkeletonBlock className="h-4 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <SkeletonBlock className="aspect-3/4 w-full" />
            <SkeletonBlock className="h-4 w-3/4 rounded-full" />
            <SkeletonBlock className="h-4 w-1/3 rounded-full" />
          </div>
        ))}
      </div>
    </>
  );
}

export function ShopProfilePending() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <SkeletonBlock className="mb-8 h-10 w-48" />
      <div className="mb-8 flex gap-3">
        <SkeletonBlock className="h-10 w-32 rounded-xl" />
        <SkeletonBlock className="h-10 w-32 rounded-xl" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 space-y-3">
          <SkeletonBlock className="h-7 w-56" />
          <SkeletonBlock className="h-4 w-72 rounded-full" />
        </div>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <SkeletonBlock className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-4 w-32 rounded-full" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
            </div>
          </div>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <SkeletonBlock className="h-4 w-24 rounded-full" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
              <SkeletonBlock className="h-4 w-64 rounded-full" />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
