import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatAmountForStripe, stripe } from "@/lib/stripe";

// Generate order number: YYYYMMDDHHMMSS + 4-digit random number
function generateOrderNumber(): string {
  const now = new Date();
  const datePart = format(now, "yyyyMMddHHmmss");
  const randomPart = String(Math.floor(Math.random() * 1000000)).padStart(
    6,
    "0",
  );
  return `${datePart}${randomPart}`;
}

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { headers } = getRequest();

          const session = await auth.api.getSession({
            headers,
          });
          // Check if user is logged in
          if (!session?.user.id) {
            return Response.json(
              { error: "Must be logged in to checkout" },
              { status: 401 },
            );
          }

          // Get user's cart
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
            return Response.json({ error: "Cart is empty" }, { status: 400 });
          }

          // Calculate total amount
          const amount = cart.items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0,
          );

          // Build line items
          const lineItems = cart.items.map((item) => {
            const productName = item.product.name;
            const colorName = item.color?.name;
            const sizeName = item.size?.name;

            // Build variant info string (only include non-empty values)
            const variantParts = [colorName, sizeName].filter(
              (part) => part && part.trim().length > 0,
            );
            const variantInfo =
              variantParts.length > 0 ? variantParts.join(", ") : null;

            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: productName,
                  description: variantInfo || undefined,
                  images: item.product.images[0]?.url
                    ? [item.product.images[0].url]
                    : undefined,
                },
                unit_amount: formatAmountForStripe(item.product.price),
              },
              quantity: item.quantity,
            };
          });

          // Create order
          const [order] = await db
            .insert(orders)
            .values({
              userId: session.user.id,
              orderNumber: generateOrderNumber(),
              totalAmount: amount,
              status: "PENDING",
              paymentStatus: "UNPAID",
            })
            .returning();

          // Create order items
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

          // Create Stripe checkout session
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
              allowed_countries: [
                "CN",
                "US",
                "CA",
                "JP",
                "SG",
                "HK",
                "TW",
                "MO",
              ],
            },
            phone_number_collection: {
              enabled: true,
            },
          });

          // Update order with Stripe session ID
          await db
            .update(orders)
            .set({
              paymentMethod: "Stripe",
              paymentIntent: checkoutSession.id,
            })
            .where(eq(orders.id, order.id));

          return Response.json({
            sessionId: checkoutSession.id,
            sessionUrl: checkoutSession.url,
          });
        } catch (error) {
          console.error("Checkout error:", error);
          return Response.json(
            { error: "Failed to create checkout session" },
            { status: 500 },
          );
        }
      },
      GET: () => {
        return Response.json({
          message: "Please use POST method to access this endpoint",
        });
      },
    },
  },
});
