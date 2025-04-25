import { DashboardClient } from '@/components/dashboard/dashboard-client'
import Loading from '@/components/loading'
import { getCategoriesCount } from '@/server/categories.server'
import {
  getOrdersStats,
  getRecentOrders,
  getMonthlySalesData,
} from '@/server/orders.server'
import { getProductsCount } from '@/server/products.server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  pendingComponent: Loading,
  loader: async () => {
    const productsCount = await getProductsCount()
    const categoriesCount = await getCategoriesCount()
    const { pendingOrders, completedOrders, totalRevenue } =
      await getOrdersStats()
    const recentOrders = await getRecentOrders()
    const monthlySalesData = await getMonthlySalesData()

    return {
      productsCount,
      categoriesCount,
      pendingOrders,
      completedOrders,
      totalRevenue,
      recentOrders,
      monthlySalesData,
    }
  },
})

function RouteComponent() {
  const {
    productsCount,
    categoriesCount,
    pendingOrders,
    completedOrders,
    totalRevenue,
    recentOrders,
    monthlySalesData,
  } = Route.useLoaderData()
  return (
    <DashboardClient
      productsCount={productsCount}
      categoriesCount={categoriesCount}
      pendingOrders={pendingOrders}
      completedOrders={completedOrders}
      totalRevenue={totalRevenue}
      recentOrders={recentOrders}
      popularProducts={[]}
      monthlySalesData={monthlySalesData}
    />
  )
}
