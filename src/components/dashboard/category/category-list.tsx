import { Link } from "@tanstack/react-router";
import { Edit, Image, ImageOff, Loader2, Trash2 } from "lucide-react";

import { DataTableShell } from "@/components/dashboard/data-table-shell";
import { ImagePlaceholder } from "@/components/dashboard/image-placeholder";
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
import { deleteCategory, getCategories } from "@/server/categories";

import { ResourceList } from "../resource-list";

export function CategoryList() {
  return (
    <ResourceList
      layout="table"
      queryKey={["categories"]}
      queryFn={() => getCategories()}
      deleteFn={(id) => deleteCategory({ data: id })}
      searchPlaceholder="Search for categories..."
      addHref="/dashboard/categories/new"
      addLabel="Add Category"
      emptyTitle="No categories found"
      emptyDescription="No categories match your search criteria or you have not added any categories yet."
      errorTitle="Failed to load categories"
      errorDescription="There was an error loading the categories. Please try again."
      matchesSearch={(category, query) =>
        !query ||
        category.name.toLowerCase().includes(query) ||
        !!category.imageUrl?.toLowerCase().includes(query)
      }
      getItemId={(category) => category.id}
      getDeleteSuccessMessage={() => "Category deleted successfully"}
      getDeleteErrorMessage={() => "Failed to delete category"}
      renderCard={() => null}
      renderTable={(categories, isDeleting, onDelete) => (
        <DataTableShell>
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[76px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Image Status</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="h-16">
                  <TableCell>
                    <div className="h-11 w-14 overflow-hidden rounded-lg border bg-muted/30">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlaceholder label="" className="bg-muted/40" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/dashboard/categories/$id"
                      params={{ id: category.id }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Catalog category
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.imageUrl ? (
                      <Badge variant="outline" className="gap-1.5">
                        <Image className="h-3.5 w-3.5" />
                        Image set
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1.5">
                        <ImageOff className="h-3.5 w-3.5" />
                        No image
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/dashboard/categories/$id"
                        params={{ id: category.id }}
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
                        onClick={() => onDelete(category.id)}
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
