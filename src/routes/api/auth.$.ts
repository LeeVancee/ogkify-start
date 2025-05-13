import { auth } from '@/lib/auth'

export const ServerRoute = createServerFileRoute().methods({
  GET: ({ request }: { request: any }) => {
    return auth.handler(request)
  },
  POST: ({ request }: { request: any }) => {
    return auth.handler(request)
  },
})
