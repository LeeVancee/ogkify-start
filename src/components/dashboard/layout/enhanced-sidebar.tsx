import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { sidebarData } from "./sidebar-data";

export function EnhancedSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { t } = useI18n();

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0" {...props}>
      <SidebarHeader className="px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center justify-between gap-2">
              <SidebarMenuButton
                size="lg"
                className="h-9 flex-1 px-1.5"
                render={
                  <Link to="/dashboard">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                      <ShoppingBag className="size-3.5" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {t(sidebarData.brand.titleKey)}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {t(sidebarData.brand.subtitleKey)}
                      </span>
                    </div>
                  </Link>
                }
              />
              <Button variant="ghost" size="icon" className="size-7 shrink-0">
                <Search className="size-3.5" />
                <span className="sr-only">Search dashboard</span>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain groups={sidebarData.navGroups} />
      </SidebarContent>
      <SidebarFooter className="px-2 pb-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
