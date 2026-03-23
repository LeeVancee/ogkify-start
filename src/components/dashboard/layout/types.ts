import type { LucideIcon } from "lucide-react";

type BaseNavItem = {
  title: string;
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
  title: string;
  items: NavItem[];
};

type SidebarBrand = {
  title: string;
  subtitle: string;
};

export type {
  BaseNavItem,
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  SidebarBrand,
};
