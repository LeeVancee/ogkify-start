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
      <Card className="overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-200 border border-border shadow-sm bg-white">
        <div className="relative">{children}</div>

        {/* Fixed bottom action bar */}
        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 bg-muted/30">
          <Link
            to={editRoute}
            params={{ id: item.id }}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Edit className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
