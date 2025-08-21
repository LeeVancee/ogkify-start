import { json } from "@tanstack/react-start";
import {
  createServerFileRoute,
  getWebRequest,
} from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatAmountForStripe, stripe } from "@/lib/stripe";

export const ServerRoute = createServerFileRoute("/api/checkout").methods({
  POST: async ({ request }: { request: any }) => {
    try {
      const { headers } = getWebRequest();

      const session = await auth.api.getSession({
        headers,
      });
      // 检查用户是否已登录
      if (!session?.user.id) {
        return json(
          { error: "Must be logged in to checkout" },
          { status: 401 },
        );
      }

      // 获取用户的购物车
      const cart = await db.query.carts.findFirst({
        where: (carts, { eq }) => eq(carts.userId, session.user.id),
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

      if (!cart || cart.items.length === 0) {
        return json({ error: "Cart is empty" }, { status: 400 });
      }

      // 计算总金额
      const amount = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      );

      // 构建行项目
      const lineItems = cart.items.map((item) => {
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
            unit_amount: formatAmountForStripe(item.product.price),
          },
          quantity: item.quantity,
        };
      });

      // 创建订单
      const [order] = await db
        .insert(orders)
        .values({
          userId: session.user.id,
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          totalAmount: amount,
          status: "PENDING",
          paymentStatus: "UNPAID",
        })
        .returning();

      // 创建订单项
      await db.insert(orderItems).values(
        cart.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          colorId: item.colorId,
          sizeId: item.sizeId,
        })),
      );

      const origin = new URL(request.url).origin;

      // 创建 Stripe 结账会话
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
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

      // 更新订单，添加 Stripe 会话 ID
      await db
        .update(orders)
        .set({
          paymentMethod: "Stripe",
          paymentIntent: checkoutSession.id,
        })
        .where(eq(orders.id, order.id));

      return json({
        sessionId: checkoutSession.id,
        sessionUrl: checkoutSession.url,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      return json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }
  },
  GET: () => {
    return json({ message: "Please use POST method to access this endpoint" });
  },
});
