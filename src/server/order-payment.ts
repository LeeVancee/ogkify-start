import { format } from "date-fns";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db";
import { cartItems, orderItems, orders } from "@/db/schema";
import { formatAmountForStripe, stripe } from "@/lib/stripe";

const checkoutLineItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().positive().max(99),
  price: z.number().nonnegative(),
  colorId: z.uuid().nullable(),
  sizeId: z.uuid().nullable(),
});

export async function createCheckoutOrderPayment(userId: string) {
  const cart = await getRequiredUserCart(userId);
  const order = await createUnpaidOrderFromCart(userId, cart.items);
  const payment = await createOrReusePaymentForOrder(order);

  return {
    clientSecret: payment.clientSecret,
    orderId: order.id,
  };
}

export async function prepareExistingOrderPayment(
  orderId: string,
  userId: string,
) {
  const order = await getRequiredUnpaidOrder(orderId, userId);
  return createOrReusePaymentForOrder(order);
}

export async function getCheckoutOrderPayment(orderId: string, userId: string) {
  const order = await getRequiredUnpaidOrder(orderId, userId);

  if (!order.paymentIntent || !order.paymentIntent.startsWith("pi_")) {
    throw new Error("Payment has not been initialized");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    order.paymentIntent,
  );

  if (!paymentIntent.client_secret) {
    throw new Error("Payment client secret is unavailable");
  }

  return {
    clientSecret: paymentIntent.client_secret,
    order,
  };
}

export async function applyStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded":
      await markOrderPaidFromPaymentIntent(
        event.data.object as Stripe.PaymentIntent,
      );
      return;
    case "checkout.session.completed":
      await markOrderPaidFromCheckoutSession(
        event.data.object as Stripe.Checkout.Session,
      );
      return;
    case "payment_intent.payment_failed":
      await markOrderPaymentFailed(event.data.object as Stripe.PaymentIntent);
      return;
    case "charge.refunded":
      await markOrderRefunded(event.data.object as Stripe.Charge);
      return;
    default:
      return;
  }
}

