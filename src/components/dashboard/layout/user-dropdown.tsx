import { Link, useRouter } from "@tanstack/react-router";
import { LogOut, Settings, Store } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function DashboardUserDropdown() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: "/" });
        },
      },
    });
  };

  if (isPending || !session) {
    return (
      <Button variant="ghost" size="icon" disabled className="rounded-full">
        <div className="size-8 animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  const name = session.user.name || "Admin user";
  const email = session.user.email || "No email";
  const initial = name[0]?.toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="size-8">
              {session.user.image ? (
                <AvatarImage src={session.user.image} alt={name} />
              ) : null}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-9">
                {session.user.image ? (
                  <AvatarImage src={session.user.image} alt={name} />
                ) : null}
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">
                  {name}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {email}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link to="/dashboard/settings" />}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link to="/" />}>
          <Store className="size-4" />
          Back to Store
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
