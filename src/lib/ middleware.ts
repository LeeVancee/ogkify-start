import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getSession } from "@/server/getSession.server";
import { auth } from "./auth";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
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
