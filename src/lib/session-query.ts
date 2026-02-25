import { queryOptions } from "@tanstack/react-query";
import { getSession } from "@/server/getSession";

export const authOptions = queryOptions({
  queryKey: ["session"],
  queryFn: () => getSession(),
});
