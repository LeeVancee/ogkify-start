import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

import { CategoryFilter } from "./category-filter";
import { ColorFilter } from "./color-filter";
import { FeaturedFilter } from "./featured-filter";
import type { FilterProps } from "./filter-types";
import { normalizeArray } from "./filter-types";
import { PriceFilter } from "./price-filter";
import { SizeFilter } from "./size-filter";
import { useProductFilterNavigation } from "./use-product-filter-navigation";

export function ProductFilters({
  categories,
  colors = [],
  sizes = [],
  maxPrice = 5000,
}: FilterProps) {
  const { search, resetSearch } = useProductFilterNavigation();
  const { t } = useI18n();
  const currentCategory = search.category;
  const currentSort = search.sort || "featured";
  const isFeatured = search.featured === true;
  const currentMinPrice = Number(search.minPrice || "0");
  const currentMaxPrice = Number(search.maxPrice || maxPrice.toString());
  const currentColorNames = normalizeArray(search.color);
  const currentSizeNames = normalizeArray(search.size);

  const hasActiveFilters =
    currentCategory ||
    currentSort !== "featured" ||
    isFeatured ||
    currentMinPrice > 0 ||
    currentMaxPrice < maxPrice ||
    currentColorNames.length > 0 ||
    currentSizeNames.length > 0;

  return (
    <div className="grid gap-6">
      <Accordion multiple defaultValue={["categories", "featured", "price"]}>
        <CategoryFilter categories={categories} />
        <FeaturedFilter />
        <ColorFilter colors={colors} />
        <SizeFilter sizes={sizes} />
        <PriceFilter maxPrice={maxPrice} />
      </Accordion>

      <Button
        variant="outline"
        className="w-full"
        onClick={resetSearch}
        disabled={!hasActiveFilters}
      >
        {t("shop.productFilters.resetFilters")}
      </Button>
    </div>
  );
}
