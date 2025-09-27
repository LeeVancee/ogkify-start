import { useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, ShoppingBag, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface DropDownProps {
  initialSession?: any;
}

export function DropDown({ initialSession }: DropDownProps = {}) {
  const navigate = useNavigate();

  // 如果没有传入初始会话数据，则使用客户端获取（兼容其他页面）
  const { data: session, isPending } = authClient.useSession();

  // 优先使用服务端预加载的会话数据
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
        login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentSession.user.image || ""}
              alt={currentSession.user.name || ""}
            />
            <AvatarFallback>
              {currentSession.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentSession.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentSession.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        {currentSession.user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={() => navigate({ to: "/myorders" })}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          My Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
