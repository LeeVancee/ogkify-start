import { notFound, createFileRoute } from '@tanstack/react-router'
import { getCategory } from '@/server/categories.server'
import { CategoryEditForm } from '@/components/dashboard/category/category-edit-form'

export const Route = createFileRoute('/dashboard/categories/$id')({
  component: RouteComponent,
  loader: async ({ params }: { params: { id: string } }) => {
    const response = await getCategory({ data: params.id })
    return { response }
  },
})

function RouteComponent() {
  const { response } = Route.useLoaderData()

  if (!response.success || !response.category) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Category Details</h2>
            <CategoryEditForm category={response.category!} />
          </div>
        </div>
      </div>
    </div>
  )
}
