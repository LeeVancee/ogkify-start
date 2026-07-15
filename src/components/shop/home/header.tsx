import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CartSheet } from "@/components/shop/cart-sheet";
import { useI18n } from "@/lib/i18n";
import { shopCartQueryOptions } from "@/lib/shop/query-options";
import { cn } from "@/lib/utils";

import { DropDown } from "../DropDown";

export default function Header() {
  const pathname = useLocation().pathname;
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigation = [
    { name: t("shop.header.allProducts"), href: "/products", search: {} },
  ];
  const mobileNavigation = [
    ...navigation,
    { name: t("shop.header.search"), href: "/search", search: {} },
  ];
  const { data: cartData } = useSuspenseQuery(shopCartQueryOptions());

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl">
      <div className="shop-shell">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            className="-ml-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={t("shop.header.toggleMenu")}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link
            to="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-[0.12em] text-foreground uppercase"
            aria-label="OGKIFY"
          >
            <span className="flex size-8 items-center justify-center rounded-[0.65rem] bg-foreground text-background shadow-[0_5px_18px_rgba(57,48,38,0.16)] transition-transform duration-200 group-hover:-rotate-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M5 6.5 12 3l7 3.5v10L12 21l-7-4.5z" />
                <path d="m5 6.5 7 4 7-4M12 10.5V21" />
              </svg>
            </span>
            <span>OGKIFY</span>
          </Link>

          <nav className="hidden items-center gap-8 sm:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                search={item.search}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageSwitcher />

            <Link
              to="/search"
              search={{}}
              className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:translate-y-px sm:flex"
              aria-label={t("shop.header.search")}
            >
              <Search className="h-5 w-5" />
            </Link>

            <DropDown />

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={cn(
                "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isCartOpen && "bg-muted text-foreground",
              )}
              aria-label={t("shop.header.cart")}
              aria-expanded={isCartOpen}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartData.totalItems ? (
                <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-semibold text-background">
                  {cartData.totalItems}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <nav className="space-y-0.5 border-t border-border bg-background px-1 py-3 sm:hidden">
            {mobileNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                search={item.search}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm tracking-wide transition-colors",
                  pathname === item.href
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <CartSheet
        cartData={cartData}
        isLoading={false}
        isError={false}
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
      />
    </header>
  );
}
