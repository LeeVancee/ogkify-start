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
  const currentSort = search.sort || "featured";

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold tracking-wide text-slate-500">
        {t("shop.productFilters.sortBy")}
      </h3>
      <Select
        value={currentSort}
        onValueChange={(value) =>
          updateSearch({ sort: value || "featured", page: 1 })
        }
      >
        <SelectTrigger className="h-11 w-full rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-none">
          <SelectValue placeholder={t("shop.productFilters.sortBy")} />
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
  return (
    <div className="grid gap-10">
      <CategoryFilter categories={categories} />
      <PriceFilter maxPrice={maxPrice} />
      <FilterSortSelect />
    </div>
  );
}
