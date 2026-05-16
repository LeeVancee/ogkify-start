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
    labelKey: "dashboard.nav.overview",
    items: [
      {
        titleKey: "dashboard.nav.dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    labelKey: "dashboard.nav.catalog",
    items: [
      {
        titleKey: "dashboard.nav.products",
        href: "/dashboard/products",
        icon: Box,
      },
      {
        titleKey: "dashboard.nav.categories",
        href: "/dashboard/categories",
        icon: Grid3X3,
      },
      {
        titleKey: "dashboard.nav.colors",
        href: "/dashboard/colors",
        icon: Palette,
      },
      {
        titleKey: "dashboard.nav.sizes",
        href: "/dashboard/sizes",
        icon: Ruler,
      },
    ],
  },
  {
    labelKey: "dashboard.nav.operations",
    items: [
      {
        titleKey: "dashboard.nav.orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    labelKey: "dashboard.nav.account",
    items: [
      {
        titleKey: "dashboard.nav.settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export const contextMetrics = [
  { label: "Revenue", icon: ChartNoAxesCombined },
  { label: "Catalog", icon: Archive },
];
