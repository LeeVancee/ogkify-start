import { ShoppingBasket } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface NoOrdersProps {
  title: string
  description: string
  buttonText: string
  buttonHref?: string
  icon?: ReactNode
}

export function NoOrders({
  title,
  description,
  buttonText,
  buttonHref = '/',
  icon = <ShoppingBasket className="h-10 w-10" />,
}: NoOrdersProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-card p-10 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Link to={buttonHref} className="mt-6">
        <Button>{buttonText}</Button>
      </Link>
    </div>
  )
}

export function EmptyCart() {
  return (
    <NoOrders
      title="Your cart is empty"
      description="Browse our products and add your favorite items to cart"
      buttonText="Continue Shopping"
    />
  )
}
