import { useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, ShoppingBag, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface Session {
  user: SessionUser;
}

interface DropDownProps {
  initialSession?: Session;
}

export function DropDown({ initialSession }: DropDownProps = {}) {
  const navigate = useNavigate();
  const { t } = useI18n();

  // If no initial session data is passed, fetch on client side (compatible with other pages)
  const { data: session, isPending } = authClient.useSession();

  // Prioritize server-side preloaded session data
  const currentSession = initialSession || session;

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/" });
        },
      },
    });
  };

  if (!initialSession && isPending) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback />
        </Avatar>
      </Button>
    );
  }

  if (!currentSession) {
    return (
      <Button variant="ghost" onClick={() => navigate({ to: "/login" })}>
        {t("shop.userMenu.login")}
      </Button>
    );
  }

  if (!currentSession.user.name) {
    throw new Error("Authenticated user name is required");
  }

  if (!currentSession.user.email) {
    throw new Error("Authenticated user email is required");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {currentSession.user.image ? (
                <AvatarImage
                  src={currentSession.user.image}
                  alt={currentSession.user.name}
                />
              ) : null}
              <AvatarFallback>
                {currentSession.user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal text-black">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {currentSession.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentSession.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {currentSession.user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t("shop.userMenu.dashboard")}
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={() => navigate({ to: "/myorders" })}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {t("shop.userMenu.myOrders")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
          <User className="mr-2 h-4 w-4" />
          {t("shop.userMenu.profile")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("shop.userMenu.logout")}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
