// Define order item type
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string | null;
  color?: { name: string; value: string } | null;
  size?: { name: string; value: string } | null;
}

// Define order type
export interface Order {
  id: string;
  orderNumber: string;
  customer?: string;
  email?: string;
  createdAt: string;
  createdAtFormatted?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  totalAmountFormatted?: string;
  totalItems: number;
  shippingAddress?: string | null;
  phone?: string | null;
  items: Array<OrderItem>;
  firstItemImage?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
