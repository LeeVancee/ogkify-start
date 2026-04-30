import { Grid, List } from "lucide-react";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProduct, getProducts } from "@/server/products";

import { ResourceList } from "../resource-list";
import { ProductCard } from "./product-card";
import { ProductTableView } from "./product-table-view";

export function ProductsView() {
  const [viewType, setViewType] = useState<"table" | "grid">("table");

  return (
    <ResourceList
      layout={viewType}
      queryKey={["products"]}
      queryFn={() => getProducts()}
      deleteFn={(id) => deleteProduct({ data: id })}
      searchPlaceholder="Search products..."
      addHref="/dashboard/products/new"
      addLabel="Add Product"
      emptyTitle="No products found"
      emptyDescription="You have not added any products yet. Create the first product to start building the catalog."
      errorTitle="Failed to load products"
      errorDescription="There was an error loading the products. Please try again."
      matchesSearch={(product, query) =>
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query)
      }
      getItemId={(product) => product.id}
      getDeleteSuccessMessage={() => "Product deleted successfully"}
      getDeleteErrorMessage={() => "Delete failed"}
      getDeleteDialogTitle={(product) =>
        `Are you sure you want to delete "${product.name}"?`
      }
      renderToolbarEnd={(filteredCount, totalCount) => (
        <>
          <div className="text-xs text-muted-foreground">
            Showing {filteredCount} of {totalCount}
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
        </>
      )}
      renderCard={(product, isDeleting, onDelete) => (
        <ProductCard
          onDelete={onDelete}
          isDeleting={isDeleting}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            colors: product.colors,
            sizes: product.sizes,
            images: product.images.map((image) => image.url),
          }}
        />
      )}
      renderTable={(products, isDeleting, onDelete) => (
        <ProductTableView
          products={products}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      )}
    />
  );
}
