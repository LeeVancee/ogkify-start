import { useState } from 'react'
import { Edit, Trash2, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { DeleteDialog } from '../delete-dialog'
import { Button } from '@/components/ui/button'

interface ColorCardProps {
  color: {
    id: string
    name: string
    value: string
  }
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function ColorCard({ color, onDelete, isDeleting = false }: ColorCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <div className="group relative rounded-lg border p-4">
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
        <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="secondary" size="icon" className="h-8 w-8" asChild>
            <Link to="/dashboard/colors/$id" params={{ id: color.id }}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDelete(color.id)
          setShowDeleteDialog(false)
        }}
        title={`Are you sure you want to delete the color "${color.name}"?`}
      />
    </>
  )
}
