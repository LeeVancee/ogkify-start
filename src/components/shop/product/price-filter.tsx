import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { createQueryParams } from "./filter-types";

interface PriceFilterProps {
  maxPrice?: number;
}

export function PriceFilter({ maxPrice = 5000 }: PriceFilterProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [, startTransition] = useTransition();

  const currentMinPrice = Number(search.minPrice || "0");
  const currentMaxPrice = Number(search.maxPrice || maxPrice.toString());

  const handleChange = (values: Array<number>) => {
    if (values.length === 2) {
      const [min, max] = values;
      startTransition(() => {
        navigate({
          to: "/products",
          search: createQueryParams(search, {
            minPrice: min > 0 ? min.toString() : undefined,
            maxPrice: max < maxPrice ? max.toString() : undefined,
          }),
          replace: true,
        });
      });
    }
  };

  return (
    <AccordionItem value="price">
      <AccordionTrigger>Price Range</AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-6">
          <Slider
            defaultValue={[currentMinPrice, currentMaxPrice]}
            min={0}
            max={maxPrice}
            step={50}
            onValueCommit={handleChange}
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
