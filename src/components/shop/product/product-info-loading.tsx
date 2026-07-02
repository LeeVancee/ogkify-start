import { Skeleton } from "@/components/ui/skeleton";

export function ProductInfoLoading() {
  return (
    <div className="shop-shell py-8 sm:py-12" aria-busy="true" aria-label="Loading product">
      <Skeleton className="mb-8 h-5 w-32 rounded-md" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col">
          <Skeleton className="mb-2 h-3 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full max-w-md rounded-md" />
            <Skeleton className="h-8 w-4/5 max-w-sm rounded-md" />
          </div>
          <Skeleton className="mt-3 h-7 w-24 rounded-md" />

          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full max-w-lg rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm rounded-md" />
          </div>

          <div className="mt-6">
            <Skeleton className="mb-3 h-3 w-10 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 w-20 rounded-lg" />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-4 w-8 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-11 flex-1 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex gap-6 border-b border-border">
          <Skeleton className="h-9 w-16 rounded-none" />
          <Skeleton className="h-9 w-14 rounded-none" />
        </div>
        <div className="space-y-2 pt-5">
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="h-4 w-2/3 max-w-md rounded-md" />
        </div>
      </div>
    </div>
  );
}
