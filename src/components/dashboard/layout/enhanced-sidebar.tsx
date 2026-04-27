import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type * as React from "react";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
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
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link to="/dashboard">
                  <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {t(sidebarData.brand.titleKey)}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {t(sidebarData.brand.subtitleKey)}
                    </span>
                  </div>
                </Link>
              }
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={sidebarData.navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2">
          <LanguageSwitcher />
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
