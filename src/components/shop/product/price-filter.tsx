import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";

import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";

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
      <h3 className="text-xs font-semibold tracking-wide text-slate-500">
        {t("shop.productFilters.priceRange")}
      </h3>
      <div className="space-y-4">
        <Slider
          value={[currentMinPrice, currentMaxPrice]}
          min={0}
          max={maxPrice}
          step={50}
          onValueChange={handleChange}
        />
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>￥{currentMinPrice}</span>
          <span>￥{currentMaxPrice}</span>
        </div>
      </div>
    </section>
  );
}
