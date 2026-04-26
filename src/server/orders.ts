import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, gte, lt, sum } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatAmountForStripe, stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";

import { getSession } from "./getSession";
import { requireAdminSession } from "./require-admin";

// Define order status type
type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
const orderIdSchema = z.uuid();
const updateOrderStatusSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
});
const checkoutOrderDetailsSchema = z.object({
  orderId: z.uuid(),
  shippingAddress: z.string().trim().min(1).max(1000),
  phone: z.string().trim().max(50).optional(),
});

// Get all user orders
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

  // Convert to frontend-friendly format
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

// Get order details
export const getOrderDetails = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "Unauthorized", success: false };
    }

    // Query order, ensure order belongs to current logged-in user
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

    // Format order details
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

// Get user unpaid orders
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

// Create or reuse a Stripe PaymentIntent for an unpaid order.
export const createOrderPaymentIntent = createServerFn({ method: "POST" })
  .inputValidator((orderId: string) => orderIdSchema.parse(orderId))
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "Unauthorized", success: false };
    }

    // Get order information
    const order = await db.query.orders.findFirst({
      where: (ordersTable, { eq, and }) =>
        and(
          eq(ordersTable.id, orderId),
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
    });

    if (!order) {
      return { error: "Order not found", success: false };
    }

    const paymentIntent = await createOrReusePaymentIntent({
      existingPaymentIntentId: order.paymentIntent,
      amount: order.totalAmount,
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: session.user.id,
    });

    if (!paymentIntent.client_secret) {
      return { error: "Payment client secret is unavailable", success: false };
    }

    await db
      .update(orders)
      .set({
        paymentMethod: "Stripe",
        paymentIntent: paymentIntent.id,
      })
      .where(eq(orders.id, order.id));

    return {
      success: true,
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
    };
  });

// Get the order snapshot and PaymentIntent client secret for the checkout page.
export const getCheckoutOrder = createServerFn()
  .inputValidator((orderId: string) => orderIdSchema.parse(orderId))
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
    });

    if (!order) {
      return { error: "Order not found or already paid", success: false };
    }

    if (!order.paymentIntent || !order.paymentIntent.startsWith("pi_")) {
      return { error: "Payment has not been initialized", success: false };
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.paymentIntent,
    );

    if (!paymentIntent.client_secret) {
      return { error: "Payment client secret is unavailable", success: false };
    }

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
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

async function createOrReusePaymentIntent({
  existingPaymentIntentId,
  amount,
  orderId,
  orderNumber,
  userId,
}: {
  existingPaymentIntentId: string | null;
  amount: number;
  orderId: string;
  orderNumber: string;
  userId: string;
}) {
  const amountInCents = formatAmountForStripe(amount);

  if (existingPaymentIntentId?.startsWith("pi_")) {
    const existingPaymentIntent = await stripe.paymentIntents.retrieve(
      existingPaymentIntentId,
    );

    if (
      existingPaymentIntent.status !== "succeeded" &&
      existingPaymentIntent.status !== "canceled"
    ) {
      if (existingPaymentIntent.amount !== amountInCents) {
        return stripe.paymentIntents.update(existingPaymentIntent.id, {
          amount: amountInCents,
        });
      }

      return existingPaymentIntent;
    }
  }

  return stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    description: `Order ${orderNumber}`,
    metadata: {
      orderId,
      userId,
    },
  });
}

// Update order status
export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { orderId: string; status: string }) =>
    updateOrderStatusSchema.parse(input),
  )
  .handler(async ({ data: { orderId, status } }) => {
    const adminSession = await requireAdminSession();
    if (!adminSession.ok) {
      return { error: adminSession.error, success: false };
    }

    // Convert string to OrderStatus type
    let orderStatus: OrderStatus;

    switch (status) {
      case "PENDING":
        orderStatus = "PENDING";
        break;
      case "PROCESSING":
        orderStatus = "PAID"; // In the model, PAID corresponds to processing status
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

    // Query order to ensure it exists
    const order = await db.query.orders.findFirst({
      where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
    });

    if (!order) {
      return { error: "Order not found", success: false };
    }

    // Update order status - now using enum type
    await db
      .update(orders)
      .set({ status: orderStatus })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: "Order status updated",
    };
  });

// Get order statistics
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

// Get recent orders
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

// Get monthly sales data
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

// Get single order by ID
export const getOrderById = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get order with all related data
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

    return { success: true, order };
  });

// Delete unpaid order
export const deleteUnpaidOrder = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get order information, ensure it is the user's unpaid order
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

    // First delete all associated order items
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));

    // Then delete the order itself
    await db.delete(orders).where(eq(orders.id, orderId));

    return { success: true, message: "Order deleted successfully" };
  });

// Helper functions

// Get order status description
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

// Get payment status description
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

function getRequiredCustomerName(
  customerName: string | null,
  orderNumber: string,
) {
  if (!customerName) {
    throw new Error(`Customer name is required for order ${orderNumber}`);
  }

  return customerName;
}
