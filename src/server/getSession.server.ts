import { createServerFn } from '@tanstack/react-start'
import { auth } from '@/lib/auth'
import { getWebRequest } from '@tanstack/react-start/server'

export const getSession = createServerFn().handler(async () => {
  const { headers } = getWebRequest()!

  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    return null
  }

  return session
})
