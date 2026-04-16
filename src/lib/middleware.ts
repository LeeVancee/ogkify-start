import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import { getSession } from "@/server/getSession";

export const authMiddleware = createMiddleware().server(
  async ({ next, request: _request }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    if (session.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
    return await next();
  },
);
