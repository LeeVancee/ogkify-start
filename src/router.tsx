import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanstackRouter,  } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { NotFound } from './components/NotFound'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
// Create a new router instance
export const createRouter = () => {
  const queryClient = new QueryClient()
  return routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: { queryClient },
      scrollRestoration: true,
      defaultPreload: 'intent',
      defaultPendingMs: 0,
      defaultNotFoundComponent: () => <NotFound />,
      defaultErrorComponent: DefaultCatchBoundary,
    }),
    queryClient,
  )
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
