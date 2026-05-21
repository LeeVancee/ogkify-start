import { useQueryClient } from "@tanstack/react-query";
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
import { authQueryKeys } from "@/lib/auth-query";
import { useSessionQuery } from "@/lib/auth-hooks";
import { useI18n } from "@/lib/i18n";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export function DropDown() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const { session } = useSessionQuery();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          queryClient.setQueryData(authQueryKeys.session(), null);
          await queryClient.invalidateQueries({
            queryKey: authQueryKeys.session(),
          });
          navigate({ to: "/" });
        },
      },
    });
  };

  if (!session) {
    return (
      <Button variant="ghost" onClick={() => navigate({ to: "/login" })}>
        {t("shop.userMenu.login")}
      </Button>
    );
  }

  if (!session.user.name) {
    throw new Error("Authenticated user name is required");
  }

  if (!session.user.email) {
    throw new Error("Authenticated user email is required");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-9 w-9 rounded-lg p-0">
            <Avatar className="h-8 w-8">
              {session.user.image ? (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              ) : null}
              <AvatarFallback>
                {session.user.name[0].toUpperCase()}
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
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {session.user.role === "admin" && (
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
