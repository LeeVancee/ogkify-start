import { Skeleton } from "@/components/ui/skeleton";

export function ProductInfoLoading() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left side image area */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right side product information */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/3" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Color selection */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/5" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/5" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-12 rounded-md" />
              ))}
            </div>
          </div>

          {/* Quantity selection */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-12 sm:flex-1" />
            <Skeleton className="h-12 w-32" />
          </div>

          <Skeleton className="h-5 w-2/5" />
        </div>
      </div>

      {/* Product tabs skeleton */}
      <div className="mt-10">
        <div className="flex space-x-4 border-b">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <div className="py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-3" />
          ))}
        </div>
      </div>
    </div>
  );
}
