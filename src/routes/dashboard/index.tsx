import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { getDashboardData } from "@/server/dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  // Use single query to fetch all dashboard data for optimal performance
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => getDashboardData(),
  });

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (!data) {
    throw new Error("Dashboard data is missing");
  }

  const {
    productsCount,
    categoriesCount,
    pendingOrders,
    completedOrders,
    totalRevenue,
    recentOrders,
    monthlySalesData,
  } = data;

  return (
    <DashboardView
      productsCount={productsCount}
      categoriesCount={categoriesCount}
      pendingOrders={pendingOrders}
      completedOrders={completedOrders}
      totalRevenue={totalRevenue}
      recentOrders={recentOrders}
      popularProducts={[]}
      monthlySalesData={monthlySalesData}
    />
  );
}
