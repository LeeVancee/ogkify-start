import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
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

    const ordersList = await prisma.orders.findMany({
      where: { user_id: session.user.id },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                images: true,
              },
            },
            colors: true,
            sizes: true,
          },
        },
        user: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Convert to frontend-friendly format
    const formattedOrders = ordersList.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      customer: order.user.name,
      email: order.user.email,
      createdAt: order.created_at.toISOString(),
      status: order.status,
      paymentStatus: order.payment_status,
      totalAmount: order.total_amount,
      totalItems: order.order_items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
      firstItemImage: order.order_items[0]?.products?.images[0]?.url || null,
      items: order.order_items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.products.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.products.images[0]?.url || null,
        color: item.colors
          ? {
              name: item.colors.name,
              value: item.colors.value,
            }
          : null,
        size: item.sizes
          ? {
              name: item.sizes.name,
              value: item.sizes.value,
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
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          user_id: session.user.id,
        },
        include: {
          order_items: {
            include: {
              products: {
                include: {
                  images: true,
                },
              },
              colors: true,
              sizes: true,
            },
          },
        },
      });

      if (!order) {
        return { error: "Order not found", success: false };
      }

      // Format order details
      const totalItems = order.order_items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const formattedOrder = {
        id: order.id,
        orderNumber: order.order_number,
        createdAt: order.created_at.toISOString(),
        createdAtFormatted: new Date(order.created_at).toLocaleDateString(
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
        paymentStatus: order.payment_status,
        paymentStatusText: getPaymentStatusText(order.payment_status),
        totalAmount: order.total_amount,
        totalAmountFormatted: formatPrice(order.total_amount),
        totalItems,
        shippingAddress: order.shipping_address,
        phone: order.phone,
        paymentMethod: order.payment_method,
        items: order.order_items.map((item) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.products.name,
          productDescription: item.products.description,
          quantity: item.quantity,
          price: item.price,
          priceFormatted: formatPrice(item.price),
          totalPrice: item.price * item.quantity,
          totalPriceFormatted: formatPrice(item.price * item.quantity),
          imageUrl: item.products.images[0]?.url || null,
          color: item.colors
            ? {
                name: item.colors.name,
                value: item.colors.value,
              }
            : null,
          size: item.sizes
            ? {
                name: item.sizes.name,
                value: item.sizes.value,
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

    const ordersList = await prisma.orders.findMany({
      where: {
        user_id: session.user.id,
        payment_status: "UNPAID",
      },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                images: true,
              },
            },
            colors: true,
            sizes: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedOrders = ordersList.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at.toISOString(),
      status: order.status,
      paymentStatus: order.payment_status,
      totalAmount: order.total_amount,
      firstItemImage: order.order_items[0]?.products?.images[0]?.url || null,
      items: order.order_items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.products.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.products.images[0]?.url || null,
        color: item.colors
          ? {
              name: item.colors.name,
              value: item.colors.value,
            }
          : null,
        size: item.sizes
          ? {
              name: item.sizes.name,
              value: item.sizes.value,
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
        return { error: "Unauthorized", success: false };
      }

      // Get order information
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          user_id: session.user.id,
          payment_status: "UNPAID",
        },
        include: {
          order_items: {
            include: {
              products: {
                include: {
                  images: true,
                },
              },
              colors: true,
              sizes: true,
            },
          },
        },
      });

      if (!order) {
        return { error: "Order not found", success: false };
      }

      // Build line items
      const lineItems = order.order_items.map((item) => {
        const productName = item.products.name;
        const colorName = item.colors?.name || "";
        const sizeName = item.sizes?.name || "";
        const variantInfo = [colorName, sizeName].filter(Boolean).join(", ");

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: variantInfo ? `${variantInfo}` : undefined,
              images: item.products.images[0]?.url
                ? [item.products.images[0].url]
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
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          payment_method: "Stripe",
          payment_intent: checkoutSession.id,
        },
      });

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

      // Query order to ensure it exists
      const order = await prisma.orders.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return { error: "Order not found", success: false };
      }

      // Update order status
      await prisma.orders.update({
        where: { id: orderId },
        data: { status: orderStatus },
      });

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
    const pendingCount = await prisma.orders.count({
      where: { status: "PENDING" },
    });

    // Get completed order count
    const completedCount = await prisma.orders.count({
      where: { status: "COMPLETED" },
    });

    // Get total revenue (only for paid orders)
    const paidOrders = await prisma.orders.findMany({
      where: { payment_status: "PAID" },
      select: {
        total_amount: true,
      },
    });

    const totalRevenue = paidOrders.reduce(
      (total, order) => total + order.total_amount,
      0,
    );

    return {
      pendingOrders: pendingCount,
      completedOrders: completedCount,
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
      const recentOrdersList = await prisma.orders.findMany({
        take: limit,
        orderBy: {
          created_at: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          order_items: {
            include: {
              products: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return recentOrdersList.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        date: order.created_at,
        customerName: order.user.name || "Guest",
        status: order.status,
        paymentStatus: order.payment_status,
        amount: order.total_amount,
        itemsCount: order.order_items.length,
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
      const monthlyOrdersList = await prisma.orders.findMany({
        where: {
          created_at: {
            gte: startDate,
            lt: endDate,
          },
          payment_status: "PAID",
        },
        select: {
          total_amount: true,
        },
      });

      // Calculate monthly total revenue
      const total = monthlyOrdersList.reduce(
        (sum, order) => sum + order.total_amount,
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
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          user_id: session.user.id,
        },
        include: {
          order_items: {
            include: {
              products: {
                include: {
                  images: true,
                },
              },
              colors: true,
              sizes: true,
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
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          user_id: session.user.id,
          payment_status: "UNPAID",
        },
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found or not eligible for deletion",
        };
      }

      // Delete order (cascade will delete order items)
      await prisma.orders.delete({
        where: { id: orderId },
      });

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
