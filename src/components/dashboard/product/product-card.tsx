import { Link } from "@tanstack/react-router";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Palette,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  return (
    <Card className="overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
      <div className="aspect-[4/3] w-full overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-700 backdrop-blur-sm border-0 shadow-sm"
          >
            <Package className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm border-0"
            render={
              <Link to={`/dashboard/products/$id`} params={{ id: product.id }}>
                <Eye className="h-4 w-4" />
              </Link>
            }
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm border-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={
                  <Link
                    to={`/dashboard/products/$id`}
                    params={{ id: product.id }}
                    className="flex w-full cursor-pointer items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </Link>
                }
              />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Product title and category */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-base text-gray-900 truncate leading-tight"
                title={product.name}
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                >
                  {product.category.name}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-green-600">
                ￥{product.price}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
          title={product.description}
        >
          {product.description}
        </p>

        {/* Colors and Sizes */}
        <div className="space-y-3">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </div>
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color) => (
                <div key={color.id} className="relative group">
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                </div>
              ))}
              {product.colors.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-xs h-4 px-1.5 bg-gray-100 text-gray-600"
                >
                  +{product.colors.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Package className="w-3.5 h-3.5" />
              <span>Sizes</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.sizes.slice(0, 3).map((size) => (
                <Badge
                  key={size.id}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {size.value}
                </Badge>
              ))}
              {product.sizes.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600"
                >
                  +{product.sizes.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          render={
            <Link to={`/dashboard/products/$id`} params={{ id: product.id }}>
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit Product
            </Link>
          }
        />

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
          render={
            <Link to={`/dashboard/products/$id`} params={{ id: product.id }}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
