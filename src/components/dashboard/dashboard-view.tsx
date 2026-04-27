import { CreditCard, DollarSign, Package, Tag } from "lucide-react";

import { Overview } from "@/components/dashboard/overview";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { RecentSales } from "@/components/dashboard/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <DashboardPageHeader
        title="Dashboard"
        description="Monitor catalog coverage, order workload, and completed revenue."
      />
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview </TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card size="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {categoriesCount} categories available
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Categories
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categoriesCount}</div>
                <p className="text-xs text-muted-foreground">
                  Used to organize the storefront
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {completedOrders} completed orders
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Workload
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Pending, {completedOrders} completed
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader className="pb-0">
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Monthly completed order revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="ps-2 pt-2">
                <Overview data={monthlySalesData} />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader className="pb-0">
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Total {completedOrders} completed orders
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <RecentSales recentOrders={recentOrders} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
