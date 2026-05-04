function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
  );
}

export function ShopHomePending() {
  return (
    <>
      <section className="bg-white">
        <div className="shop-shell flex flex-col gap-10 py-20 sm:py-28 lg:flex-row lg:gap-20 lg:py-36">
          <div className="flex-1 space-y-5">
            <SkeletonBlock className="h-3 w-28 rounded-full" />
            <SkeletonBlock className="h-16 w-full max-w-xl" />
            <SkeletonBlock className="h-16 w-4/5 max-w-lg" />
            <SkeletonBlock className="h-5 w-full max-w-md rounded-full" />
            <SkeletonBlock className="h-5 w-5/6 max-w-sm rounded-full" />
            <SkeletonBlock className="mt-8 h-12 w-44" />
          </div>
          <SkeletonBlock className="aspect-[4/3] w-full max-w-lg" />
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

export function ShopProductsPending() {
  return (
    <div className="shop-shell py-10 sm:py-14">
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="h-10 w-52" />
        </div>
        <SkeletonBlock className="hidden h-11 w-[180px] rounded-full sm:block" />
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-52 shrink-0 space-y-4 sm:block">
          <SkeletonBlock className="h-5 w-24 rounded-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full rounded-xl" />
          ))}
        </aside>

        <div className="flex-1">
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
      </div>
    </div>
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
