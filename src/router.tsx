import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Create a new router instance
export const createRouter = () => {
  const queryClient = new QueryClient();

  const router = createTanstackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPendingMs: 0,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: DefaultCatchBoundary,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
