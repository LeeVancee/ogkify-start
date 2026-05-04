import { queryOptions } from "@tanstack/react-query";

import { listAdminOrders } from "@/server/admin/orders";
import { getDashboardOverview } from "@/server/admin/overview";
import {
  getAdminProductDetail,
  getAdminProductFormData,
  listAdminProducts,
} from "@/server/admin/products";
import {
  getAdminCategoryDetail,
  getAdminColorDetail,
  getAdminSizeDetail,
  listAdminCategories,
  listAdminColors,
  listAdminSizes,
} from "@/server/admin/resources";
import { getSession } from "@/server/getSession";

export const adminQueryKeys = {
  all: ["admin"] as const,
  overview: () => [...adminQueryKeys.all, "overview"] as const,
  session: () => [...adminQueryKeys.all, "session"] as const,
  products: () => [...adminQueryKeys.all, "products"] as const,
  product: (id: string) => [...adminQueryKeys.products(), id] as const,
  productFormData: () => [...adminQueryKeys.products(), "form-data"] as const,
  categories: () => [...adminQueryKeys.all, "categories"] as const,
  category: (id: string) => [...adminQueryKeys.categories(), id] as const,
  colors: () => [...adminQueryKeys.all, "colors"] as const,
  color: (id: string) => [...adminQueryKeys.colors(), id] as const,
  sizes: () => [...adminQueryKeys.all, "sizes"] as const,
  size: (id: string) => [...adminQueryKeys.sizes(), id] as const,
  orders: () => [...adminQueryKeys.all, "orders"] as const,
};

export function dashboardOverviewQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.overview(),
    queryFn: () => getDashboardOverview(),
  });
}

export function adminSessionQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.session(),
    queryFn: () => getSession(),
  });
}

export function adminProductsQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.products(),
    queryFn: () => listAdminProducts(),
  });
}

export function adminProductQueryOptions(id: string) {
  return queryOptions({
    queryKey: adminQueryKeys.product(id),
    queryFn: () => getAdminProductDetail({ data: id }),
  });
}

export function adminProductFormDataQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.productFormData(),
    queryFn: () => getAdminProductFormData(),
  });
}

export function adminCategoriesQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.categories(),
    queryFn: () => listAdminCategories(),
  });
}

export function adminCategoryQueryOptions(id: string) {
  return queryOptions({
    queryKey: adminQueryKeys.category(id),
    queryFn: () => getAdminCategoryDetail({ data: id }),
  });
}

export function adminColorsQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.colors(),
    queryFn: () => listAdminColors(),
  });
}

export function adminColorQueryOptions(id: string) {
  return queryOptions({
    queryKey: adminQueryKeys.color(id),
    queryFn: () => getAdminColorDetail({ data: id }),
  });
}

export function adminSizesQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.sizes(),
    queryFn: () => listAdminSizes(),
  });
}

export function adminSizeQueryOptions(id: string) {
  return queryOptions({
    queryKey: adminQueryKeys.size(id),
    queryFn: () => getAdminSizeDetail({ data: id }),
  });
}

export function adminOrdersQueryOptions() {
  return queryOptions({
    queryKey: adminQueryKeys.orders(),
    queryFn: () => listAdminOrders(),
  });
}
