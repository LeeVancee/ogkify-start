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
import { deleteSize, getSizes } from "@/server/sizes";

import { ResourceList } from "../resource-list";

export function SizeList() {
  const { t } = useI18n();

  return (
    <ResourceList
      layout="table"
      queryKey={["sizes"]}
      queryFn={() => getSizes()}
      deleteFn={(id) => deleteSize({ data: id })}
      searchPlaceholder={t("dashboard.resources.searchSizes")}
      addHref="/dashboard/sizes/new"
      addLabel={t("dashboard.actions.addSize")}
      emptyTitle={t("dashboard.resources.noSizes")}
      emptyDescription={t("dashboard.resources.noSizesDescription")}
      errorTitle={t("dashboard.resources.loadSizesFailed")}
      errorDescription={t("dashboard.resources.loadSizesError")}
      matchesSearch={(size, query) =>
        !query ||
        size.name.toLowerCase().includes(query) ||
        size.value.toLowerCase().includes(query)
      }
      getItemId={(size) => size.id}
      getDeleteSuccessMessage={() => t("dashboard.resources.sizeDeleted")}
      getDeleteErrorMessage={() => t("dashboard.resources.sizeDeleteFailed")}
      renderCard={() => null}
      renderTable={(sizes, isDeleting, onDelete) => (
        <DataTableShell>
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[160px]">
                  {t("dashboard.table.displayValue")}
                </TableHead>
                <TableHead>{t("dashboard.table.name")}</TableHead>
                <TableHead>{t("dashboard.table.value")}</TableHead>
                <TableHead className="w-[180px] text-right">
                  {t("dashboard.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((size) => (
                <TableRow key={size.id} className="h-16">
                  <TableCell>
                    <span className="inline-flex min-w-16 items-center justify-center rounded-lg border bg-muted/30 px-3 py-1.5 font-semibold tracking-wide text-foreground">
                      {size.value}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/dashboard/sizes/$id"
                      params={{ id: size.id }}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {size.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {t("dashboard.resources.productSizeOption")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-mono text-xs uppercase"
                    >
                      {size.value}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/dashboard/sizes/$id"
                        params={{ id: size.id }}
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
                        onClick={() => onDelete(size.id)}
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
