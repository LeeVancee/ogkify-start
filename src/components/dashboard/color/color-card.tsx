import { ManagementCard } from '@/components/shared/management-card'

interface ColorCardProps {
  color: {
    id: string
    name: string
    value: string
  }
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function ColorCard({
  color,
  onDelete,
  isDeleting = false,
}: ColorCardProps) {
  return (
    <ManagementCard
      item={color}
      editRoute="/dashboard/colors/$id"
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteConfirmTitle={`Are you sure you want to delete the color "${color.name}"?`}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="h-20 w-20 rounded-md border"
            style={{ backgroundColor: color.value }}
          />
        </div>
        <div>
          <h3 className="font-medium">{color.name}</h3>
          <p className="text-sm text-muted-foreground">{color.value}</p>
        </div>
      </div>
    </ManagementCard>
  )
}
