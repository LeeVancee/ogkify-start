function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
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
