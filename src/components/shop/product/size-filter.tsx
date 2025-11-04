import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createQueryParams, normalizeArray } from "./filter-types";

interface SizeFilterProps {
  sizes: Array<{ id: string; name: string; value: string }>;
}

export function SizeFilter({ sizes }: SizeFilterProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [, startTransition] = useTransition();

  const currentSizeNames = normalizeArray(search.size);

  const handleChange = (size: { id: string; name: string; value: string }) => {
    const sizeName = size.value;
    const newSizes = currentSizeNames.includes(sizeName)
      ? currentSizeNames.filter((name: string) => name !== sizeName)
      : [...currentSizeNames, sizeName];

    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams(search, {
          size: newSizes.length ? newSizes : undefined,
        }),
        replace: true,
      });
    });
  };

  if (sizes.length === 0) return null;

  return (
    <AccordionItem value="sizes">
      <AccordionTrigger>Sizes</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size.id}`}
                checked={currentSizeNames.includes(size.value)}
                onCheckedChange={() => handleChange(size)}
              />
              <Label
                htmlFor={`size-${size.id}`}
                className="text-sm font-normal"
              >
                {size.value}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
