import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
          }),
          replace: true,
        });
      });
    }
  };

  return (
    <AccordionItem value="price">
      <AccordionTrigger>{t("shop.productFilters.priceRange")}</AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-6">
          <Slider
            value={[currentMinPrice, currentMaxPrice]}
            min={0}
            max={maxPrice}
            step={50}
            onValueChange={handleChange}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm">￥{currentMinPrice}</p>
            <p className="text-sm">￥{currentMaxPrice}</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
