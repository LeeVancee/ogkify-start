import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { CartItem } from '@/components/shop/cart/cart-item'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { formatPrice } from '@/lib/utils'
import {
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
} from '@/server/cart.server'

interface CartItemType {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  colorId?: string | null
  colorName?: string | null
  colorValue?: string | null
  sizeId?: string | null
  sizeName?: string | null
  sizeValue?: string | null
}

export function CartSheet({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  // 使用TanStack Query获取购物车数据
  const {
    data: cartData = { items: [], totalItems: 0 },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: getUserCart,
    enabled: isOpen, // 只有当侧边栏打开时才获取数据
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取
    refetchOnWindowFocus: false,
  })

  // 移除购物车商品的mutation
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeFromCart({ data: itemId }),
    onSuccess: () => {
      // 成功后刷新购物车数据
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // 更新购物车商品数量的mutation
  const updateQuantityMutation = useMutation({
    mutationFn: (params: { cartItemId: string; quantity: number }) =>
      updateCartItemQuantity({ data: params }),
    onSuccess: () => {
      // 成功后刷新购物车数据
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // 处理商品移除的函数
  const handleItemRemoved = (itemId: string) => {
    removeMutation.mutate(itemId)
  }

  // 处理数量变化的函数
  const handleQuantityChanged = (itemId: string, newQuantity: number) => {
    updateQuantityMutation.mutate({
      cartItemId: itemId,
      quantity: newQuantity,
    })
  }

  // 计算总价
  const subtotal = cartData.items.reduce(
    (total: number, item: CartItemType) => total + item.price * item.quantity,
    0
  )

  const isEmpty = cartData.items.length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1 pb-4">
          <SheetTitle className="text-xl">
            {isLoading ? '' : `Shopping Cart (${cartData.totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
            <p className="text-center text-sm text-muted-foreground">
              Loading your cart...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <p className="text-center text-red-500">Failed to load cart data</p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ['cart'] })
              }
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-70" />
            <div className="text-xl font-medium">Your cart is empty</div>
            <p className="text-center text-sm text-muted-foreground max-w-[250px]">
              Add products to your cart to view them here.
            </p>
            <SheetTrigger asChild>
              <Button
                asChild
                className="mt-4 px-6 transition-all hover:scale-105"
              >
                <Link to="/products">Browse Products</Link>
              </Button>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 pr-1">
              <div className="space-y-4">
                {cartData.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onItemRemoved={handleItemRemoved}
                    onQuantityChanged={handleQuantityChanged}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t pt-6 pb-4">
              <div className="space-y-3 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-lg font-medium">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <SheetFooter className="flex flex-col gap-3 pt-4 sm:flex-row">
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Continue Shopping
                  </Button>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/cart">View Cart</Link>
                  </Button>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
