import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import {
  Grid,
  LayoutDashboard,
  Package,
  Palette,
  Ruler,
  ShoppingCart,
} from "lucide-react";
import type React from "react";

import { EnhancedSidebar } from "@/components/dashboard/layout/enhanced-sidebar";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/server/getSession";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    if (session.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const sections = [
    { path: "/dashboard/products", label: "Products", icon: Package },
    { path: "/dashboard/categories", label: "Categories", icon: Grid },
    { path: "/dashboard/colors", label: "Colors", icon: Palette },
    { path: "/dashboard/sizes", label: "Sizes", icon: Ruler },
    { path: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];
  const defaultSection = sections[sections.length - 1]!;
  const current =
    sections.find((section) => location.pathname.startsWith(section.path)) ??
    defaultSection;
  const CurrentIcon = current.icon;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
        } as React.CSSProperties
      }
    >
      <EnhancedSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="-ml-2 size-8" />
            <div className="flex min-w-0 items-center gap-2">
              <CurrentIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm font-semibold">
                {current.label}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
