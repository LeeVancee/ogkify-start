import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { env } from "@/env/server";
import { formatAmountForStripe, stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { getSession } from "./getSession.server";

// Define order status type
type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
// Get all user orders
export const getUserOrders = createServerFn().handler(async () => {
  try {
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
      firstItemImage: order.items[0]?.product?.images[0]?.url || null,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.product.images[0]?.url || null,
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
  } catch (error) {
    console.error("Failed to get orders:", error);
    return { success: false, orders: [] };
  }
});

// Get order details
export const getOrderDetails = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    try {
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
          imageUrl: item.product.images[0]?.url || null,
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
    } catch (error) {
      console.error("Failed to get order details:", error);
      return { error: "Failed to get order details", success: false };
    }
  });

// Get user unpaid orders
export const getUnpaidOrders = createServerFn().handler(async () => {
  try {
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
      firstItemImage: order.items[0]?.product?.images[0]?.url || null,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.product.images[0]?.url || null,
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
  } catch (error) {
    console.error("Failed to get unpaid orders:", error);
    return { success: false, orders: [] };
  }
});

// Create new payment session for unpaid order
export const createPaymentSession = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        return { error: "未授权", success: false };
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

      // Build line items
      const lineItems = order.items.map((item) => {
        const productName = item.product.name;
        const colorName = item.color?.name || "";
        const sizeName = item.size?.name || "";
        const variantInfo = [colorName, sizeName].filter(Boolean).join(", ");

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: variantInfo ? `${variantInfo}` : undefined,
              images: item.product.images[0]?.url
                ? [item.product.images[0].url]
                : undefined,
            },
            unit_amount: formatAmountForStripe(item.price),
          },
          quantity: item.quantity,
        };
      });

      // Use absolute URL
      const baseUrl = env.VITE_BASE_URL;
      // Create Stripe checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${baseUrl}/checkout/cancel?order_id=${order.id}`,
        metadata: {
          orderId: order.id,
          userId: session.user.id,
        },
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: ["CN", "US", "CA", "JP", "SG", "HK", "TW", "MO"],
        },
        phone_number_collection: {
          enabled: true,
        },
      });

      // Update order payment intent ID
      await db
        .update(orders)
        .set({
          paymentMethod: "Stripe",
          paymentIntent: checkoutSession.id,
        })
        .where(eq(orders.id, order.id));

      return {
        success: true,
        sessionId: checkoutSession.id,
        sessionUrl: checkoutSession.url,
      };
    } catch (error) {
      console.error("Failed to create payment session:", error);
      return { error: "Failed to create payment session", success: false };
    }
  });

// Update order status
export const updateOrderStatus = createServerFn()
  .inputValidator((input: { orderId: string; status: string }) => input)
  .handler(async ({ data: { orderId, status } }) => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        return { error: "Unauthorized", success: false };
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

      // 查询订单，确保订单存在
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
    } catch (error) {
      console.error("Failed to update order status:", error);
      return { error: "Failed to update order status", success: false };
    }
  });

// Get order statistics
export const getOrdersStats = createServerFn().handler(async () => {
  try {
    // Get pending order count
    const [pendingResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "PENDING"));

    // Get completed order count
    const [completedResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "COMPLETED"));

    // Get total revenue (only for paid orders)
    const paidOrdersList = await db.query.orders.findMany({
      where: (ordersTable, { eq }) => eq(ordersTable.paymentStatus, "PAID"),
      columns: {
        totalAmount: true,
      },
    });

    const totalRevenue = paidOrdersList.reduce(
      (total, order) => total + order.totalAmount,
      0,
    );

    return {
      pendingOrders: pendingResult.count,
      completedOrders: completedResult.count,
      totalRevenue,
    };
  } catch (error) {
    console.error("Failed to get orders statistics:", error);
    return {
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
    };
  }
});

// Get recent orders
export const getRecentOrders = createServerFn()
  .inputValidator((limit: number = 5) => limit)
  .handler(async ({ data: limit }) => {
    try {
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
        customerName: order.user.name || "Guest",
        status: order.status,
        paymentStatus: order.paymentStatus,
        amount: order.totalAmount,
        itemsCount: order.items.length,
      }));
    } catch (error) {
      console.error("Failed to get recent orders:", error);
      return [];
    }
  });

// Get monthly sales data
export const getMonthlySalesData = createServerFn().handler(async () => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];

    // Get sales data for each month
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      let endDate;

      if (month === 11) {
        endDate = new Date(currentYear + 1, 0, 1);
      } else {
        endDate = new Date(currentYear, month + 1, 1);
      }

      // Query orders for this month
      const monthlyOrdersList = await db.query.orders.findMany({
        where: (ordersTable, { gte, lt, and, eq }) =>
          and(
            gte(ordersTable.createdAt, startDate),
            lt(ordersTable.createdAt, endDate),
            eq(ordersTable.paymentStatus, "PAID"),
          ),
        columns: {
          totalAmount: true,
        },
      });

      // Calculate monthly total revenue
      const total = monthlyOrdersList.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );

      // Get month name
      const monthName = `${month + 1}`;

      monthlyData.push({
        name: monthName,
        total: total,
      });
    }

    return monthlyData;
  } catch (error) {
    console.error("Failed to get monthly sales data:", error);
    // Return default data
    return [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];
  }
});

// Get single order by ID
export const getOrderById = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    try {
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
    } catch (error) {
      console.error("Failed to get order:", error);
      return { success: false, error: "Failed to get order" };
    }
  });

// Delete unpaid order
export const deleteUnpaidOrder = createServerFn()
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    try {
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
    } catch (error) {
      console.error("Failed to delete order:", error);
      return { success: false, error: "Failed to delete order" };
    }
  });

// Helper functions

// Get order status description
function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return statusMap[status] || status;
}

// Get payment status description
function getPaymentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    UNPAID: "Unpaid",
    PAID: "Paid",
    REFUNDED: "Refunded",
    FAILED: "Failed",
  };
  return statusMap[status] || status;
}
