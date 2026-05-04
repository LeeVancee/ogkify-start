import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

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

export const getOrderDetails = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "Unauthorized", success: false };
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
      return { error: "Order not found", success: false };
    }

    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      createdAtFormatted: new Date(order.createdAt).toLocaleDateString(
        "zh-CN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      status: order.status,
      statusText: getOrderStatusText(order.status),
      paymentStatus: order.paymentStatus,
      paymentStatusText: getPaymentStatusText(order.paymentStatus),
      totalAmount: order.totalAmount,
      totalAmountFormatted: formatPrice(order.totalAmount),
      totalItems,
      shippingAddress: order.shippingAddress,
      phone: order.phone,
      paymentMethod: order.paymentMethod,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productDescription: item.product.description,
        quantity: item.quantity,
        price: item.price,
        priceFormatted: formatPrice(item.price),
        totalPrice: item.price * item.quantity,
        totalPriceFormatted: formatPrice(item.price * item.quantity),
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
    };

    return {
      success: true,
      order: formattedOrder,
    };
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
  .inputValidator((orderId: string) => orderIdSchema.parse(orderId))
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
  .inputValidator((orderId: string) => orderIdSchema.parse(orderId))
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
  .inputValidator((input: z.infer<typeof checkoutOrderDetailsSchema>) =>
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
  .inputValidator((orderId: string) => orderId)
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

export const deleteUnpaidOrder = createServerFn()
  .inputValidator((orderId: string) => orderId)
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

function getOrderStatusText(status: string): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PAID":
      return "Paid";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      throw new Error(`Unknown order status: ${status}`);
  }
}

function getPaymentStatusText(status: string): string {
  switch (status) {
    case "UNPAID":
      return "Unpaid";
    case "PAID":
      return "Paid";
    case "REFUNDED":
      return "Refunded";
    case "FAILED":
      return "Failed";
    default:
      throw new Error(`Unknown payment status: ${status}`);
  }
}

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
