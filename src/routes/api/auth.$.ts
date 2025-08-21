import { createServerFileRoute } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: ({ request }: { request: any }) => {
    return auth.handler(request);
  },
  POST: ({ request }: { request: any }) => {
    return auth.handler(request);
  },
});
