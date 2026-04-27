import { Link } from "@tanstack/react-router";
import { Edit, Loader2, Trash2 } from "lucide-react";

import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteColor, getColors } from "@/server/colors";

import { ResourceList } from "../resource-list";

export function ColorList() {
  return (
    <ResourceList
      layout="table"
      queryKey={["colors"]}
      queryFn={() => getColors()}
      deleteFn={(id) => deleteColor({ data: id })}
      searchPlaceholder="Search for colors..."
      addHref="/dashboard/colors/new"
      addLabel="Add Color"
      emptyTitle="No colors found"
      emptyDescription="No colors match your search criteria or you have not added any colors yet."
      errorTitle="Failed to load colors"
      errorDescription="There was an error loading the colors. Please try again."
      matchesSearch={(color, query) =>
        !query ||
        color.name.toLowerCase().includes(query) ||
        color.value.toLowerCase().includes(query)
      }
      getItemId={(color) => color.id}
      getDeleteSuccessMessage={() => "Color deleted successfully"}
      getDeleteErrorMessage={() => "Failed to delete color"}
      renderCard={() => null}
      renderTable={(colors, isDeleting, onDelete) => (
        <DataTableShell>
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[76px]">Swatch</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colors.map((color) => (
                <TableRow key={color.id} className="h-16">
                  <TableCell>
                    <div
                      className="h-9 w-9 rounded-lg border shadow-sm ring-1 ring-border/60"
                      style={{ backgroundColor: color.value }}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/dashboard/colors/$id"
                      params={{ id: color.id }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {color.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Product color option
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-xs uppercase"
                    >
                      {color.value}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/dashboard/colors/$id"
                        params={{ id: color.id }}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        })}
                      >
                        <Edit className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(color.id)}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableShell>
      )}
    />
  );
}
