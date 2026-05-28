import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  AdminTable,
  AdminTableCell,
  AdminTableRow,
} from "@/components/dashboard/table/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminQueryKeys } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";

interface ResourceItem {
  id: string;
  name: string;
  value?: string | null;
  imageUrl?: string | null;
}

interface ResourceListProps {
  title: string;
  items: ResourceItem[];
  newHref: string;
  editHref: string;
  accent?: "color" | "image" | "text";
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function ResourceList({
  title,
  items,
  newHref,
  editHref,
  accent = "text",
  onDelete,
}: ResourceListProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        [item.name, item.value ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );

  async function handleDelete(id: string) {
    const ok = window.confirm(t("dashboard.resources.deleteResourceConfirm"));
    if (!ok) return;

    const result = await onDelete(id);
    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
    } else {
      window.alert(
        result.error || t("dashboard.resources.productDeleteFailed"),
      );
    }
  }

  const columns =
    accent === "image"
      ? [
          t("dashboard.table.image"),
          t("dashboard.table.name"),
          t("dashboard.table.value"),
          t("dashboard.table.actions"),
        ]
      : accent === "color"
        ? [
            t("dashboard.table.swatch"),
            t("dashboard.table.name"),
            t("dashboard.table.value"),
            t("dashboard.table.actions"),
          ]
        : [
            t("dashboard.table.name"),
            t("dashboard.table.value"),
            t("dashboard.table.actions"),
          ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("dashboard.resources.searchResource", {
            resource: title.toLowerCase(),
          })}
          className="h-10 border-border/70 bg-background sm:max-w-xs"
        />
        <Button render={<Link to={newHref} />} className="gap-2 sm:ml-auto">
          <Plus className="size-4" />
          {t("dashboard.resources.new")}
        </Button>
      </div>

      <AdminTable
        columns={columns}
        empty={filtered.length === 0}
        emptyMessage={t("dashboard.resources.noMatchingRecords")}
        minWidth={accent === "text" ? "min-w-[640px]" : "min-w-[760px]"}
      >
        {filtered.map((item) => (
          <AdminTableRow key={item.id}>
            {accent === "image" ? (
              <AdminTableCell>
                <ResourceImage item={item} />
              </AdminTableCell>
            ) : null}
            {accent === "color" ? (
              <AdminTableCell>
                <ResourceSwatch item={item} />
              </AdminTableCell>
            ) : null}
            <AdminTableCell>
              <div className="font-medium">{item.name}</div>
            </AdminTableCell>
            <AdminTableCell>
              <span className="text-muted-foreground">{item.value || "-"}</span>
            </AdminTableCell>
            <AdminTableCell className="w-28">
              <div className="flex justify-end gap-2">
                <Button
                  render={<Link to={editHref} params={{ id: item.id }} />}
                  variant="ghost"
                  size="icon-sm"
                >
                  <Edit3 className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}

function ResourceImage({ item }: { item: ResourceItem }) {
  return (
    <div className="size-11 overflow-hidden rounded-xl border border-border/60 bg-muted/50">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-xs font-semibold text-muted-foreground">
          {item.name.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  );
}

function ResourceSwatch({ item }: { item: ResourceItem }) {
  return (
    <div
      className="size-7 rounded-md border"
      style={{ backgroundColor: item.value ?? "transparent" }}
    />
  );
}
