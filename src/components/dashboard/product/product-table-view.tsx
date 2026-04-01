import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "./product-types";
import { truncateText } from "./product-types";

interface ProductTableViewProps {
  products: Array<Product>;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ProductTableView({
  products,
  onDelete,
  isDeleting,
}: ProductTableViewProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold text-foreground">Image</TableHead>
            <TableHead className="font-semibold text-foreground">Name</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-foreground">Category</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-foreground">Price</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-foreground">Colors</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-foreground">Sizes</TableHead>
            <TableHead className="w-[120px] font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-border">
                  <img
                    src={getRequiredProductTableImage(
                      product.images[0]?.url,
                      product.id,
                    )}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm text-foreground">
                  {product.name}
                </div>
                <div className="hidden text-xs text-muted-foreground sm:block mt-0.5">
                  {truncateText(product.description, 50)}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  variant="outline"
                  className="text-xs bg-primary/5 text-primary border-primary/20"
                >
                  {product.category.name}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="font-semibold text-sm text-foreground">
                  ￥{product.price}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color.id}
                      className="h-4 w-4 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <Badge
                      key={size.id}
                      variant="outline"
                      className="text-xs bg-muted/50"
                    >
                      {size.value}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Link
                    to="/dashboard/products/$id"
                    params={{ id: product.id }}
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getRequiredProductTableImage(
  imageUrl: string | undefined,
  productId: string,
) {
  if (!imageUrl) {
    throw new Error(`Primary image is required for product ${productId}`);
  }

  return imageUrl;
}
