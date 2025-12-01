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
      let cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
      });

      // If no cart exists, create a new one
      if (!cart) {
        console.log("user has no cart, create new cart");
        cart = await prisma.cart.create({
          data: {
            userId: session.user.id,
          },
        });
      }

      // Check if the product already exists in the cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: data.productId,
          colorId: data.colorId || null,
          sizeId: data.sizeId || null,
        },
      });

      if (existingItem) {
        console.log("cart already has this product, update quantity");
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + data.quantity },
        });
      } else {
        console.log("add new product to cart");
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: data.productId,
            quantity: data.quantity,
            colorId: data.colorId || null,
            sizeId: data.sizeId || null,
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
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
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
        image: item.product.images[0]?.url || "/placeholder.svg",
        colorId: item.colorId,
        colorName: item.color?.name || null,
        colorValue: item.color?.value || null,
        sizeId: item.sizeId,
        sizeName: item.size?.name || null,
        sizeValue: item.size?.value || null,
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
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
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
      await prisma.cartItem.delete({
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
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
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
      await prisma.cartItem.update({
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
      const cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
      });

      if (!cart) {
        return { success: true, message: "cart is already empty" };
      }

      // Delete all items in the cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { success: true, message: "cart cleared" };
    } catch (error) {
      console.error("clear cart failed:", error);
      return { error: "clear cart failed", success: false };
    }
  },
);
