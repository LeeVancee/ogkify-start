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
import { useI18n } from "@/lib/i18n";
import { deleteColor, getColors } from "@/server/colors";

import { ResourceList } from "../resource-list";

export function ColorList() {
  const { t } = useI18n();

  return (
    <ResourceList
      layout="table"
      queryKey={["colors"]}
      queryFn={() => getColors()}
      deleteFn={(id) => deleteColor({ data: id })}
      searchPlaceholder={t("dashboard.resources.searchColors")}
      addHref="/dashboard/colors/new"
      addLabel={t("dashboard.actions.addColor")}
      emptyTitle={t("dashboard.resources.noColors")}
      emptyDescription={t("dashboard.resources.noColorsDescription")}
      errorTitle={t("dashboard.resources.loadColorsFailed")}
      errorDescription={t("dashboard.resources.loadColorsError")}
      matchesSearch={(color, query) =>
        !query ||
        color.name.toLowerCase().includes(query) ||
        color.value.toLowerCase().includes(query)
      }
      getItemId={(color) => color.id}
      getDeleteSuccessMessage={() => t("dashboard.resources.colorDeleted")}
      getDeleteErrorMessage={() => t("dashboard.resources.colorDeleteFailed")}
      renderCard={() => null}
      renderTable={(colors, isDeleting, onDelete) => (
        <DataTableShell>
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[76px]">
                  {t("dashboard.table.swatch")}
                </TableHead>
                <TableHead>{t("dashboard.table.name")}</TableHead>
                <TableHead>{t("dashboard.table.value")}</TableHead>
                <TableHead className="w-[180px] text-right">
                  {t("dashboard.table.actions")}
                </TableHead>
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
                      {t("dashboard.resources.productColorOption")}
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
                        {t("dashboard.actions.edit")}
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
