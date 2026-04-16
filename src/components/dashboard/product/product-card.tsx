import { Link } from "@tanstack/react-router";
import { Edit, Palette, Package, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { DeleteDialog } from "../delete-dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: { id: string; name: string };
  colors: Array<{ id: string; name: string; value: string }>;
  sizes: Array<{ id: string; name: string; value: string }>;
  images: Array<string>;
}

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-200 border border-border shadow-sm bg-white">
        <div className="aspect-4/3 w-full overflow-hidden relative bg-muted/30">
          <img
            src={getRequiredProductCardImage(product.images[0], product.id)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <div className="absolute bottom-2.5 right-2.5">
            <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm ring-1 ring-border">
              ￥{product.price}
            </span>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3
              className="font-semibold text-sm text-foreground truncate leading-tight"
              title={product.name}
            >
              {product.name}
            </h3>
            <Badge
              variant="outline"
              className="mt-1 text-xs bg-primary/5 text-primary border-primary/20"
            >
              {product.category.name}
            </Badge>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex items-center gap-1">
                  {product.colors.slice(0, 4).map((color) => (
                    <div
                      key={color.id}
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{product.colors.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex items-center gap-1 flex-wrap">
                  {product.sizes.slice(0, 3).map((size) => (
                    <Badge
                      key={size.id}
                      variant="outline"
                      className="text-xs px-1.5 py-0 h-5 bg-muted/50"
                    >
                      {size.value}
                    </Badge>
                  ))}
                  {product.sizes.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{product.sizes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 bg-muted/30">
          <Link
            to="/dashboard/products/$id"
            params={{ id: product.id }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7 px-2"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDelete(product.id);
          setShowDeleteDialog(false);
        }}
        title={`Are you sure you want to delete "${product.name}"?`}
      />
    </>
  );
}

function getRequiredProductCardImage(
  imageUrl: string | undefined,
  productId: string,
) {
  if (!imageUrl) {
    throw new Error(`Primary image is required for product ${productId}`);
  }

  return imageUrl;
}
