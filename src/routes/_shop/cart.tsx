import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CartItem } from '@/components/shop/cart/cart-item'
import { CheckoutButton } from '@/components/shop/cart/checkout-button'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import {
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
} from '@/server/cart.server'
import Loading from '@/components/loading'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const initialData = Route.useLoaderData()

  // 使用 TanStack Query 获取购物车数据
  const {
    data: cartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getUserCart(),
    initialData,
  })

  // 更新商品数量的 mutation
  const updateQuantityMutation = useMutation({
    mutationFn: (params: { cartItemId: string; quantity: number }) =>
      updateCartItemQuantity({ data: params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // 删除商品的 mutation
  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart({ data: cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // 处理加载状态
  if (isLoading) {
    return <Loading />
  }

  // 处理错误状态
  if (isError || !cartData) {
    return (
      <div className="container flex flex-col items-center justify-center px-4 py-20 md:px-6">
        <h1 className="mb-3 text-2xl font-bold text-error">
          Loading cart data failed
        </h1>
        <Button
          asChild
          size="lg"
          className="px-8 transition-all hover:scale-105"
        >
          <Link to="/categories">Back to products</Link>
        </Button>
      </div>
    )
  }

  const { items = [], totalItems = 0 } = cartData
  const isEmpty = items.length === 0
  const subtotal = items.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0,
  )

  // 处理商品数量变化
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantityMutation.mutate({
      cartItemId: itemId,
      quantity: newQuantity,
    })
  }

  // 处理商品移除
  const handleItemRemove = (itemId: string) => {
    removeItemMutation.mutate(itemId)
  }

  if (isEmpty) {
    return (
      <div className="container flex flex-col items-center justify-center px-4 py-20 md:px-6">
        <ShoppingBag className="mb-6 h-24 w-24 text-base-content/60" />
        <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-10 max-w-md text-center text-base-content/60">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button
          asChild
          size="lg"
          className="px-8 transition-all hover:scale-105"
        >
          <Link to="/categories">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button variant="outline" asChild>
          <Link to="/categories">Continue Shopping</Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border shadow-sm">
            {items.map((item: any) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChanged={handleQuantityChange}
                onItemRemoved={handleItemRemove}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-md">
          <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-base-content/60">
                Subtotal ({totalItems} items)
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="my-5 border-t pt-5">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span className="text-primary">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <div className="pt-2">
              <CheckoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
