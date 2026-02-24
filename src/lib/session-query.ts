import { queryOptions } from "@tanstack/react-query";
import { getSession } from "@/server/getSession.server";

export const authOptions = queryOptions({
  queryKey: ["session"],
  queryFn: () => getSession(),
});
