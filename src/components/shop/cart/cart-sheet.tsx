import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type React from 'react'
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
import { getUserCart } from '@/server/cart.server'

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
  const [cartData, setCartData] = useState<{
    items: Array<CartItemType>
    totalItems: number
  }>({ items: [], totalItems: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch latest cart data when sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchCartData()
    }
  }, [isOpen])

  const fetchCartData = async () => {
    setIsLoading(true)
    try {
      const data = await getUserCart()
      setCartData(data)
    } catch (error) {
      console.error('Failed to get cart data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理商品移除的函数
  const handleItemRemoved = (itemId: string) => {
    // 更新本地状态，移除对应商品
    const updatedItems = cartData.items.filter((item) => item.id !== itemId)
    const newTotalItems = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )

    setCartData({
      items: updatedItems,
      totalItems: newTotalItems,
    })
  }

  // 处理数量变化的函数
  const handleQuantityChanged = (itemId: string, newQuantity: number) => {
    const updatedItems = cartData.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    )
    const newTotalItems = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )

    setCartData({
      items: updatedItems,
      totalItems: newTotalItems,
    })
  }

  // Calculate total
  const subtotal = cartData.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const isEmpty = cartData.items.length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1 pb-4">
          <SheetTitle className="text-xl">
            {isLoading
              ? 'Loading...'
              : `Shopping Cart (${cartData.totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
            <p className="text-center text-sm text-muted-foreground">
              Loading your cart...
            </p>
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
                <Link to="/categories">Browse Products</Link>
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
