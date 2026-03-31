import { createServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { cartItems, carts, orderItems, orders } from "@/db/schema";
import { env } from "@/env/server";
import { formatAmountForStripe, stripe } from "@/lib/stripe";
import { getSession } from "./getSession";

export interface CartItemData {
  productId: string;
  quantity: number;
  colorId?: string;
  sizeId?: string;
}

const MAX_CART_ITEM_QUANTITY = 99;
const cartItemInputSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(1).max(MAX_CART_ITEM_QUANTITY),
  colorId: z.uuid().optional(),
  sizeId: z.uuid().optional(),
});
const cartItemIdSchema = z.uuid();
const updateCartQuantitySchema = z.object({
  cartItemId: z.uuid(),
  quantity: z.number().int().min(1).max(MAX_CART_ITEM_QUANTITY),
});

// Add product to cart
export const addToCart = createServerFn({ method: "POST" })
  .inputValidator((data: CartItemData) => cartItemInputSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession();

    // Check if user is logged in
    if (!session?.user.id) {
      console.error("add to cart failed: user not logged in");
      return { error: "user not logged in, please login", success: false };
    }

    // Check if product exists
    const product = await db.query.products.findFirst({
      where: (productsTable, { eq }) => eq(productsTable.id, data.productId),
    });

    if (!product) {
      console.error("add to cart failed: product not found", data.productId);
      return { error: "product not found", success: false };
    }

    console.log("try to add product to cart", session.user.id, data.productId);

    // Check if user already has a cart
    let cart = await db.query.carts.findFirst({
      where: (cartsTable, { eq }) => eq(cartsTable.userId, session.user.id),
    });

    // If no cart exists, create a new one
    if (!cart) {
      console.log("user has no cart, create new cart");
      const [newCart] = await db
        .insert(carts)
        .values({
          userId: session.user.id,
        })
        .returning();
      cart = newCart;
    }

    // Check if the product already exists in the cart
    const existingItem = await db.query.cartItems.findFirst({
      where: (cartItemsTable, { eq, and, isNull }) =>
        and(
          eq(cartItemsTable.cartId, cart.id),
          eq(cartItemsTable.productId, data.productId),
          data.colorId
            ? eq(cartItemsTable.colorId, data.colorId)
            : isNull(cartItemsTable.colorId),
          data.sizeId
            ? eq(cartItemsTable.sizeId, data.sizeId)
            : isNull(cartItemsTable.sizeId),
        ),
    });

    if (existingItem) {
      console.log("cart already has this product, update quantity");
      const nextQuantity = existingItem.quantity + data.quantity;
      if (nextQuantity > MAX_CART_ITEM_QUANTITY) {
        return {
          error: `quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}`,
          success: false,
        };
      }
      // Update existing product quantity
      await db
        .update(cartItems)
        .set({ quantity: nextQuantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      console.log("add new product to cart");
      // Add new product to cart
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
        colorId: data.colorId !== undefined ? data.colorId : null,
        sizeId: data.sizeId !== undefined ? data.sizeId : null,
      });
    }

    return { success: true, message: "product added to cart" };
  });

// Handle form submission server action
export const handleAddToCartFormAction = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const productId = formData.get("productId");
    const quantityValue = formData.get("quantity");
    const colorIdValue = formData.get("colorId");
    const sizeIdValue = formData.get("sizeId");

    if (typeof productId !== "string" || productId.length === 0) {
      throw new Error("Product ID is required");
    }

    if (typeof quantityValue !== "string" || quantityValue.length === 0) {
      throw new Error("Quantity is required");
    }

    const quantity = Number.parseInt(quantityValue, 10);

    if (Number.isNaN(quantity)) {
      throw new Error("Quantity must be a valid integer");
    }

    const colorId =
      typeof colorIdValue === "string" && colorIdValue.length > 0
        ? colorIdValue
        : undefined;
    const sizeId =
      typeof sizeIdValue === "string" && sizeIdValue.length > 0
        ? sizeIdValue
        : undefined;

    return cartItemInputSchema.parse({
      productId,
      quantity,
      colorId,
      sizeId,
    });
  })
  .handler(async ({ data }) => {
    return addToCart({ data: data });
  });

