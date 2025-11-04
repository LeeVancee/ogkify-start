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

interface ColorFilterProps {
  colors: Array<{ id: string; name: string; value: string }>;
}

export function ColorFilter({ colors }: ColorFilterProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [, startTransition] = useTransition();

  const currentColorNames = normalizeArray(search.color);

  const handleChange = (color: { id: string; name: string; value: string }) => {
    const colorName = color.name;
    const newColors = currentColorNames.includes(colorName)
      ? currentColorNames.filter((name: string) => name !== colorName)
      : [...currentColorNames, colorName];

    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams(search, {
          color: newColors.length ? newColors : undefined,
        }),
        replace: true,
      });
    });
  };

  if (colors.length === 0) return null;

  return (
    <AccordionItem value="colors">
      <AccordionTrigger>Colors</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={currentColorNames.includes(color.name)}
                onCheckedChange={() => handleChange(color)}
              />
              <div className="flex items-center gap-1.5">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: color.value }}
                />
                <Label
                  htmlFor={`color-${color.id}`}
                  className="text-sm font-normal"
                >
                  {color.name}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
