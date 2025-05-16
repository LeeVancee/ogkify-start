import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'

import { ActiveLink } from './active-link'
import type { LucideIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: Array<{
    title: string
    url: string
  }>
}

export function NavMain({ items }: { items: Array<NavItem> }) {
  const location = useLocation()

  const isActiveGroup = (item: NavItem) => {
    if (item.items?.some((subItem) => location.pathname === subItem.url))
      return true
    // 只在编辑页面（即URL包含ID的情况）才检查startsWith
    if (
      item.items?.some((subItem) => {
        const urlParts = location.pathname.split('/')
        const subItemParts = subItem.url.split('/')
        // 确保基础路径相同，且下一段是ID（数字或字母）
        return (
          urlParts.length > subItemParts.length &&
          location.pathname.startsWith(subItem.url + '/') &&
          /^[a-zA-Z0-9]+$/.test(urlParts[subItemParts.length])
        )
      })
    )
      return true
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // 如果没有子菜单或子菜单项为空
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          const isActive = isActiveGroup(item)

          // 有子菜单的情况
          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <ActiveLink href={subItem.url} exact>
                            <span>{subItem.title}</span>
                          </ActiveLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
