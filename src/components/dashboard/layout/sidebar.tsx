import { Link, useLocation } from "@tanstack/react-router";
import { Circle } from "lucide-react";

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
      <SidebarHeader className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Circle className="size-3.5 fill-current" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">
              {t("dashboard.shell.workspaceTitle")}
            </span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              Admin workspace
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-8">
        {dashboardNav.map((group) => (
          <SidebarGroup key={group.labelKey} className="mt-6 p-0 first:mt-0">
            <SidebarGroupLabel className="h-5 px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
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
                        className="h-9 rounded-md px-3 text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-none"
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
