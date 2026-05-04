import {
  Archive,
  Box,
  ChartNoAxesCombined,
  Grid3X3,
  LayoutDashboard,
  Palette,
  Ruler,
  Settings,
  ShoppingCart,
} from "lucide-react";

export const dashboardNav = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", href: "/dashboard/products", icon: Box },
      { title: "Categories", href: "/dashboard/categories", icon: Grid3X3 },
      { title: "Colors", href: "/dashboard/colors", icon: Palette },
      { title: "Sizes", href: "/dashboard/sizes", icon: Ruler },
    ],
  },
  {
    label: "Operations",
    items: [{ title: "Orders", href: "/dashboard/orders", icon: ShoppingCart }],
  },
  {
    label: "Account",
    items: [{ title: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export const contextMetrics = [
  { label: "Revenue", icon: ChartNoAxesCombined },
  { label: "Catalog", icon: Archive },
];
