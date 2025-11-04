import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/types";
import { createQueryParams } from "./filter-types";

interface CategoryFilterProps {
  categories: Array<Category>;
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [, startTransition] = useTransition();

  const currentCategory = search.category;

  const handleChange = (categoryId: string) => {
    const categoryName =
      categories.find((cat) => cat.id === categoryId)?.name || categoryId;

    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams(search, {
          category: currentCategory === categoryName ? undefined : categoryName,
        }),
        replace: true,
      });
    });
  };

  return (
    <AccordionItem value="categories">
      <AccordionTrigger>Categories</AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={currentCategory === category.name}
                onCheckedChange={() => handleChange(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
