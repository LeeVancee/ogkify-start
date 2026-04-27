import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CartSheet } from "@/components/shop/cart-sheet";
import type { CartSheetData } from "@/components/shop/cart-sheet";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getUserCart } from "@/server/cart";

import { DropDown } from "../DropDown";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface Session {
  user: SessionUser;
}

interface HeaderProps {
  initialCartData: CartSheetData;
  initialSession?: Session;
}

export default function Header({
  initialCartData,
  initialSession,
}: HeaderProps) {
  const pathname = useLocation().pathname;
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const navigation = [
    { name: t("shop.header.allProducts"), href: "/products", search: {} },
    { name: t("shop.header.search"), href: "/search", search: {} },
  ];
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getUserCart(),
    initialData: initialCartData,
    staleTime: 1000 * 60 * 2,
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!searchQuery.trim()) return;

    navigate({
      to: "/search",
      search: { q: searchQuery.trim() },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="shop-shell">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            className="sm:hidden p-2 -ml-2 text-slate-500 transition-colors hover:text-slate-900"
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
            className="text-base font-bold tracking-widest text-slate-900 uppercase"
          >
            OGKIFY
          </Link>

          <nav className="hidden sm:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                search={item.search}
                className={cn(
                  "relative text-sm tracking-wide transition-colors hover:text-slate-900 pb-0.5",
                  pathname === item.href
                    ? "font-medium text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-slate-900 after:rounded-full"
                    : "text-slate-500",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="p-2 text-slate-500 transition-colors hover:text-slate-900 cursor-pointer"
              aria-label={t("shop.header.search")}
            >
              <Search className="h-5 w-5" />
            </button>

            {initialSession ? (
              <DropDown initialSession={initialSession} />
            ) : (
              <Link
                to="/login"
                className="p-2 text-slate-500 transition-colors hover:text-slate-900"
                aria-label={t("shop.header.account")}
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={cn(
                "relative rounded-full p-2 text-slate-500 transition-colors hover:text-slate-900 cursor-pointer",
                isCartOpen && "bg-slate-100 text-slate-900",
              )}
              aria-label={t("shop.header.cart")}
              aria-expanded={isCartOpen}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartData.totalItems ? (
                <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                  {cartData.totalItems}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder={t("shop.header.searchPlaceholder")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm focus-visible:ring-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label={t("common.actions.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {isMenuOpen ? (
          <nav className="space-y-0.5 border-t border-slate-100 bg-white px-1 py-3 sm:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                search={item.search}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm tracking-wide transition-colors",
                  pathname === item.href
                    ? "font-medium text-slate-900 bg-slate-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
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
        isLoading={isCartLoading}
        isError={isCartError}
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
      />
    </header>
  );
}
