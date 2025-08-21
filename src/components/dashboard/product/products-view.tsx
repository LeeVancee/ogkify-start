import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Edit, Grid, List, Plus, Search, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { toast } from 'sonner'
import Loading from '@/components/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { deleteProduct, getProducts } from '@/server/products.server'
import { DeleteDialog } from '../delete-dialog'
import { ProductCard } from './product-card'

// Define product type
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: { id: string; name: string }
  colors: Array<{ id: string; name: string; value: string }>
  sizes: Array<{ id: string; name: string; value: string }>
  images: Array<{ id: string; url: string }>
  isFeatured: boolean
  isArchived: boolean
}

export function ProductsView() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'table' | 'grid'>('table')

  // Use TanStack Query to get product data
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  })

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct({ data: id }),
    onSuccess: () => {
      toast.success('Product deleted successfully')
      // Auto refresh data
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      toast.error('Delete failed')
    },
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!productToDelete) return
    deleteMutation.mutate(productToDelete)
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const productToDeleteData = productToDelete
    ? products.find((p) => p.id === productToDelete)
    : null

  // Handle loading state
  if (isLoading) {
    return <Loading />
  }

  // Handle error state
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
              queryClient.invalidateQueries({ queryKey: ['products'] })
            }
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
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
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue={viewType}
            onValueChange={(value) => setViewType(value as 'table' | 'grid')}
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
                ? 'No products match your search criteria. Please try using different search terms.'
                : 'You have not added any products yet. Click the button below to add a product.'}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link to="/dashboard/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : viewType === 'table' ? (
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md border">
                      <img
                        src={product.images[0]?.url || '/placeholder.svg'}
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
                        <Badge
                          key={size.id}
                          variant="outline"
                          className="text-xs"
                        >
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
                        onClick={() => handleDeleteClick(product.id)}
                        disabled={deleteMutation.isPending}
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                colors: product.colors,
                sizes: product.sizes,
                images: product.images.map((img) => img.url),
              }}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={
          productToDeleteData
            ? `Are you sure you want to delete "${productToDeleteData.name}"?`
            : 'Are you sure you want to delete this product?'
        }
      />
    </div>
  )
}
