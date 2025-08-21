import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteCategory, getCategories } from '@/server/categories.server'
import { CategoryCard } from './category-card'

type Category = {
  id: string
  name: string
  imageUrl?: string | null
}

export function CategoryList() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  // Use TanStack Query to get category data
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory({ data: id }),
    onSuccess: () => {
      toast.success('Category deleted successfully')
      // Auto refresh data
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      toast.error('Failed to delete category')
    },
  })

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.imageUrl?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  // Handle loading state
  if (isLoading) {
    return <Loading />
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold text-red-500">
            Failed to load categories
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            There was an error loading the categories. Please try again.
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['categories'] })
            }
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button asChild>
          <Link to="/dashboard/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? 'No categories match your search criteria. Please try using different search terms.'
                : 'You have not added any categories yet. Click the button above to add a category.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
