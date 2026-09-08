import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";

import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

import { createQueryParams } from "./filter-types";

interface PriceFilterProps {
  maxPrice?: number;
}

export function PriceFilter({ maxPrice = 5000 }: PriceFilterProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const search = useSearch({ strict: false });
  const [, startTransition] = useTransition();

  const currentMinPrice = search.minPrice ?? 0;
  const currentMaxPrice = search.maxPrice ?? maxPrice;

  const handleChange = (value: number | readonly number[]) => {
    const values = Array.isArray(value) ? [...value] : [value];
    if (values.length === 2) {
      const [min, max] = values;
      startTransition(() => {
        navigate({
          to: "/products",
          search: createQueryParams(search, {
            minPrice: min > 0 ? min : undefined,
            maxPrice: max < maxPrice ? max : undefined,
            page: 1,
          }),
          replace: true,
        });
      });
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium text-muted-foreground">
        {t("shop.productFilters.priceRange")}
      </h3>
      <div className="space-y-6 pt-2">
        <Slider
          aria-label={t("shop.productFilters.priceRange")}
          value={[currentMinPrice, currentMaxPrice]}
          min={0}
          max={maxPrice}
          step={50}
          onValueChange={handleChange}
        />
        <div className="flex items-center justify-between gap-2 text-xs tabular-nums text-foreground">
          <span className="border border-border px-3 py-2.5">
            {formatPrice(currentMinPrice)}
          </span>
          <span aria-hidden="true" className="text-muted-foreground">
            —
          </span>
          <span className="border border-border px-3 py-2.5">
            {formatPrice(currentMaxPrice)}
          </span>
        </div>
      </div>
    </section>
  );
}
