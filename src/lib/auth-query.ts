import { queryOptions } from "@tanstack/react-query";

import { getSession } from "@/server/getSession";

export const authQueryKeys = {
  session: () => ["auth", "session"] as const,
};

export function sessionQueryOptions() {
  return queryOptions({
    queryKey: authQueryKeys.session(),
    queryFn: () => getSession(),
    staleTime: 1000 * 60 * 5,
  });
}
