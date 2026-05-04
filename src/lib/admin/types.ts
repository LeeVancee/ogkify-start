export type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";

export interface AdminOption {
  id: string;
  name: string;
  value?: string;
}

export interface AdminColorOption extends AdminOption {
  value: string;
}

export interface AdminProductFormValues {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  colorIds: string[];
  sizeIds: string[];
  images: string[];
  isFeatured: boolean;
  isArchived: boolean;
}

export interface AdminProductListItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  colors: AdminColorOption[];
  sizes: AdminOption[];
  imageUrl: string | null;
  imageCount: number;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface AdminProductDetail extends AdminProductFormValues {
  id: string;
}

export interface AdminResourceFormValues {
  name: string;
  value?: string;
  imageUrl?: string;
}

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    imageUrl: string | null;
    quantity: number;
    price: number;
    color: string | null;
    size: string | null;
  }>;
}

export interface DashboardOverviewData {
  productsCount: number;
  categoriesCount: number;
  colorsCount: number;
  sizesCount: number;
  pendingOrders: number;
  completedOrders: number;
  featuredProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    amount: number;
    status: OrderStatus;
    createdAt: string;
  }>;
  latestProducts: Array<{
    id: string;
    name: string;
    categoryName: string;
    imageUrl: string | null;
    createdAt: string;
  }>;
}
