import { useNavigate, useSearch } from "@tanstack/react-router";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

const sortOptions = [
  { value: "newest", labelKey: "shop.productFilters.sortNewest" },
  { value: "price-asc", labelKey: "shop.productFilters.sortPriceAsc" },
  { value: "price-desc", labelKey: "shop.productFilters.sortPriceDesc" },
  { value: "featured", labelKey: "shop.productFilters.sortFeatured" },
];

export function ProductSort() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { t } = useI18n();
  const currentSort = search.sort || "newest";

  // Create query params object, preserving existing parameters
  const createQueryParams = (newSort: string) => {
    const newParams = { ...search };
    newParams.sort = newSort;
    return newParams;
  };

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    navigate({
      to: "/products",
      search: createQueryParams(value),
      replace: true,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-select" className="text-sm font-medium">
        {t("shop.productFilters.sortBy")}:
      </Label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder={t("shop.productFilters.sortBy")} />
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
