import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const getSession = createServerFn().handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers });

  if (!session) return null;

  return session;
});

export const authOptions = queryOptions({
  queryKey: ["session"],
  queryFn: () => getSession(),
});
