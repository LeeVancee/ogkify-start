import { ArrowUpRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useProductFilterNavigation } from "./use-product-filter-navigation";

interface CategoryFilterProps {
  categories: Array<Category>;
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const { search, updateSearch } = useProductFilterNavigation();
  const { t } = useI18n();
  const currentCategory = search.category;

  const handleChange = (categoryName?: string) => {
    updateSearch({
      category: currentCategory === categoryName ? undefined : categoryName,
      page: 1,
    });
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium text-muted-foreground">
        {t("shop.productFilters.categories")}
      </h3>
      <nav
        className="space-y-1.5"
        aria-label={t("shop.productFilters.categories")}
      >
        <button
          type="button"
          aria-pressed={!currentCategory}
          onClick={() => handleChange(undefined)}
          className={cn(
            "group flex min-h-11 w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors duration-200",
            !currentCategory
              ? "bg-foreground font-medium text-background"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {t("shop.productFilters.all")}
          {!currentCategory && (
            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
          )}
        </button>
        {categories.map((category) => {
          const isActive = currentCategory === category.name;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleChange(category.name)}
              className={cn(
                "group flex min-h-11 w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors duration-200",
                isActive
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {category.name}
              {isActive && (
                <ArrowUpRight
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>
    </section>
  );
}
