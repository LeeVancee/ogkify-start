import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransition } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Category } from "@/lib/types";

interface ProductFiltersProps {
  categories: Array<Category>;
  colors?: Array<{ id: string; name: string; value: string }>;
  sizes?: Array<{ id: string; name: string; value: string }>;
  maxPrice?: number;
}

// Define search params type
interface SearchParams {
  category?: string;
  sort?: string;
  featured?: boolean;
  minPrice?: string;
  maxPrice?: string;
  color?: string | Array<string>;
  size?: string | Array<string>;
  [key: string]: any;
}

function ProductFiltersContent({
  categories,
  colors = [],
  sizes = [],
  maxPrice = 5000,
}: ProductFiltersProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [isPending, startTransition] = useTransition();

  const currentCategory = search.category;
  const currentSort = search.sort || "featured";
  const isFeatured = search.featured === true;
  const currentMinPrice = Number(search.minPrice || "0");
  const currentMaxPrice = Number(search.maxPrice || maxPrice.toString());

  // Get selected color and size names
  const currentColorNames = Array.isArray(search.color)
    ? search.color
    : search.color
      ? [search.color]
      : [];
  const currentSizeNames = Array.isArray(search.size)
    ? search.size
    : search.size
      ? [search.size]
      : [];

  const createQueryParams = (
    params: Record<string, string | Array<string> | boolean | null | undefined>,
  ): SearchParams => {
    const newParams = { ...search } as SearchParams;

    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) {
        delete newParams[key];
      } else {
        newParams[key] = value;
      }
    }

    return newParams;
  };

  const handleCategoryChange = (categoryId: string) => {
    // Find corresponding category name
    const categoryName =
      categories.find((cat) => cat.id === categoryId)?.name || categoryId;

    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams({
          category: currentCategory === categoryName ? undefined : categoryName,
        }),
        replace: true,
      });
    });
  };

  const handleFeaturedChange = (value: boolean) => {
    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams({
          featured: value || undefined,
        }),
        replace: true,
      });
    });
  };

  const handleColorChange = (color: {
    id: string;
    name: string;
    value: string;
  }) => {
    const colorName = color.name; // Use color name instead of ID

    const newColors = currentColorNames.includes(colorName)
      ? currentColorNames.filter((name: string) => name !== colorName)
      : [...currentColorNames, colorName];

    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams({
          color: newColors.length ? newColors : undefined,
        }),
        replace: true,
      });
    });
  };

  const handleSizeChange = (size: {
    id: string;
    name: string;
    value: string;
  }) => {
    const sizeName = size.value; // Use size value instead of ID

    const newSizes = currentSizeNames.includes(sizeName)
      ? currentSizeNames.filter((name: string) => name !== sizeName)
      : [...currentSizeNames, sizeName];

    startTransition(() => {
      navigate({
        to: "/products",
        search: createQueryParams({
          size: newSizes.length ? newSizes : undefined,
        }),
        replace: true,
      });
    });
  };

  const handlePriceChange = (values: Array<number>) => {
    if (values.length === 2) {
      const [min, max] = values;
      startTransition(() => {
        navigate({
          to: "/products",
          search: createQueryParams({
            minPrice: min > 0 ? min.toString() : undefined,
            maxPrice: max < maxPrice ? max.toString() : undefined,
          }),
          replace: true,
        });
      });
    }
  };

  const handleResetFilters = () => {
    startTransition(() => {
      navigate({
        to: "/products",
        search: {},
        replace: true,
      });
    });
  };

  const hasActiveFilters =
    currentCategory ||
    currentSort !== "featured" ||
    isFeatured ||
    currentMinPrice > 0 ||
    currentMaxPrice < maxPrice ||
    currentColorNames.length > 0 ||
    currentSizeNames.length > 0;

  return (
    <div className="grid gap-6">
      <Accordion
        type="multiple"
        defaultValue={["categories", "featured", "price"]}
      >
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={currentCategory === category.name}
                    onCheckedChange={() => handleCategoryChange(category.id)}
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

        <AccordionItem value="featured">
          <AccordionTrigger>Featured Products</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured-products"
                checked={isFeatured}
                onCheckedChange={(checked) => handleFeaturedChange(!!checked)}
              />
              <Label
                htmlFor="featured-products"
                className="text-sm font-normal"
              >
                Only show featured products
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {colors.length > 0 && (
          <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((color) => (
                  <div key={color.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color.id}`}
                      checked={currentColorNames.includes(color.name)}
                      onCheckedChange={() => handleColorChange(color)}
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
        )}

        {sizes.length > 0 && (
          <AccordionItem value="sizes">
            <AccordionTrigger>Sizes</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((size) => (
                  <div key={size.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size.id}`}
                      checked={currentSizeNames.includes(size.value)}
                      onCheckedChange={() => handleSizeChange(size)}
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
        )}

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 space-y-6">
              <Slider
                defaultValue={[currentMinPrice, currentMaxPrice]}
                min={0}
                max={maxPrice}
                step={50}
                onValueCommit={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm">￥{currentMinPrice}</p>
                <p className="text-sm">￥{currentMaxPrice}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleResetFilters}
        disabled={!hasActiveFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  return <ProductFiltersContent {...props} />;
}
