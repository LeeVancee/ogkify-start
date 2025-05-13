import { ColorEditForm } from '@/components/dashboard/color/color-edit-form'
import { getColor } from '@/server/colors.server'
import { notFound } from '@tanstack/react-router'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params }: { params: { id: string } }) => {
    const response = await getColor({ data: params.id })
    return { response }
  },
})

function RouteComponent() {
  const { response } = Route.useLoaderData()
  if (!response.success || !response.color) {
    notFound()
  }
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Color</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Color Details</h2>
            <ColorEditForm color={response.color!} />
          </div>
        </div>
      </div>
    </div>
  )
}
