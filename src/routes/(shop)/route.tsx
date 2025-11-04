import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/shop/home/footer";
import Header from "@/components/shop/home/header";
import { getUserCart } from "@/server/cart.server";
import { getSession } from "@/server/getSession.server";

export const Route = createFileRoute("/(shop)")({
  component: RouteComponent,
  loader: async () => {
    // Fetch all data needed for Header in parallel
    const [cartData, session] = await Promise.all([
      getUserCart(),
      getSession(),
    ]);

    return {
      initialCartData: cartData,
      initialSession: session || undefined,
    };
  },
});

function RouteComponent() {
  const { initialCartData, initialSession } = Route.useLoaderData();

  return (
    <div className=" min-h-screen flex flex-col">
      <Header
        initialCartData={initialCartData}
        initialSession={initialSession}
      />
      <main className="flex-1  container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
