import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DropDown } from "../DropDown";

const navigation = [
  { name: "All Products", href: "/products", search: {} },
  { name: "Search", href: "/search", search: {} },
];

interface CartItem {
  id: string;
  [key: string]: unknown;
}

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
  initialCartData: {
    items: Array<CartItem>;
    totalItems: number;
  };
  initialSession?: Session;
}

export default function Header({
  initialCartData,
  initialSession,
}: HeaderProps) {
  const pathname = useLocation().pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!searchQuery.trim()) {
      throw new Error("Search query is required");
    }

    navigate({
      to: "/search",
      search: { q: searchQuery.trim() },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="shop-shell">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            className="sm:hidden p-2 -ml-2 text-foreground/70 transition-colors hover:text-foreground"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
            OGKI<span className="font-light">FY</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                search={item.search}
                className={cn(
                  "text-sm tracking-wide transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="p-2 text-foreground/70 transition-colors hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {initialSession ? (
              <DropDown initialSession={initialSession} />
            ) : (
              <Link
                to="/login"
                className="p-2 text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2 text-foreground/70 transition-colors hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {initialCartData.totalItems ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  {initialCartData.totalItems}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {searchOpen ? (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-lg border-0 bg-muted/50 py-2.5 pl-10 pr-4 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {isMenuOpen ? (
          <nav className="space-y-1 border-t border-border bg-background px-1 py-4 sm:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                search={item.search}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block py-2.5 text-sm tracking-wide transition-colors",
                  pathname === item.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
