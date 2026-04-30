import {
  CreditCard,
  DollarSign,
  MoreVertical,
  Package,
  Tag,
} from "lucide-react";

import {
  DashboardMetricCard,
  DashboardPanel,
} from "@/components/dashboard/dashboard-panel";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface SalesData {
  name: string;
  total: number;
}

interface DashboardViewProps {
  productsCount: number;
  categoriesCount: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: Array<any>;
  popularProducts: Array<any>;
  monthlySalesData?: Array<SalesData>;
}

export function DashboardView({
  productsCount,
  categoriesCount,
  pendingOrders,
  completedOrders,
  totalRevenue,
  recentOrders,
  monthlySalesData,
}: DashboardViewProps) {
  if (!monthlySalesData) {
    throw new Error("Monthly sales data is required");
  }

  return (
    <main className="w-full flex-1 space-y-4 overflow-x-hidden p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Total products"
          value={productsCount}
          description={`${categoriesCount} categories available`}
          icon={Package}
          trend="Catalog"
        />
        <DashboardMetricCard
          label="Total categories"
          value={categoriesCount}
          description="Storefront taxonomy"
          icon={Tag}
          trend="Live"
          trendTone="up"
        />
        <DashboardMetricCard
          label="Total revenue"
          value={formatPrice(totalRevenue)}
          description={`From ${completedOrders} completed orders`}
          icon={DollarSign}
          trend="Paid"
          trendTone="up"
        />
        <DashboardMetricCard
          label="Order workload"
          value={pendingOrders}
          description={`Pending, ${completedOrders} completed`}
          icon={CreditCard}
          trend={pendingOrders > 0 ? "Open" : "Clear"}
          trendTone={pendingOrders > 0 ? "down" : "up"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardPanel
          title="Monthly revenue"
          action={
            <Button variant="ghost" size="icon" className="size-7">
              <MoreVertical className="size-4" />
              <span className="sr-only">Revenue options</span>
            </Button>
          }
        >
          <Overview data={monthlySalesData} />
        </DashboardPanel>
        <DashboardPanel
          title="Recent orders"
          action={
            <span className="rounded border px-1.5 py-0.5 text-xs text-muted-foreground">
              {completedOrders} completed
            </span>
          }
        >
          <RecentSales recentOrders={recentOrders} />
        </DashboardPanel>
      </div>
    </main>
  );
}
