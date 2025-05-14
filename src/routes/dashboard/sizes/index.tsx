import { SizeList } from '@/components/dashboard/size/size-list'
import { getSizes } from '@/server/sizes.server'
import Loading from '@/components/loading'

export const Route = createFileRoute({
  pendingComponent: Loading,
  pendingMs: 0,
  component: RouteComponent,
  loader: async () => {
    const sizes = await getSizes()
    return { sizes }
  },
})

function RouteComponent() {
  const { sizes } = Route.useLoaderData()
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sizes</h1>
      </div>
      <div className="grid gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Sizes List</h2>
          <SizeList initialSizes={sizes} />
        </div>
      </div>
    </div>
  )
}
