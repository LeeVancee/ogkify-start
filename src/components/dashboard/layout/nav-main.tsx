import { useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";

import { ActiveLink } from "../active-link";
import type { NavGroup, NavItem } from "./types";

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const location = useLocation();
  const { t } = useI18n();

  const isActiveGroup = (item: NavItem) => {
    if (!("items" in item) || !item.items) {
      return false;
    }
    if (item.items.some((subItem) => location.pathname === subItem.url))
      return true;
    if (
      item.items.some((subItem) => {
        const urlParts = location.pathname.split("/");
        const subItemParts = subItem.url.split("/");
        return (
          urlParts.length > subItemParts.length &&
          location.pathname.startsWith(subItem.url + "/") &&
          /^[a-zA-Z0-9]+$/.test(urlParts[subItemParts.length])
        );
      })
    )
      return true;
    return false;
  };

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.titleKey}>
          <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              if (
                !("items" in item) ||
                !item.items ||
                item.items.length === 0
              ) {
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      render={
                        <ActiveLink href={item.url} exact>
                          {item.icon && <item.icon />}
                          <span>{t(item.titleKey)}</span>
                        </ActiveLink>
                      }
                    />
                  </SidebarMenuItem>
                );
              }

              const isActive = isActiveGroup(item);

              return (
                <Collapsible key={item.titleKey} defaultOpen={isActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton tooltip={t(item.titleKey)}>
                          {item.icon && <item.icon />}
                          <span>{t(item.titleKey)}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      }
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.titleKey}>
                            <SidebarMenuSubButton
                              render={
                                <ActiveLink href={subItem.url} exact>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{t(subItem.titleKey)}</span>
                                </ActiveLink>
                              }
                            />
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
