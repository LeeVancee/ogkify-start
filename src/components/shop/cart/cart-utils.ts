import type { CartItemView } from "./cart-ui";

export function getCartSubtotal(items: CartItemView[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
