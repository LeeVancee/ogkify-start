import { createServerFn } from "@tanstack/react-start";
import { count, eq, sum } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { orders } from "@/db/schema";
import type { AdminOrderListItem } from "@/lib/admin/types";

import { requireAdminSession } from "../require-admin";

const updateSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(["PENDING", "PAID", "COMPLETED", "CANCELLED"]),
});

export const listAdminOrders = createServerFn().handler(
  async (): Promise<AdminOrderListItem[]> => {
    const list = await db.query.orders.findMany({
      with: {
        user: true,
        items: {
          with: {
            product: {
              with: {
                images: true,
              },
            },
            color: true,
            size: true,
          },
        },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return list.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user.name,
      customerEmail: order.user.email,
      itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.product.name,
        imageUrl: item.product.images[0]?.url ?? null,
        quantity: item.quantity,
        price: item.price,
        color: item.color?.name ?? null,
        size: item.size?.value ?? null,
      })),
    }));
  },
);

export const updateAdminOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { orderId: string; status: string }) =>
    updateSchema.parse(input),
  )
  .handler(async ({ data }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { success: false, error: adminSession.error };
    }

    await db
      .update(orders)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, data.orderId));

    return { success: true };
  });

export const getAdminOrderStats = createServerFn().handler(async () => {
  const [pending, completed, paidRevenue] = await Promise.all([
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
    pendingOrders: pending[0]?.count ?? 0,
    completedOrders: completed[0]?.count ?? 0,
    totalRevenue: Number(paidRevenue[0]?.total ?? 0),
  };
});
