import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const getSession = createServerFn().handler(async () => {
  const { headers } = getWebRequest()

  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    return null
  }

  return session
})
