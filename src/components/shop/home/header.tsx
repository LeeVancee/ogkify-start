import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DropDown } from "../DropDown";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },

  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
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
  initialCartData?: {
    items: Array<CartItem>;
    totalItems: number;
  };
  initialSession?: Session;
}

export default function Header({
  initialCartData,
  initialSession,
}: HeaderProps = {}) {
  const pathname = useLocation().pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate({
        to: "/search",
        search: { q: searchQuery.trim() },
      });
    }
  };

  // Use server-side preloaded data directly
  const cartData = initialCartData || { items: [], totalItems: 0 };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6">
                <Link
                  to="/"
                  className="text-xl font-bold text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  OGKIFY
                </Link>
                <div className="grid gap-4">
                  {navigation.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "text-lg font-medium",
                          pathname === item.href ? "text-primary" : "",
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="ml-4 md:ml-0 text-xl font-bold text-primary">
            OGKIFY
          </Link>

          <nav className="hidden md:flex ml-10 gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "font-medium hover:text-primary transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-full max-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <DropDown initialSession={initialSession} />

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartData?.totalItems ? (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {cartData.totalItems}
              </span>
            ) : null}
            <span className="sr-only">Open Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
