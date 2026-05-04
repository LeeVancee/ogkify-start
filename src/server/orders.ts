import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, gte, lt, sum } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { orders } from "@/db/schema";

import { requireAdminSession } from "./require-admin";

export {
  createOrderPaymentIntent,
  deleteUnpaidOrder,
  getCheckoutOrder,
  getOrderById,
  getOrderDetails,
  getUnpaidOrders,
  getUserOrders,
  updateCheckoutOrderDetails,
} from "./shop/orders";

type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";

const updateOrderStatusSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { orderId: string; status: string }) =>
    updateOrderStatusSchema.parse(input),
  )
  .handler(async ({ data: { orderId, status } }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { error: adminSession.error, success: false };
    }

    let orderStatus: OrderStatus;

    switch (status) {
      case "PENDING":
        orderStatus = "PENDING";
        break;
      case "PROCESSING":
        orderStatus = "PAID";
        break;
      case "COMPLETED":
        orderStatus = "COMPLETED";
        break;
      case "CANCELLED":
        orderStatus = "CANCELLED";
        break;
      default:
        return { error: "Invalid order status", success: false };
    }

    const order = await db.query.orders.findFirst({
      where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
    });

    if (!order) {
      return { error: "Order not found", success: false };
    }

    await db
      .update(orders)
      .set({ status: orderStatus })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: "Order status updated",
    };
  });

export const getOrdersStats = createServerFn().handler(async () => {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    return {
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
    };
  }

  const [pendingResult, completedResult, revenueResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "PENDING")),
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "COMPLETED")),
    db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.paymentStatus, "PAID")),
  ]);

  return {
    pendingOrders: pendingResult[0].count,
    completedOrders: completedResult[0].count,
    totalRevenue: Number(revenueResult[0].total ?? 0),
  };
});

export const getRecentOrders = createServerFn()
  .inputValidator((limit: number = 5) => limit)
  .handler(async ({ data: limit }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      throw new Error(adminSession.error);
    }

    const recentOrdersList = await db.query.orders.findMany({
      limit,
      orderBy: (ordersTable, { desc }) => [desc(ordersTable.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        items: {
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    return recentOrdersList.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customerName: getRequiredCustomerName(order.user.name, order.orderNumber),
      status: order.status,
      paymentStatus: order.paymentStatus,
      amount: order.totalAmount,
      itemsCount: order.items.length,
    }));
  });

export const getMonthlySalesData = createServerFn().handler(async () => {
  const adminSession = await requireAdminSession();
  if (!adminSession.ok) {
    throw new Error(adminSession.error);
  }

  const currentYear = new Date().getFullYear();

  const monthRanges = Array.from({ length: 12 }, (_, month) => ({
    month,
    startDate: new Date(currentYear, month, 1),
    endDate: new Date(currentYear, month + 1, 1),
  }));

  const results = await Promise.all(
    monthRanges.map(({ startDate, endDate }) =>
      db
        .select({ total: sum(orders.totalAmount) })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, startDate),
            lt(orders.createdAt, endDate),
            eq(orders.paymentStatus, "PAID"),
          ),
        ),
    ),
  );

  return results.map((result, month) => ({
    name: `${month + 1}`,
    total: Number(result[0].total ?? 0),
  }));
});

function getRequiredCustomerName(
  customerName: string | null,
  orderNumber: string,
) {
  if (!customerName) {
    throw new Error(`Customer name is required for order ${orderNumber}`);
  }

  return customerName;
}