// Get user cart
export const getUserCart = createServerFn().handler(async () => {
  const session = await getSession();

  if (!session?.user.id) {
    return { items: [], totalItems: 0 };
  }

  // Use Drizzle relational query to fetch cart with all associated data in one query
  const cart = await db.query.carts.findFirst({
    where: (cartsTable, { eq }) => eq(cartsTable.userId, session.user.id),
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

  if (!cart || !cart.items.length) {
    return { items: [], totalItems: 0 };
  }

  // Format cart data
  const formattedItems = cart.items.map((item) => {
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: getRequiredCartImage(item.product.images[0]?.url, item.productId),
      colorId: item.colorId,
      colorName: item.color ? item.color.name : null,
      colorValue: item.color ? item.color.value : null,
      sizeId: item.sizeId,
      sizeName: item.size ? item.size.name : null,
      sizeValue: item.size ? item.size.value : null,
    };
  });

  return {
    items: formattedItems,
    totalItems: formattedItems.length,
  };
});

function getRequiredCartImage(imageUrl: string | undefined, productId: string) {
  if (!imageUrl) {
    throw new Error(`Cart item image is missing for product ${productId}`);
  }

  return imageUrl;
}

// Remove product from cart
export const removeFromCart = createServerFn({ method: "POST" })
  .inputValidator((cartItemId: string) => cartItemIdSchema.parse(cartItemId))
  .handler(async ({ data: cartItemId }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "user not logged in", success: false };
    }

    // Verify this cart item belongs to current user
    const cartItem = await db.query.cartItems.findFirst({
      where: (cartItemsTable, { eq }) => eq(cartItemsTable.id, cartItemId),
      with: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return {
        error: "no permission to operate this cart item",
        success: false,
      };
    }

    // Delete cart item
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));

    return { success: true, message: "product removed from cart" };
  });

// Update cart item quantity
export const updateCartItemQuantity = createServerFn({ method: "POST" })
  .inputValidator((params: { cartItemId: string; quantity: number }) =>
    updateCartQuantitySchema.parse(params),
  )
  .handler(async ({ data: { cartItemId, quantity } }) => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "user not logged in", success: false };
    }

    // Verify this cart item belongs to current user
    const cartItem = await db.query.cartItems.findFirst({
      where: (cartItemsTable, { eq }) => eq(cartItemsTable.id, cartItemId),
      with: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return {
        error: "no permission to operate this cart item",
        success: false,
      };
    }

    // Update quantity
    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId));

    return { success: true, message: "cart updated" };
  });

// Clear cart
export const clearCart = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await getSession();

    if (!session?.user.id) {
      return { error: "user not logged in", success: false };
    }

    // Get user's cart
    const cart = await db.query.carts.findFirst({
      where: (cartsTable, { eq }) => eq(cartsTable.userId, session.user.id),
    });

    if (!cart) {
      return { success: true, message: "cart is already empty" };
    }

    // Delete all items in the cart
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    return { success: true, message: "cart cleared" };
  },
);

// Generate order number: YYYYMMDDHHMMSS + 6-digit random number
function generateOrderNumber(): string {
  const now = new Date();
  const datePart = format(now, "yyyyMMddHHmmss");
  const randomPart = String(Math.floor(Math.random() * 1000000)).padStart(
    6,
    "0",
  );
  return `${datePart}${randomPart}`;
}

const checkoutLineItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().positive().max(99),
  price: z.number().nonnegative(),
  colorId: z.uuid().nullable(),
  sizeId: z.uuid().nullable(),
});

// Create checkout session from cart
export const createCheckoutSession = createServerFn({
  method: "POST",
}).handler(async () => {
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error("Must be logged in to checkout");
  }

  // Get user's cart
  const cart = await db.query.carts.findFirst({
    where: (cartsTable, { eq }) => eq(cartsTable.userId, session.user.id),
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
    throw new Error("Cart is empty");
  }

  // Calculate total amount
  const amount = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const validatedCartItems = cart.items.map((item) =>
    checkoutLineItemSchema.parse({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      colorId: item.colorId,
      sizeId: item.sizeId,
    }),
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
    const primaryImage = item.product.images[0]?.url;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: productName,
          description: variantInfo !== null ? variantInfo : undefined,
          images: primaryImage ? [primaryImage] : undefined,
        },
        unit_amount: formatAmountForStripe(item.product.price),
      },
      quantity: item.quantity,
    };
  });

  const order = await db.transaction(async (tx) => {
    const [createdOrder] = await tx
      .insert(orders)
      .values({
        userId: session.user.id,
        orderNumber: generateOrderNumber(),
        totalAmount: amount,
        status: "PENDING",
        paymentStatus: "UNPAID",
      })
      .returning();

    await tx.insert(orderItems).values(
      validatedCartItems.map((item) => ({
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
    payment_intent_data: {
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    },
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["CN", "US", "CA", "JP", "SG", "HK", "TW", "MO"],
    },
    phone_number_collection: {
      enabled: true,
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe checkout session URL is missing");
  }

  // Update order with Stripe session ID
  await db
    .update(orders)
    .set({
      paymentMethod: "Stripe",
      paymentIntent: checkoutSession.id,
    })
    .where(eq(orders.id, order.id));

  return {
    sessionId: checkoutSession.id,
    sessionUrl: checkoutSession.url,
  };
});
