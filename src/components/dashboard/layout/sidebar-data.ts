import {
  Grid,
  LayoutDashboard,
  Package,
  Palette,
  Ruler,
  ShoppingCart,
} from "lucide-react";

import type { NavGroup, SidebarBrand } from "./types";

const brand: SidebarBrand = {
  titleKey: "dashboard.brand.title",
  subtitleKey: "dashboard.brand.subtitle",
};

const navGroups: NavGroup[] = [
  {
    titleKey: "dashboard.nav.overview",
    items: [
      {
        titleKey: "dashboard.nav.dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    titleKey: "dashboard.nav.catalog",
    items: [
      {
        titleKey: "dashboard.nav.categories",
        url: "/dashboard/categories",
        icon: Grid,
      },
      {
        titleKey: "dashboard.nav.colors",
        url: "/dashboard/colors",
        icon: Palette,
      },
      {
        titleKey: "dashboard.nav.sizes",
        url: "/dashboard/sizes",
        icon: Ruler,
      },
      {
        titleKey: "dashboard.nav.products",
        url: "/dashboard/products",
        icon: Package,
      },
    ],
  },
  {
    titleKey: "dashboard.nav.operations",
    items: [
      {
        titleKey: "dashboard.nav.orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
      },
    ],
  },
];

export const sidebarData = {
  brand,
  navGroups,
};
