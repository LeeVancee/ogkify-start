import { createFileRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/shop/home/footer";
import Header from "@/components/shop/home/header";
import { shopCartQueryOptions } from "@/lib/shop/query-options";

export const Route = createFileRoute("/(shop)")({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(shopCartQueryOptions()),
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <div className=" min-h-screen flex flex-col">
      <Header initialSession={session} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