export async function synchronizePaidOrder(orderId: string, userId: string) {
  const order = await db.query.orders.findFirst({
    where: (ordersTable, { eq, and }) =>
      and(eq(ordersTable.id, orderId), eq(ordersTable.userId, userId)),
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
    throw new Error(`Order ${orderId} not found`);
  }

  if (order.paymentStatus === "PAID") {
    return order;
  }

  if (!order.paymentIntent || !order.paymentIntent.startsWith("pi_")) {
    return order;
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    order.paymentIntent,
  );

  if (paymentIntent.status !== "succeeded") {
    return order;
  }

  await markOrderPaidFromPaymentIntent(paymentIntent);

  const updatedOrder = await db.query.orders.findFirst({
    where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
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

  if (!updatedOrder) {
    throw new Error(`Order ${orderId} not found after payment sync`);
  }

  return updatedOrder;
}

function generateOrderNumber() {
  const now = new Date();
  const datePart = format(now, "yyyyMMddHHmmss");
  const randomPart = String(Math.floor(Math.random() * 1000000)).padStart(
    6,
    "0",
  );
  return `${datePart}${randomPart}`;
}

async function getRequiredUserCart(userId: string) {
  const cart = await db.query.carts.findFirst({
    where: (cartsTable, { eq }) => eq(cartsTable.userId, userId),
    with: {
      items: {
        with: {
          product: true,
          color: true,
          size: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  return cart;
}

async function createUnpaidOrderFromCart(
  userId: string,
  items: Array<{
    productId: string;
    quantity: number;
    colorId: string | null;
    sizeId: string | null;
    product: { price: number };
  }>,
) {
  const amount = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const validatedItems = items.map((item) =>
    checkoutLineItemSchema.parse({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      colorId: item.colorId,
      sizeId: item.sizeId,
    }),
  );

  return db.transaction(async (tx) => {
    const [createdOrder] = await tx
      .insert(orders)
      .values({
        userId,
        orderNumber: generateOrderNumber(),
        totalAmount: amount,
        status: "PENDING",
        paymentStatus: "UNPAID",
      })
      .returning({
        id: orders.id,
        orderNumber: orders.orderNumber,
        paymentIntent: orders.paymentIntent,
        totalAmount: orders.totalAmount,
        userId: orders.userId,
      });

    await tx.insert(orderItems).values(
      validatedItems.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        colorId: item.colorId,
        sizeId: item.sizeId,
      })),
    );

    return createdOrder;
  });
}

async function getRequiredUnpaidOrder(orderId: string, userId: string) {
  const order = await db.query.orders.findFirst({
    where: (ordersTable, { eq, and }) =>
      and(
        eq(ordersTable.id, orderId),
        eq(ordersTable.userId, userId),
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
    throw new Error("Order not found or already paid");
  }

  return order;
}

async function createOrReusePaymentForOrder(order: {
  id: string;
  orderNumber: string;
  paymentIntent: string | null;
  totalAmount: number;
  userId?: string;
}) {
  const paymentIntent = await createOrReusePaymentIntent({
    existingPaymentIntentId: order.paymentIntent,
    amount: order.totalAmount,
    orderId: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId ?? getRequiredMetadataUserId(order),
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Payment client secret is unavailable");
  }

  await db
    .update(orders)
    .set({
      paymentMethod: "Stripe",
      paymentIntent: paymentIntent.id,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  return {
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  };
}

function getRequiredMetadataUserId(order: { userId?: string }) {
  if (!order.userId) {
    throw new Error("Order user is required for payment preparation");
  }

  return order.userId;
}

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

async function markOrderPaidFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
) {
  const orderId = paymentIntent.metadata?.orderId;
  const userId = paymentIntent.metadata?.userId;

  if (!orderId) {
    throw new Error("Order ID not found in payment intent metadata");
  }

  const existingOrder = await db.query.orders.findFirst({
    where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
    columns: {
      id: true,
      paymentIntent: true,
    },
  });

  if (!existingOrder) {
    throw new Error(`Order ${orderId} not found for payment completion`);
  }

  if (
    existingOrder.paymentIntent &&
    existingOrder.paymentIntent !== paymentIntent.id &&
    !existingOrder.paymentIntent.startsWith("cs_")
  ) {
    throw new Error(`Payment intent mismatch for order ${orderId}`);
  }

  const charge = paymentIntent.latest_charge
    ? typeof paymentIntent.latest_charge === "string"
      ? await stripe.charges.retrieve(paymentIntent.latest_charge)
      : paymentIntent.latest_charge
    : null;

  await db
    .update(orders)
    .set({
      status: "PAID",
      paymentStatus: "PAID",
      paymentIntent: paymentIntent.id,
      phone: charge?.billing_details?.phone || null,
      shippingAddress: formatStripeAddress(charge?.billing_details?.address),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  if (userId) {
    await clearUserCartByUserId(userId);
  }
}

async function markOrderPaidFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (!orderId) {
    throw new Error("Order ID not found in checkout session metadata");
  }

  const existingOrder = await db.query.orders.findFirst({
    where: (ordersTable, { eq }) => eq(ordersTable.id, orderId),
    columns: {
      id: true,
      paymentIntent: true,
    },
  });

  if (!existingOrder) {
    throw new Error(`Order ${orderId} not found for checkout completion`);
  }

  const sessionPaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  if (
    existingOrder.paymentIntent &&
    existingOrder.paymentIntent !== session.id &&
    existingOrder.paymentIntent !== sessionPaymentIntentId
  ) {
    throw new Error(`Checkout session mismatch for order ${orderId}`);
  }

  await db
    .update(orders)
    .set({
      status: "PAID",
      paymentStatus: "PAID",
      paymentIntent: sessionPaymentIntentId,
      phone: session.customer_details?.phone,
      shippingAddress: formatStripeAddress(session.customer_details?.address),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  if (userId) {
    await clearUserCartByUserId(userId);
  }
}

async function markOrderPaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error("Order ID not found in payment intent metadata");
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: "CANCELLED",
      paymentStatus: "FAILED",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
    });

  if (!updatedOrder) {
    throw new Error(`Failed to update failed payment for order ${orderId}`);
  }
}

async function markOrderRefunded(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string | null;

  if (!paymentIntentId) {
    throw new Error("Payment intent not found for refunded charge");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error("Order ID not found in refunded payment intent metadata");
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      paymentStatus: "REFUNDED",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning({
      id: orders.id,
    });

  if (!updatedOrder) {
    throw new Error(`Failed to update refunded order ${orderId}`);
  }
}

async function clearUserCartByUserId(userId: string) {
  const userCart = await db.query.carts.findFirst({
    where: (cartsTable, { eq }) => eq(cartsTable.userId, userId),
  });

  if (userCart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
  }
}

function formatStripeAddress(
  address: Stripe.Address | Stripe.AddressParam | null | undefined,
) {
  const parts = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(", ") : null;
}
