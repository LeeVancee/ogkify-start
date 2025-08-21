import { Link } from '@tanstack/react-router'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: { id: string; name: string }
  colors: Array<{ id: string; name: string; value: string }>
  sizes: Array<{ id: string; name: string; value: string }>
  images: Array<string>
}

interface ProductCardProps {
  product: Product
  onDelete: (productId: string) => void
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 shadow-sm"
              >
                <MoreHorizontal className="h-3 w-3" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to={`/dashboard/products/$id`}
                  params={{ id: product.id }}
                  className="flex w-full cursor-pointer items-center"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate" title={product.name}>
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {product.category.name}
            </p>
          </div>
          <div className="text-right ml-2">
            <div className="font-semibold text-sm text-primary">
              ￥{product.price}
            </div>
          </div>
        </div>

        <p
          className="text-xs text-muted-foreground line-clamp-1 mb-3"
          title={product.description}
        >
          {product.description}
        </p>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Color:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color.id}
                  className="h-3 w-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-muted-foreground">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Size:</span>
            <div className="flex gap-1">
              {product.sizes.slice(0, 2).map((size) => (
                <Badge
                  key={size.id}
                  variant="outline"
                  className="text-xs px-1 py-0 h-4"
                >
                  {size.value}
                </Badge>
              ))}
              {product.sizes.length > 2 && (
                <span className="text-muted-foreground">
                  +{product.sizes.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs"
          asChild
        >
          <Link to={`/dashboard/products/$id`} params={{ id: product.id }}>
            <Edit className="mr-1 h-3 w-3" />
            Edit Product
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
