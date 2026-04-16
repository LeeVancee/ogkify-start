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
  title: "OGKIFY Admin",
  subtitle: "Commerce Control",
};

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Grid,
      },
      {
        title: "Colors",
        url: "/dashboard/colors",
        icon: Palette,
      },
      {
        title: "Sizes",
        url: "/dashboard/sizes",
        icon: Ruler,
      },
      {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Orders",
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
