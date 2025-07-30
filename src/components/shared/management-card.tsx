import { useState } from 'react'
import type { ReactNode } from 'react'
import { Edit, Loader2, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { DeleteDialog } from '../dashboard/delete-dialog'
import { Button } from '../ui/button'

interface ManagementCardProps<T = any> {
  item: T & { id: string; name: string }
  editRoute: string
  onDelete: (id: string) => void
  isDeleting?: boolean
  children: ReactNode
  deleteConfirmTitle?: string
}

export function ManagementCard<T = any>({
  item,
  editRoute,
  onDelete,
  isDeleting = false,
  children,
  deleteConfirmTitle,
}: ManagementCardProps<T>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const finalDeleteTitle =
    deleteConfirmTitle || `Are you sure you want to delete "${item.name}"?`

  return (
    <>
      <div className="group relative rounded-lg border">
        {children}
        <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="secondary" size="icon" className="h-8 w-8" asChild>
            <Link to={editRoute} params={{ id: item.id }}>
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
          onDelete(item.id)
          setShowDeleteDialog(false)
        }}
        title={finalDeleteTitle}
      />
    </>
  )
}
