import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CartSheet } from "@/components/shop/cart-sheet";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { shopCartQueryOptions } from "@/lib/shop/query-options";
import { cn } from "@/lib/utils";

import { DropDown } from "../DropDown";

export default function Header() {
  const pathname = useLocation().pathname;
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: cartData } = useSuspenseQuery(shopCartQueryOptions());
  const navigation = [
    { name: t("shop.header.allProducts"), href: "/products", search: {} },
    {
      name: t("shop.home.newArrivals"),
      href: "/products",
      search: { sort: "newest" },
    },
    {
      name: t("shop.footer.featured"),
      href: "/products",
      search: { featured: true },
    },
  ] as const;
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="shop-shell">
          <div className="flex h-20 items-center justify-between gap-5">
            <div className="flex items-center gap-3 sm:gap-12">
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 sm:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={t("shop.header.toggleMenu")}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
              <Link to="/" className="store-wordmark" aria-label="OGKIFY 首頁">
                ogkify
              </Link>
              <nav
                aria-label={t("shop.footer.shop")}
                className="hidden items-center gap-7 sm:flex"
              >
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    search={item.search}
                    className={cn(
                      "py-3 text-[13px] transition-colors hover:text-foreground",
                      pathname === item.href && index === 0
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="hidden lg:block">
                <LanguageSwitcher shop />
              </div>
              <Link
                to="/search"
                search={{}}
                className="flex size-9 items-center justify-center transition-colors hover:bg-muted"
                aria-label={t("shop.header.search")}
              >
                <Search className="size-[19px]" strokeWidth={1.5} />
              </Link>
              <DropDown />
              <Button
                variant="ghost"
                className="gap-2 px-2"
                onClick={() => setIsCartOpen(true)}
                aria-label={t("shop.header.cart")}
                aria-expanded={isCartOpen}
              >
                <ShoppingBag className="size-[19px]" strokeWidth={1.5} />
                <span className="text-xs tabular-nums">
                  ({cartData.totalItems})
                </span>
              </Button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="space-y-1 border-t border-border py-4 sm:hidden">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  search={item.search}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-3 text-sm hover:bg-muted"
                >
                  {item.name}
                </Link>
              ))}
              <LanguageSwitcher shop />
            </nav>
          )}
        </div>
      </header>
      <CartSheet
        cartData={cartData}
        isLoading={false}
        isError={false}
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
      />
    </>
  );
}
