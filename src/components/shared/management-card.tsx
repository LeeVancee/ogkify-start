import { Link } from "@tanstack/react-router";
import { Edit, Loader2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { DeleteDialog } from "../dashboard/delete-dialog";
import { Button, buttonVariants } from "../ui/button";
import { Card } from "../ui/card";

interface ManagementCardProps<T = any> {
  item: T & { id: string; name: string };
  editRoute: string;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  children: ReactNode;
  deleteConfirmTitle?: string;
}

export function ManagementCard<T = any>({
  item,
  editRoute,
  onDelete,
  isDeleting = false,
  children,
  deleteConfirmTitle,
}: ManagementCardProps<T>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const finalDeleteTitle =
    deleteConfirmTitle || `Are you sure you want to delete "${item.name}"?`;

  return (
    <>
      <Card className="group overflow-hidden rounded-lg border bg-card shadow-none transition-colors hover:bg-muted/20">
        <div className="relative">{children}</div>

        <div className="flex items-center justify-between gap-2 border-t bg-muted/30 px-4 py-2.5">
          <Link
            to={editRoute}
            params={{ id: item.id }}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Edit className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Delete
          </Button>
        </div>
      </Card>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDelete(item.id);
          setShowDeleteDialog(false);
        }}
        title={finalDeleteTitle}
      />
    </>
  );
}
