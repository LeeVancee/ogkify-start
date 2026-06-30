import { useQuery } from "@tanstack/react-query";

import { sessionQueryOptions } from "@/lib/auth-query";

export function useSessionQuery() {
  const { data: session, isPending } = useQuery(sessionQueryOptions());

  return { session, isPending };
}
