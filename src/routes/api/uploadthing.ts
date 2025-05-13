import { createRouteHandler } from 'uploadthing/server'

import { ourFileRouter } from '@/server/uploadthing'

const handlers = createRouteHandler({ router: ourFileRouter })
export const ServerRoute = createServerFileRoute().methods({
  GET: handlers,
  POST: handlers,
})
