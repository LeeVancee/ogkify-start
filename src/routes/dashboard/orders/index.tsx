import { OrderManagement } from '@/components/dashboard/order/order-management'
import {} from '@tanstack/react-router'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OrderManagement />
    </div>
  )
}
