import { Link, useLocation } from "@tanstack/react-router";
import { HardDrive, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";

import { dashboardNav } from "./nav-data";

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  return (
    <Sidebar className="lg:border-r-0!" collapsible="offcanvas">
      <SidebarHeader className="p-4 pb-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500">
            <HardDrive className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-base font-semibold">
              {t("dashboard.shell.workspaceTitle")}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {t("dashboard.shell.workspaceSubtitle")}
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
          {t("dashboard.shell.newProduct")}
        </Button>

        {dashboardNav.map((group) => (
          <SidebarGroup key={group.labelKey} className="mt-4 p-0 first:mt-0">
            <SidebarGroupLabel className="h-4 pb-4 pt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              {t(group.labelKey)}
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
                        <span className="text-sm">{t(item.titleKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
}
