import type { Category } from "@/lib/types";

export interface SearchParams {
  category?: string;
  sort?: string;
  featured?: boolean;
  minPrice?: string;
  maxPrice?: string;
  color?: string | Array<string>;
  size?: string | Array<string>;
  [key: string]: any;
}

export interface FilterProps {
  categories: Array<Category>;
  colors?: Array<{ id: string; name: string; value: string }>;
  sizes?: Array<{ id: string; name: string; value: string }>;
  maxPrice?: number;
}

export function createQueryParams(
  search: SearchParams,
  params: Record<string, string | Array<string> | boolean | null | undefined>,
): SearchParams {
  const newParams = { ...search } as SearchParams;

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      delete newParams[key];
    } else {
      newParams[key] = value;
    }
  }

  return newParams;
}

export function normalizeArray(
  value: string | Array<string> | undefined,
): Array<string> {
  return Array.isArray(value) ? value : value ? [value] : [];
}
