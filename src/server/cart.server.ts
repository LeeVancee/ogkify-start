import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import { getSession } from "./getSession.server";

export interface CartItemData {
  productId: string;
  quantity: number;
  colorId?: string;
  sizeId?: string;
}

// Add product to cart
export const addToCart = createServerFn({ method: "POST" })
  .inputValidator((data: CartItemData) => data)
  .handler(async ({ data }) => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        console.error("add to cart failed: user not logged in");
        return { error: "user not logged in, please login", success: false };
      }

      // Check if product exists
      const product = await prisma.products.findUnique({
        where: { id: data.productId },
      });

      if (!product) {
        console.error("add to cart failed: product not found", data.productId);
        return { error: "product not found", success: false };
      }

      console.log(
        "try to add product to cart",
        session.user.id,
        data.productId,
      );

      // Check if user already has a cart
      let cart = await prisma.carts.findFirst({
        where: { user_id: session.user.id },
      });

      // If no cart exists, create a new one
      if (!cart) {
        console.log("user has no cart, create new cart");
        cart = await prisma.carts.create({
          data: {
            user_id: session.user.id,
          },
        });
      }

      // Check if the product already exists in the cart
      const existingItem = await prisma.cart_items.findFirst({
        where: {
          cart_id: cart.id,
          product_id: data.productId,
          color_id: data.colorId || null,
          size_id: data.sizeId || null,
        },
      });

      if (existingItem) {
        console.log("cart already has this product, update quantity");
        await prisma.cart_items.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + data.quantity },
        });
      } else {
        console.log("add new product to cart");
        await prisma.cart_items.create({
          data: {
            cart_id: cart.id,
            product_id: data.productId,
            quantity: data.quantity,
            color_id: data.colorId || null,
            size_id: data.sizeId || null,
          },
        });
      }

      return { success: true, message: "product added to cart" };
    } catch (error) {
      console.error("add to cart failed:", error);
      return { error: "add to cart failed, server error", success: false };
    }
  });

// Handle form submission server action
export const handleAddToCartFormAction = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;
    const colorId = (formData.get("colorId") as string) || undefined;
    const sizeId = (formData.get("sizeId") as string) || undefined;

    return {
      productId,
      quantity,
      colorId,
      sizeId,
    };
  })
  .handler(async ({ data }) => {
    return addToCart({ data: data });
  });

// Get user cart
export const getUserCart = createServerFn().handler(async () => {
  try {
    const session = await getSession();

    if (!session?.user.id) {
      return { items: [], totalItems: 0 };
    }

    // Get cart with all associated data
    const cart = await prisma.carts.findFirst({
      where: { user_id: session.user.id },
      include: {
        cart_items: {
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

    if (!cart || !cart.cart_items.length) {
      return { items: [], totalItems: 0 };
    }

    // Format cart data
    const formattedItems = cart.cart_items.map((item) => {
      return {
        id: item.id,
        productId: item.product_id,
        name: item.products.name,
        price: item.products.price,
        quantity: item.quantity,
        image: item.products.images[0]?.url || "/placeholder.svg",
        colorId: item.color_id,
        colorName: item.colors?.name || null,
        colorValue: item.colors?.value || null,
        sizeId: item.size_id,
        sizeName: item.sizes?.name || null,
        sizeValue: item.sizes?.value || null,
      };
    });

    return {
      items: formattedItems,
      totalItems: formattedItems.length,
    };
  } catch (error) {
    console.error("get cart failed:", error);
    return { items: [], totalItems: 0 };
  }
});

// Remove product from cart
export const removeFromCart = createServerFn({ method: "POST" })
  .inputValidator((cartItemId: string) => cartItemId)
  .handler(async ({ data: cartItemId }) => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        return { error: "user not logged in", success: false };
      }

      // Verify this cart item belongs to current user
      const cartItem = await prisma.cart_items.findUnique({
        where: { id: cartItemId },
        include: {
          carts: true,
        },
      });

      if (!cartItem || cartItem.carts.user_id !== session.user.id) {
        return {
          error: "no permission to operate this cart item",
          success: false,
        };
      }

      // Delete cart item
      await prisma.cart_items.delete({
        where: { id: cartItemId },
      });

      return { success: true, message: "product removed from cart" };
    } catch (error) {
      console.error("remove from cart failed:", error);
      return { error: "remove from cart failed", success: false };
    }
  });

// Update cart item quantity
export const updateCartItemQuantity = createServerFn({ method: "POST" })
  .inputValidator((params: { cartItemId: string; quantity: number }) => params)
  .handler(async ({ data: { cartItemId, quantity } }) => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        return { error: "user not logged in", success: false };
      }

      if (quantity <= 0) {
        return removeFromCart({ data: cartItemId });
      }

      // Verify this cart item belongs to current user
      const cartItem = await prisma.cart_items.findUnique({
        where: { id: cartItemId },
        include: {
          carts: true,
        },
      });

      if (!cartItem || cartItem.carts.user_id !== session.user.id) {
        return {
          error: "no permission to operate this cart item",
          success: false,
        };
      }

      // Update quantity
      await prisma.cart_items.update({
        where: { id: cartItemId },
        data: { quantity },
      });

      return { success: true, message: "cart updated" };
    } catch (error) {
      console.error("update cart quantity failed:", error);
      return { error: "update cart quantity failed", success: false };
    }
  });

// Clear cart
export const clearCart = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        return { error: "user not logged in", success: false };
      }

      // Get user's cart
      const cart = await prisma.carts.findFirst({
        where: { user_id: session.user.id },
      });

      if (!cart) {
        return { success: true, message: "cart is already empty" };
      }

      // Delete all items in the cart
      await prisma.cart_items.deleteMany({
        where: { cart_id: cart.id },
      });

      return { success: true, message: "cart cleared" };
    } catch (error) {
      console.error("clear cart failed:", error);
      return { error: "clear cart failed", success: false };
    }
  },
);
