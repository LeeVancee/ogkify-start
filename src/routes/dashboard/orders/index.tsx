import { createFileRoute } from '@tanstack/react-router'
import { getUserOrders } from '@/server/orders.server'
import { OrderManagement } from '@/components/dashboard/order/order-management'
import Loading from '@/components/loading'
export const Route = createFileRoute('/dashboard/orders/')({
  pendingComponent: Loading,
  component: RouteComponent,
  loader: async () => {
    const orders = await getUserOrders()
    return { orders }
  },
})

function RouteComponent() {
  const { orders } = Route.useLoaderData()
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OrderManagement initialOrders={orders as any} />
    </div>
  )
}
