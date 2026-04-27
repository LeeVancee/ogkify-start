import type { LucideIcon } from "lucide-react";

type BaseNavItem = {
  titleKey: string;
  badge?: string;
  icon?: LucideIcon;
};

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: Array<
    BaseNavItem & {
      url: string;
    }
  >;
  url?: never;
};

type NavItem = NavLink | NavCollapsible;

type NavGroup = {
  titleKey: string;
  items: NavItem[];
};

type SidebarBrand = {
  titleKey: string;
  subtitleKey: string;
};

export type {
  BaseNavItem,
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  SidebarBrand,
};
