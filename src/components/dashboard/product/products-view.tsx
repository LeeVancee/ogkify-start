import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Grid, List, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProduct, getProducts } from "@/server/products";

import { DeleteDialog } from "../delete-dialog";
import { EmptyState } from "../empty-state";
import { ProductGridView } from "./product-grid-view";
import { ProductTableView } from "./product-table-view";

export function ProductsView() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"table" | "grid">("table");

  // Use TanStack Query to get product data
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct({ data: id }),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const productToDeleteData = productToDelete
    ? products.find((p) => p.id === productToDelete)
    : null;

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load products"
        description="There was an error loading the products. Please try again."
        tone="destructive"
        action={
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["products"] })
            }
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="h-8 pl-8 pr-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 size-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
          <div className="text-xs text-muted-foreground">
            Showing {filteredProducts.length} of {products.length}
          </div>
          <Tabs
            defaultValue={viewType}
            onValueChange={(value) => setViewType(value as "table" | "grid")}
          >
            <TabsList>
              <TabsTrigger value="table" className="h-7 text-xs">
                <List className="mr-2 h-4 w-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" className="h-7 text-xs">
                <Grid className="mr-2 h-4 w-4" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            searchQuery
              ? "No products match your search criteria. Try a different term or clear the search."
              : "You have not added any products yet. Create the first product to start building the catalog."
          }
          action={
            searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            ) : (
              <Link
                to="/dashboard/products/new"
                className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            )
          }
        />
      ) : viewType === "table" ? (
        <ProductTableView
          products={filteredProducts}
          onDelete={handleDeleteClick}
          isDeleting={deleteMutation.isPending}
        />
      ) : (
        <ProductGridView
          products={filteredProducts}
          onDelete={handleDeleteClick}
          isDeleting={deleteMutation.isPending}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={
          productToDeleteData
            ? `Are you sure you want to delete "${productToDeleteData.name}"?`
            : "Are you sure you want to delete this product?"
        }
      />
    </div>
  );
}
