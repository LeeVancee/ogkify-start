import { createFileRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/shop/home/footer";
import Header from "@/components/shop/home/header";
import { sessionQueryOptions } from "@/lib/auth-query";
import { shopCartQueryOptions } from "@/lib/shop/query-options";

export const Route = createFileRoute("/(shop)")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(shopCartQueryOptions()),
      context.queryClient.ensureQueryData(sessionQueryOptions()),
    ]);
  },
});

function RouteComponent() {
  return (
    <div className=" min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
