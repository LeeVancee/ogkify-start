import { getSession } from "./getSession";

export async function requireAdminSession() {
  const session = await getSession();

  if (!session?.user.id) {
    return {
      ok: false as const,
      error: "Unauthorized",
    };
  }

  if (session.user.role !== "admin") {
    return {
      ok: false as const,
      error: "Forbidden",
    };
  }

  return {
    ok: true as const,
    session,
  };
}
