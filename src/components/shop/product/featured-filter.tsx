import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProductFilterNavigation } from "./use-product-filter-navigation";

export function FeaturedFilter() {
  const { search, updateSearch } = useProductFilterNavigation();
  const isFeatured = search.featured === true;

  const handleChange = (value: boolean) => {
    updateSearch({
      featured: value || undefined,
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
