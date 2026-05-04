import { queryOptions } from "@tanstack/react-query";

import { getUserCart } from "@/server/cart";
import { getCategories } from "@/server/categories";
import { getFeaturedProducts } from "@/server/get-featured-products";
import {
  type FilterOptions,
  getFilteredProducts,
} from "@/server/get-filtered-products";
import {
  getCheckoutOrder,
  getOrderById,
  getUnpaidOrders,
  getUserOrders,
} from "@/server/orders";
import { getProduct, getRelatedProducts } from "@/server/product-shop";
import { searchProducts } from "@/server/search";

export const shopQueryKeys = {
  all: ["shop"] as const,
  cart: () => [...shopQueryKeys.all, "cart"] as const,
  categories: () => [...shopQueryKeys.all, "categories"] as const,
  featuredProducts: (limit: number) =>
    [...shopQueryKeys.all, "featured-products", limit] as const,
  filteredProducts: (filters: NormalizedFilterOptions) =>
    [...shopQueryKeys.all, "filtered-products", filters] as const,
  product: (productId: string) =>
    [...shopQueryKeys.all, "product", productId] as const,
  relatedProducts: (productId: string, categoryId: string) =>
    [...shopQueryKeys.all, "related-products", productId, categoryId] as const,
  searchResults: (query: string) =>
    [...shopQueryKeys.all, "search", query] as const,
  orders: {
    all: () => [...shopQueryKeys.all, "orders"] as const,
    user: () => [...shopQueryKeys.orders.all(), "all"] as const,
    unpaid: () => [...shopQueryKeys.orders.all(), "unpaid"] as const,
    detail: (orderId: string) =>
      [...shopQueryKeys.orders.all(), "detail", orderId] as const,
    checkout: (orderId: string) =>
      [...shopQueryKeys.orders.all(), "checkout", orderId] as const,
  },
};

type NormalizedFilterOptions = {
  category?: string;
  sort?: string;
  search?: string;
  featured: boolean;
  minPrice?: number;
  maxPrice?: number;
  colors?: Array<string>;
  sizes?: Array<string>;
  page: number;
  limit: number;
};

function normalizeFilterOptions(
  options: FilterOptions = {},
): NormalizedFilterOptions {
  return {
    category: options.category,
    sort: options.sort,
    search: options.search,
    featured: options.featured ?? false,
    minPrice: options.minPrice,
    maxPrice: options.maxPrice,
    colors: options.colors?.length ? options.colors : undefined,
    sizes: options.sizes?.length ? options.sizes : undefined,
    page: options.page ?? 1,
    limit: options.limit ?? 12,
  };
}

export function shopCartQueryOptions() {
  return queryOptions({
    queryKey: shopQueryKeys.cart(),
    queryFn: () => getUserCart(),
    staleTime: 1000 * 60 * 2,
  });
}

export function shopCategoriesQueryOptions() {
  return queryOptions({
    queryKey: shopQueryKeys.categories(),
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 30,
  });
}

export function shopFeaturedProductsQueryOptions(limit: number) {
  return queryOptions({
    queryKey: shopQueryKeys.featuredProducts(limit),
    queryFn: () => getFeaturedProducts({ data: limit }),
    staleTime: 1000 * 60 * 30,
  });
}

export function shopFilteredProductsQueryOptions(options: FilterOptions = {}) {
  const normalizedOptions = normalizeFilterOptions(options);

  return queryOptions({
    queryKey: shopQueryKeys.filteredProducts(normalizedOptions),
    queryFn: () => getFilteredProducts({ data: normalizedOptions }),
    staleTime: 1000 * 60 * 10,
  });
}

export function shopProductQueryOptions(productId: string) {
  return queryOptions({
    queryKey: shopQueryKeys.product(productId),
    queryFn: () => getProduct({ data: productId }),
    staleTime: 1000 * 60 * 15,
  });
}

export function shopRelatedProductsQueryOptions(
  productId: string,
  categoryId: string,
) {
  return queryOptions({
    queryKey: shopQueryKeys.relatedProducts(productId, categoryId),
    queryFn: () =>
      getRelatedProducts({ data: { productId, category: categoryId } }),
    staleTime: 1000 * 60 * 15,
  });
}

export function shopSearchResultsQueryOptions(query: string) {
  return queryOptions({
    queryKey: shopQueryKeys.searchResults(query),
    queryFn: () => searchProducts({ data: query }),
    staleTime: 1000 * 60 * 5,
  });
}

export function shopUserOrdersQueryOptions() {
  return queryOptions({
    queryKey: shopQueryKeys.orders.user(),
    queryFn: () => getUserOrders({}),
    staleTime: 1000 * 60 * 3,
  });
}

export function shopUnpaidOrdersQueryOptions() {
  return queryOptions({
    queryKey: shopQueryKeys.orders.unpaid(),
    queryFn: () => getUnpaidOrders({}),
    staleTime: 1000 * 60 * 3,
  });
}

export function shopCheckoutOrderQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: shopQueryKeys.orders.checkout(orderId),
    queryFn: () => getCheckoutOrder({ data: orderId }),
    staleTime: 1000 * 60,
  });
}

export function shopOrderDetailQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: shopQueryKeys.orders.detail(orderId),
    queryFn: () => getOrderById({ data: orderId }),
    retry: 1,
    refetchInterval: (query) => {
      const result = query.state.data;
      const order = result?.order;

      if (!result?.success || !order) {
        return false;
      }

      return order?.paymentStatus === "PAID" ? false : 2000;
    },
    refetchIntervalInBackground: true,
    staleTime: 1000 * 60 * 10,
  });
}
