import { ManagementCard } from '@/components/shared/management-card'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    imageUrl?: string | null
  }
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function CategoryCard({
  category,
  onDelete,
  isDeleting = false,
}: CategoryCardProps) {
  return (
    <ManagementCard
      item={category}
      editRoute="/dashboard/categories/$id"
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteConfirmTitle={`Are you sure you want to delete the category "${category.name}"?`}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={category.imageUrl || '/placeholder.svg'}
          alt={category.name}
          width={400}
          height={400}
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium">{category.name}</h3>
      </div>
    </ManagementCard>
  )
}
