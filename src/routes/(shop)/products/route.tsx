import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(shop)/products")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
