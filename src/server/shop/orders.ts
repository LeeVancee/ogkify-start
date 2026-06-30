import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";

import { getSession } from "../getSession";
import {
  getCheckoutOrderPayment,
  prepareExistingOrderPayment,
  synchronizePaidOrder,
} from "../order-payment";

const orderIdSchema = z.uuid();
const checkoutOrderDetailsSchema = z.object({
  orderId: z.uuid(),
  shippingAddress: z.string().trim().min(1).max(1000),
  phone: z.string().trim().max(50).optional(),
});

export const getUserOrders = createServerFn().handler(async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return { success: false, orders: [] };
  }

  const ordersList = await db.query.orders.findMany({
    where: (ordersTable, { eq }) => eq(ordersTable.userId, session.user.id),
    with: {
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
      user: true,
    },
    orderBy: (ordersTable, { desc }) => [desc(ordersTable.createdAt)],
  });

  const formattedOrders = ordersList.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.user.name,
    email: order.user.email,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
    totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
    firstItemImage: getRequiredOrderItemImageUrl(
      order.orderNumber,
      order.items[0]?.product?.images[0]?.url,
    ),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: getRequiredOrderItemImageUrl(
        order.orderNumber,
        item.product.images[0]?.url,
      ),
      color: item.color
        ? {
            name: item.color.name,
            value: item.color.value,
          }
        : null,
      size: item.size
        ? {
            name: item.size.name,
            value: item.size.value,
          }
        : null,
    })),
  }));

  return { success: true, orders: formattedOrders };
});

export const getUnpaidOrders = createServerFn().handler(async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return { success: false, orders: [] };
  }

  const ordersList = await db.query.orders.findMany({
    where: (ordersTable, { eq, and }) =>
      and(
        eq(ordersTable.userId, session.user.id),
        eq(ordersTable.paymentStatus, "UNPAID"),
      ),
    with: {
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
    orderBy: (ordersTable, { desc }) => [desc(ordersTable.createdAt)],
  });

  const formattedOrders = ordersList.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
    firstItemImage: getRequiredOrderItemImageUrl(
      order.orderNumber,
      order.items[0]?.product?.images[0]?.url,
    ),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: getRequiredOrderItemImageUrl(
        order.orderNumber,
        item.product.images[0]?.url,
      ),
      color: item.color
        ? {
            name: item.color.name,
            value: item.color.value,
          }
        : null,
      size: item.size
        ? {
            name: item.size.name,
            value: item.size.value,
          }
        : null,
    })),
  }));

  return { success: true, orders: formattedOrders };
});

export const createOrderPaymentIntent = createServerFn({ method: "POST" })
  .validator((orderId: string) => orderIdSchema.parse(orderId))
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "Unauthorized", success: false };
    }

    try {
      const payment = await prepareExistingOrderPayment(
        orderId,
        session.user.id,
      );

      return {
        success: true,
        orderId: payment.orderId,
        clientSecret: payment.clientSecret,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Payment client secret is unavailable",
        success: false,
      };
    }
  });

export const getCheckoutOrder = createServerFn()
  .validator((orderId: string) => orderIdSchema.parse(orderId))
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "Unauthorized", success: false };
    }

    try {
      const payment = await getCheckoutOrderPayment(orderId, session.user.id);
      const { order } = payment;

      return {
        success: true,
        clientSecret: payment.clientSecret,
        customerEmail: session.user.email,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
            imageUrl: getRequiredOrderItemImageUrl(
              order.orderNumber,
              item.product.images[0]?.url,
            ),
            color: item.color
              ? {
                  name: item.color.name,
                  value: item.color.value,
                }
              : null,
            size: item.size
              ? {
                  name: item.size.name,
                  value: item.size.value,
                }
              : null,
          })),
        },
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Payment client secret is unavailable",
        success: false,
      };
    }
  });

export const updateCheckoutOrderDetails = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof checkoutOrderDetailsSchema>) =>
    checkoutOrderDetailsSchema.parse(input),
  )
  .handler(async ({ data }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "Unauthorized", success: false };
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({
        shippingAddress: data.shippingAddress,
        phone: data.phone,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, data.orderId),
          eq(orders.userId, session.user.id),
          eq(orders.paymentStatus, "UNPAID"),
        ),
      )
      .returning({
        id: orders.id,
      });

    if (!updatedOrder) {
      return { error: "Order not found or already paid", success: false };
    }

    return { success: true };
  });

export const getOrderById = createServerFn()
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await db.query.orders.findFirst({
      where: (ordersTable, { eq, and }) =>
        and(
          eq(ordersTable.id, orderId),
          eq(ordersTable.userId, session.user.id),
        ),
      with: {
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
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const synchronizedOrder = await synchronizePaidOrder(
      order.id,
      session.user.id,
    );

    return { success: true, order: synchronizedOrder };
  });

export const deleteUnpaidOrder = createServerFn({ method: "POST" })
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await db.query.orders.findFirst({
      where: (ordersTable, { eq, and }) =>
        and(
          eq(ordersTable.id, orderId),
          eq(ordersTable.userId, session.user.id),
          eq(ordersTable.paymentStatus, "UNPAID"),
        ),
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found or not eligible for deletion",
      };
    }

    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
    await db.delete(orders).where(eq(orders.id, orderId));

    return { success: true, message: "Order deleted successfully" };
  });

function getRequiredOrderItemImageUrl(
  orderNumber: string,
  imageUrl: string | undefined,
) {
  if (!imageUrl) {
    throw new Error(
      `Primary product image is required for order ${orderNumber}`,
    );
  }

  return imageUrl;
}
