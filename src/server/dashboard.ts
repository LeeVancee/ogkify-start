import { createServerFn } from "@tanstack/react-start";
import { getCategoriesCount } from "@/server/categories";
import {
  getMonthlySalesData,
  getOrdersStats,
  getRecentOrders,
} from "@/server/orders";
import { getProductsCount } from "@/server/products";
import { requireAdminSession } from "./require-admin";

// Get all dashboard data in a single request for optimal performance
export const getDashboardData = createServerFn().handler(async () => {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
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
});
