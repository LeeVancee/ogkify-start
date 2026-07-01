import { defineRelations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Enum definitions
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "COMPLETED",
  "CANCELLED",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "UNPAID",
  "PAID",
  "REFUNDED",
  "FAILED",
]);

// Model definitions
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  value: varchar("value").notNull(), // Hex code
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  value: varchar("value").notNull(), // e.g., "S", "M", "L", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: varchar("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  phone: varchar("phone"),
  shippingAddress: text("shipping_address"),
  paymentMethod: varchar("payment_method"),
  paymentIntent: varchar("payment_intent"),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("UNPAID")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(), // Price at time of order
  colorId: uuid("color_id").references(() => colors.id),
  sizeId: uuid("size_id").references(() => sizes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").default(1).notNull(),
  colorId: uuid("color_id").references(() => colors.id),
  sizeId: uuid("size_id").references(() => sizes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: varchar("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: varchar("account_id").notNull(),
  providerId: varchar("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: varchar("identifier").notNull(),
  value: varchar("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Many-to-many relationship tables
export const productsToColors = pgTable("products_to_colors", {
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  colorId: uuid("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "cascade" }),
});

export const productsToSizes = pgTable("products_to_sizes", {
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: uuid("size_id")
    .notNull()
    .references(() => sizes.id, { onDelete: "cascade" }),
});

// Relationship definitions
const tables = {
  account,
  cartItems,
  carts,
  categories,
  colors,
  images,
  orderItems,
  orders,
  products,
  productsToColors,
  productsToSizes,
  session,
  sizes,
  user,
  verification,
};

export const relations = defineRelations(tables, (r) => ({
  categories: {
    products: r.many.products(),
  },
  colors: {
    products: r.many.productsToColors({ alias: "colors_to_products" }),
    cartItems: r.many.cartItems(),
    orderItems: r.many.orderItems(),
  },
  sizes: {
    products: r.many.productsToSizes({ alias: "sizes_to_products" }),
    cartItems: r.many.cartItems(),
    orderItems: r.many.orderItems(),
  },
  products: {
    category: r.one.categories({
      from: r.products.categoryId,
      to: r.categories.id,
      optional: false,
    }),
    colors: r.many.productsToColors({ alias: "products_to_colors" }),
    sizes: r.many.productsToSizes({ alias: "products_to_sizes" }),
    orderItems: r.many.orderItems(),
    cartItems: r.many.cartItems(),
    images: r.many.images(),
  },
  orders: {
    user: r.one.user({
      from: r.orders.userId,
      to: r.user.id,
      optional: false,
    }),
    items: r.many.orderItems(),
  },
  orderItems: {
    order: r.one.orders({
      from: r.orderItems.orderId,
      to: r.orders.id,
      optional: false,
    }),
    product: r.one.products({
      from: r.orderItems.productId,
      to: r.products.id,
      optional: false,
    }),
    color: r.one.colors({
      from: r.orderItems.colorId,
      to: r.colors.id,
    }),
    size: r.one.sizes({
      from: r.orderItems.sizeId,
      to: r.sizes.id,
    }),
  },
  images: {
    product: r.one.products({
      from: r.images.productId,
      to: r.products.id,
      optional: false,
    }),
  },
  carts: {
    user: r.one.user({
      from: r.carts.userId,
      to: r.user.id,
      optional: false,
    }),
    items: r.many.cartItems(),
  },
  cartItems: {
    cart: r.one.carts({
      from: r.cartItems.cartId,
      to: r.carts.id,
      optional: false,
    }),
    product: r.one.products({
      from: r.cartItems.productId,
      to: r.products.id,
      optional: false,
    }),
    color: r.one.colors({
      from: r.cartItems.colorId,
      to: r.colors.id,
    }),
    size: r.one.sizes({
      from: r.cartItems.sizeId,
      to: r.sizes.id,
    }),
  },
  user: {
    orders: r.many.orders(),
    carts: r.many.carts(),
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  productsToColors: {
    product: r.one.products({
      from: r.productsToColors.productId,
      to: r.products.id,
      alias: "products_to_colors",
      optional: false,
    }),
    color: r.one.colors({
      from: r.productsToColors.colorId,
      to: r.colors.id,
      alias: "colors_to_products",
      optional: false,
    }),
  },
  productsToSizes: {
    product: r.one.products({
      from: r.productsToSizes.productId,
      to: r.products.id,
      alias: "products_to_sizes",
      optional: false,
    }),
    size: r.one.sizes({
      from: r.productsToSizes.sizeId,
      to: r.sizes.id,
      alias: "sizes_to_products",
      optional: false,
    }),
  },
}));
