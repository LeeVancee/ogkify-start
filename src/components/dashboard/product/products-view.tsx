import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Grid, List, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProduct, getProducts } from "@/server/products.server";
import { DeleteDialog } from "../delete-dialog";
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
      <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold text-red-500">
            Failed to load products
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            There was an error loading the products. Please try again.
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["products"] })
            }
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue={viewType}
            onValueChange={(value) => setViewType(value as "table" | "grid")}
          >
            <TabsList>
              <TabsTrigger value="table">
                <List className="mr-2 h-4 w-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid">
                <Grid className="mr-2 h-4 w-4" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "No products match your search criteria. Please try using different search terms."
                : "You have not added any products yet. Click the button below to add a product."}
            </p>
            {!searchQuery && (
              <Link
                to="/dashboard/products/new"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            )}
          </div>
        </div>
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
