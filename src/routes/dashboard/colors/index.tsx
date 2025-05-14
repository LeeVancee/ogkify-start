import { getColors } from '@/server/colors.server'
import { ColorList } from '@/components/dashboard/color/color-list'
import Loading from '@/components/loading'

export const Route = createFileRoute({
  pendingComponent: Loading,
  pendingMs: 0,
  component: RouteComponent,
  loader: async () => {
    const colors = await getColors()
    return { colors }
  },
})

function RouteComponent() {
  const { colors } = Route.useLoaderData()
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Colors</h1>
      </div>
      <div className="grid gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Colors List</h2>
          <ColorList initialColors={colors} />
        </div>
      </div>
    </div>
  )
}
