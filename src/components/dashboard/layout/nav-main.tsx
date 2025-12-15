import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
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
import { ActiveLink } from "../active-link";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: Array<{
    title: string;
    url: string;
  }>;
}

export function NavMain({ items }: { items: Array<NavItem> }) {
  const location = useLocation();

  const isActiveGroup = (item: NavItem) => {
    if (item.items?.some((subItem) => location.pathname === subItem.url))
      return true;
    // Only check startsWith for edit pages (URLs containing IDs)
    if (
      item.items?.some((subItem) => {
        const urlParts = location.pathname.split("/");
        const subItemParts = subItem.url.split("/");
        // Ensure base path matches and next segment is an ID (alphanumeric)
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
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // If there's no submenu or submenu items are empty
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={
                    <ActiveLink href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </ActiveLink>
                  }
                />
              </SidebarMenuItem>
            );
          }

          const isActive = isActiveGroup(item);

          // Case with submenu
          return (
            <Collapsible key={item.title} defaultOpen={isActive}>
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  }
                />
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          render={
                            <ActiveLink href={subItem.url} exact>
                              <span>{subItem.title}</span>
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
  );
}
