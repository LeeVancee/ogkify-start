import { Skeleton } from "@/components/ui/skeleton";

export function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="mb-3 aspect-3/4 w-full rounded-md" />
          <Skeleton className="mb-1 h-3 w-1/3 rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="mt-1 h-4 w-1/4 rounded-md" />
        </div>
      ))}
    </div>
  );
}
