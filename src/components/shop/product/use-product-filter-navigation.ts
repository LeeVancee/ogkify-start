import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";

import { createQueryParams, type SearchParams } from "./filter-types";

export function useProductFilterNavigation() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as SearchParams;
  const [, startTransition] = useTransition();

  const updateSearch = (
    params: Record<string, string | Array<string> | boolean | null | undefined>,
  ) => {
    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams(search, params),
        replace: true,
      });
    });
  };

  const resetSearch = () => {
    startTransition(() => {
      navigate({
        to: "/products",
        search: {},
        replace: true,
      });
    });
  };

  return {
    search,
    updateSearch,
    resetSearch,
  };
}
