import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Search, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ColorCard } from './color-card'
import { deleteColor, getColors } from '@/server/colors.server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'

type Color = {
  id: string
  name: string
  value: string
}

export function ColorList() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  // Use TanStack Query to get color data
  const { 
    data: colors = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['colors'],
    queryFn: () => getColors(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  // Delete color mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteColor({ data: id }),
    onSuccess: () => {
      toast.success('Color deleted successfully')
      // Auto refresh data
      queryClient.invalidateQueries({ queryKey: ['colors'] })
    },
    onError: (error) => {
      toast.error('Failed to delete color')
    },
  })

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      color.value.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <h3 className="mt-4 text-lg font-semibold text-red-500">Failed to load colors</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            There was an error loading the colors. Please try again.
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['colors'] })}
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
            placeholder="Search for colors..."
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
          <Link to="/dashboard/colors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Color
          </Link>
        </Button>
      </div>

      {filteredColors.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No colors found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? 'No colors match your search criteria. Please try using different search terms.'
                : 'You have not added any colors yet. Click the button above to add a color.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredColors.map((color) => (
            <ColorCard 
              key={color.id} 
              color={color} 
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
