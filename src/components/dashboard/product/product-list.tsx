import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  AdminTable,
  AdminTableCell,
  AdminTableRow,
  StatusPill,
} from "@/components/dashboard/table/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminQueryKeys } from "@/lib/admin/query-options";
import type { AdminProductListItem } from "@/lib/admin/types";
import { formatPrice } from "@/lib/utils";

interface ProductListProps {
  products: AdminProductListItem[];
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function ProductList({ products, deleteProduct }: ProductListProps) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.categoryName, product.price]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [products, query],
  );

  async function handleDelete(id: string) {
    if (!window.confirm("Delete product?")) return;
    const result = await deleteProduct(id);
    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
    } else {
      window.alert(result.error || "Delete failed");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products..."
          className="h-9 sm:max-w-xs"
        />
        <Button
          render={<Link to="/dashboard/products/new" />}
          className="gap-2 sm:ml-auto"
        >
          <Plus className="size-4" />
          Product
        </Button>
      </div>

      <AdminTable
        columns={[
          "Image",
          "Product",
          "Category",
          "Price",
          "Colors",
          "Sizes",
          "Featured",
          "Archived",
          "Actions",
        ]}
        empty={filtered.length === 0}
        emptyMessage="No matching products."
        minWidth="min-w-[1080px]"
      >
        {filtered.map((product) => (
          <AdminTableRow key={product.id}>
            <AdminTableCell>
              <div className="size-12 overflow-hidden rounded-md bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
            </AdminTableCell>
            <AdminTableCell>
              <div className="max-w-64">
                <div className="truncate font-medium">{product.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {product.imageCount} image
                  {product.imageCount === 1 ? "" : "s"}
                </div>
              </div>
            </AdminTableCell>
            <AdminTableCell>{product.categoryName}</AdminTableCell>
            <AdminTableCell>{formatPrice(product.price)}</AdminTableCell>
            <AdminTableCell>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 5).map((color) => (
                  <span
                    key={color.id}
                    className="size-4 rounded-full border"
                    title={color.name}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </AdminTableCell>
            <AdminTableCell>
              <span className="text-muted-foreground">
                {product.sizes
                  .map((size) => size.value ?? size.name)
                  .join(", ") || "-"}
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <StatusPill tone={product.isFeatured ? "success" : "neutral"}>
                {product.isFeatured ? "Yes" : "No"}
              </StatusPill>
            </AdminTableCell>
            <AdminTableCell>
              <StatusPill tone={product.isArchived ? "warning" : "neutral"}>
                {product.isArchived ? "Yes" : "No"}
              </StatusPill>
            </AdminTableCell>
            <AdminTableCell className="w-28">
              <div className="flex justify-end gap-2">
                <Button
                  render={
                    <Link
                      to="/dashboard/products/$id"
                      params={{ id: product.id }}
                    />
                  }
                  variant="ghost"
                  size="icon-sm"
                >
                  <Edit3 className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => handleDelete(product.id)}
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
