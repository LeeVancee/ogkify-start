import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createQueryParams } from "./filter-types";

export function FeaturedFilter() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [, startTransition] = useTransition();

  const isFeatured = search.featured === true;

  const handleChange = (value: boolean) => {
    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams(search, {
          featured: value || undefined,
        }),
        replace: true,
      });
    });
  };

  return (
    <AccordionItem value="featured">
      <AccordionTrigger>Featured Products</AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured-products"
            checked={isFeatured}
            onCheckedChange={(checked) => handleChange(!!checked)}
          />
          <Label htmlFor="featured-products" className="text-sm font-normal">
            Only show featured products
          </Label>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
