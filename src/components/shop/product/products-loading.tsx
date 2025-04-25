import { Skeleton } from '@/components/ui/skeleton'

export function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
