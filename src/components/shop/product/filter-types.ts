import type { Category } from "@/lib/types";

export interface SearchParams {
  category?: string;
  sort?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  color?: string | Array<string>;
  size?: string | Array<string>;
  [key: string]: string | number | Array<string> | boolean | undefined;
}

export interface FilterProps {
  categories: Array<Category>;
  colors?: Array<{ id: string; name: string; value: string }>;
  sizes?: Array<{ id: string; name: string; value: string }>;
  maxPrice?: number;
}

export function createQueryParams(
  search: SearchParams,
  params: Record<
    string,
    string | number | Array<string> | boolean | null | undefined
  >,
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
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return Array<string>();
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      throw new Error("Expected array-style search parameter value");
    }

    return parsed.filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
