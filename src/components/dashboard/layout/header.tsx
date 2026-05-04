import { Link, useLocation } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { dashboardNav } from "./nav-data";
import { DashboardUserDropdown } from "./user-dropdown";

function currentTitle(pathname: string) {
  for (const group of dashboardNav) {
    for (const item of group.items) {
      if (item.href === "/dashboard" && pathname === item.href) {
        return item.title;
      }
      if (item.href !== "/dashboard" && pathname.startsWith(item.href)) {
        return item.title;
      }
    }
  }
  return "Dashboard";
}

export function DashboardHeader() {
  const { pathname } = useLocation();
  const title = currentTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex w-full items-center gap-2 border-b bg-card px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
      <SidebarTrigger className="-ml-1 sm:-ml-2" />

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="hidden truncate text-xs text-muted-foreground sm:block">
          <Link to="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          {pathname !== "/dashboard" ? ` / ${title}` : ""}
        </div>
      </div>

      <div className="relative hidden w-full max-w-xs md:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search admin..." className="h-9 bg-card pl-9" />
      </div>

      <DashboardUserDropdown />
    </header>
  );
}
