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
        <div className="shop-shell flex flex-col items-center gap-10 py-20 sm:py-28 lg:flex-row lg:gap-20 lg:py-36">
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Ogkify Essentials
            </p>
            <h1 className="text-5xl font-light leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Style for
              <br />
              Everyday Living
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0">
              Explore curated pieces with clean design, easy comfort, and
              versatile details made for daily rotation.
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
    <div className="shop-shell py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex flex-col items-center gap-3">
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="h-10 w-48" />
        </div>
        <SkeletonBlock className="mt-8 h-14 w-full rounded-2xl" />
      </div>

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
    </div>
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
