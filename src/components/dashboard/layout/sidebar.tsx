import { Link, useLocation } from "@tanstack/react-router";
import { HardDrive, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { dashboardNav } from "./nav-data";

export function DashboardSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="lg:border-r-0!" collapsible="offcanvas">
      <SidebarHeader className="p-4 pb-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500">
            <HardDrive className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-base font-semibold">
              Square Admin
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              OGKIFY workspace
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-6">
        <Button
          render={<Link to="/dashboard/products/new" />}
          className="mb-4 w-full gap-2"
        >
          <Plus className="size-4" />
          New Product
        </Button>

        {dashboardNav.map((group) => (
          <SidebarGroup key={group.label} className="mt-4 p-0 first:mt-0">
            <SidebarGroupLabel className="h-4 pb-4 pt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link to={item.href} />}
                        isActive={isActive}
                        className="h-9"
                      >
                        <Icon className="size-4" />
                        <span className="text-sm">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-xl border bg-card p-3">
          <div className="text-sm font-medium">Admin migration</div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            New UI shell with OGKIFY data adapters.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
