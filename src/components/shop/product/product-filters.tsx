import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

import { CategoryFilter } from "./category-filter";
import type { FilterProps } from "./filter-types";
import { PriceFilter } from "./price-filter";
import { useProductFilterNavigation } from "./use-product-filter-navigation";

const sortOptions = [
  { value: "featured", labelKey: "shop.productFilters.sortFeatured" },
  { value: "price-asc", labelKey: "shop.productFilters.sortPriceAsc" },
  { value: "price-desc", labelKey: "shop.productFilters.sortPriceDesc" },
  { value: "newest", labelKey: "shop.productFilters.sortNewest" },
];

function FilterSortSelect() {
  const { search, updateSearch } = useProductFilterNavigation();
  const { t } = useI18n();
  const currentSort = search.sort || "newest";

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium text-muted-foreground">
        {t("shop.productFilters.sortBy")}
      </h3>
      <Select
        value={currentSort}
        onValueChange={(value) =>
          updateSearch({ sort: value || "featured", page: 1 })
        }
      >
        <SelectTrigger className="h-11 w-full rounded-sm border-border bg-transparent px-3 text-sm text-foreground shadow-none">
          <SelectValue placeholder={t("shop.productFilters.sortBy")}>
            {t(
              sortOptions.find((option) => option.value === currentSort)
                ?.labelKey ?? "shop.productFilters.sortNewest",
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          className="w-(--anchor-width)"
        >
          <SelectGroup>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
}

export function ProductFilters({ categories, maxPrice = 5000 }: FilterProps) {
  const { t } = useI18n();
  const { search, resetSearch } = useProductFilterNavigation();
  const hasFilters = Boolean(
    search.category ||
    search.minPrice ||
    search.maxPrice !== undefined ||
    search.featured ||
    search.search ||
    search.sort,
  );

  return (
    <div className="grid gap-7">
      <div className="flex min-h-8 items-center justify-between gap-2 border-b border-border pr-10 pb-5 sm:pr-0">
        <h2 className="text-sm font-semibold">
          {t("shop.productFilters.filters")}
        </h2>
        <button
          type="button"
          disabled={!hasFilters}
          onClick={resetSearch}
          className="text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground disabled:opacity-35"
        >
          {t("shop.productFilters.resetFilters")}
        </button>
      </div>
      <CategoryFilter categories={categories} />
      <div className="border-y border-border py-7">
        <PriceFilter maxPrice={maxPrice} />
      </div>
      <FilterSortSelect />
    </div>
  );
}
