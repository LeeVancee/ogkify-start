import AuthScreen from '@/components/auth/components/auth-screen'
import { getSession } from '@/server/getSession.server'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return <AuthScreen />
}
