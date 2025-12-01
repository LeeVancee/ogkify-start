import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import {
  getMonthlySalesData,
  getOrdersStats,
  getRecentOrders,
} from "@/server/orders.server";
import { getProductsCount } from "@/server/products.server";

// Get categories count
export const getCategoriesCount = createServerFn().handler(async () => {
  try {
    const count = await prisma.category.count();
    return count;
  } catch (error) {
    console.error("Failed to get categories count:", error);
    return 0;
  }
});

// Get all dashboard data in a single request for optimal performance
export const getDashboardData = createServerFn().handler(async () => {
  try {
    // Use Promise.all to fetch all data in parallel
    const [
      productsCount,
      categoriesCount,
      ordersStats,
      recentOrders,
      monthlySalesData,
    ] = await Promise.all([
      getProductsCount(),
      getCategoriesCount(),
      getOrdersStats(),
      getRecentOrders(),
      getMonthlySalesData(),
    ]);

    const { pendingOrders, completedOrders, totalRevenue } = ordersStats;

    return {
      productsCount,
      categoriesCount,
      pendingOrders,
      completedOrders,
      totalRevenue,
      recentOrders,
      monthlySalesData,
    };
  } catch (error) {
    console.error("Failed to get dashboard data:", error);
    return {
      productsCount: 0,
      categoriesCount: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      monthlySalesData: [],
    };
  }
});
