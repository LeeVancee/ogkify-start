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
import { useI18n } from "@/lib/i18n";
import { deleteCategory, getCategories } from "@/server/categories";

import { ResourceList } from "../resource-list";

export function CategoryList() {
  const { t } = useI18n();

  return (
    <ResourceList
      layout="table"
      queryKey={["categories"]}
      queryFn={() => getCategories()}
      deleteFn={(id) => deleteCategory({ data: id })}
      searchPlaceholder={t("dashboard.resources.searchCategories")}
      addHref="/dashboard/categories/new"
      addLabel={t("dashboard.actions.addCategory")}
      emptyTitle={t("dashboard.resources.noCategories")}
      emptyDescription={t("dashboard.resources.noCategoriesDescription")}
      errorTitle={t("dashboard.resources.loadCategoriesFailed")}
      errorDescription={t("dashboard.resources.loadCategoriesError")}
      matchesSearch={(category, query) =>
        !query ||
        category.name.toLowerCase().includes(query) ||
        !!category.imageUrl?.toLowerCase().includes(query)
      }
      getItemId={(category) => category.id}
      getDeleteSuccessMessage={() => t("dashboard.resources.categoryDeleted")}
      getDeleteErrorMessage={() =>
        t("dashboard.resources.categoryDeleteFailed")
      }
      renderCard={() => null}
      renderTable={(categories, isDeleting, onDelete) => (
        <DataTableShell>
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[76px]">
                  {t("dashboard.table.image")}
                </TableHead>
                <TableHead>{t("dashboard.table.name")}</TableHead>
                <TableHead>{t("dashboard.table.imageStatus")}</TableHead>
                <TableHead className="w-[180px] text-right">
                  {t("dashboard.table.actions")}
                </TableHead>
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
                      {t("dashboard.resources.catalogCategory")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.imageUrl ? (
                      <Badge variant="outline" className="gap-1.5">
                        <Image className="h-3.5 w-3.5" />
                        {t("dashboard.resources.imageSet")}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1.5">
                        <ImageOff className="h-3.5 w-3.5" />
                        {t("dashboard.resources.noImage")}
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
                        {t("dashboard.actions.edit")}
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
                        {t("dashboard.actions.delete")}
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
