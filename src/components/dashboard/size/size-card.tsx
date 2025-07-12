import { ManagementCard } from '@/components/shared/management-card'

interface SizeCardProps {
  size: {
    id: string
    name: string
    value: string
  }
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function SizeCard({
  size,
  onDelete,
  isDeleting = false,
}: SizeCardProps) {
  return (
    <ManagementCard
      item={size}
      editRoute="/dashboard/sizes/$id"
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteConfirmTitle={`Are you sure you want to delete the size "${size.name}"?`}
    >
      <div className="p-6">
        <div className="mb-2 text-2xl font-semibold">{size.value}</div>
        <div>
          <h3 className="font-medium">{size.name}</h3>
        </div>
      </div>
    </ManagementCard>
  )
}
