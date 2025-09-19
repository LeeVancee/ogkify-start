import { Link } from "@tanstack/react-router";
import { Edit, Eye, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { DeleteDialog } from "../dashboard/delete-dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
      <Card className="overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <div className="relative">
          {children}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm border-0"
              asChild
            >
              <Link to={editRoute} params={{ id: item.id }}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm border-0"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    to={editRoute}
                    params={{ id: item.id }}
                    className="flex w-full cursor-pointer items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit {item.name}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {item.name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
