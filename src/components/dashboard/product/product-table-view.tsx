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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden lg:table-cell">Color</TableHead>
            <TableHead className="hidden lg:table-cell">Size</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="h-12 w-12 overflow-hidden rounded-md border">
                  <img
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{product.name}</div>
                <div className="hidden text-sm text-muted-foreground sm:block">
                  {truncateText(product.description, 50)}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.category.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                ￥{product.price}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color.id}
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <Badge key={size.id} variant="outline" className="text-xs">
                      {size.value}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link
                      to={`/dashboard/products/$id`}
                      params={{ id: product.id }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
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
