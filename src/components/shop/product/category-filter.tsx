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
      <h3 className="text-xs font-semibold tracking-wide text-slate-500">
        {t("shop.productFilters.categories")}
      </h3>
      <nav
        className="space-y-1"
        aria-label={t("shop.productFilters.categories")}
      >
        <button
          type="button"
          onClick={() => handleChange(undefined)}
          className={cn(
            "flex h-10 w-full items-center rounded-lg px-4 text-left text-sm font-medium transition-colors cursor-pointer",
            !currentCategory
              ? "bg-slate-950 text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          {t("shop.productFilters.all")}
        </button>
        {categories.map((category) => {
          const isActive = currentCategory === category.name;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleChange(category.name)}
              className={cn(
                "flex h-10 w-full items-center rounded-lg px-4 text-left text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {category.name}
            </button>
          );
        })}
      </nav>
    </section>
  );
}
