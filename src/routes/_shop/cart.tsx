import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { CartItem } from '@/components/shop/cart/cart-item'
import { CheckoutButton } from '@/components/shop/cart/checkout-button'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { getUserCart } from '@/server/cart.server'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async () => {
    const { items, totalItems } = await getUserCart()
    return {
      items,
      totalItems,
    }
  },
})

function RouteComponent() {
  const { items, totalItems } = Route.useLoaderData()
  const isEmpty = items.length === 0
  const subtotal = items.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0,
  )

  if (isEmpty) {
    return (
      <div className="container flex flex-col items-center justify-center px-4 py-20 md:px-6">
        <ShoppingBag className="mb-6 h-24 w-24 text-muted-foreground opacity-70" />
        <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-10 max-w-md text-center text-muted-foreground">
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
          <div className="rounded-lg border border-border shadow-sm">
            {items.map((item: any) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-md">
          <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
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
