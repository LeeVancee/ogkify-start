import { createServerFn } from "@tanstack/react-start";

import type { DashboardOverviewData } from "@/lib/admin/types";

import { listAdminOrders, getAdminOrderStats } from "./orders";
import { listAdminProducts, getAdminProductStats } from "./products";
import { getAdminResourceCounts } from "./resources";

export const getDashboardOverview = createServerFn().handler(
  async (): Promise<DashboardOverviewData> => {
    const [products, orders, productStats, resourceCounts, orderStats] =
      await Promise.all([
        listAdminProducts(),
        listAdminOrders(),
        getAdminProductStats(),
        getAdminResourceCounts(),
        getAdminOrderStats(),
      ]);

    return {
      ...productStats,
      ...resourceCounts,
      ...orderStats,
      recentOrders: orders.slice(0, 5).map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        amount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      })),
      latestProducts: products.slice(0, 5).map((product) => ({
        id: product.id,
        name: product.name,
        categoryName: product.categoryName,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
      })),
    };
  },
);
