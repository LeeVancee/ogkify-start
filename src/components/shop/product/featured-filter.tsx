import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

import { useProductFilterNavigation } from "./use-product-filter-navigation";

export function FeaturedFilter() {
  const { search, updateSearch } = useProductFilterNavigation();
  const { t } = useI18n();
  const isFeatured = search.featured === true;

  const handleChange = (value: boolean) => {
    updateSearch({
      featured: value || undefined,
    });
  };

  return (
    <AccordionItem value="featured">
      <AccordionTrigger>
        {t("shop.productFilters.featuredProducts")}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured-products"
            checked={isFeatured}
            onCheckedChange={(checked) => handleChange(!!checked)}
          />
          <Label htmlFor="featured-products" className="text-sm font-normal">
            {t("shop.productFilters.onlyFeatured")}
          </Label>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
