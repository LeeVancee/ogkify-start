import type { Category } from "@/lib/types";
import { CheckboxFilterSection } from "./checkbox-filter-section";
import { useProductFilterNavigation } from "./use-product-filter-navigation";

interface CategoryFilterProps {
  categories: Array<Category>;
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const { search, updateSearch } = useProductFilterNavigation();
  const currentCategory = search.category;

  const handleChange = (categoryId: string) => {
    const categoryName =
      categories.find((cat) => cat.id === categoryId)?.name || categoryId;

    updateSearch({
      category: currentCategory === categoryName ? undefined : categoryName,
    });
  };

  return (
    <CheckboxFilterSection
      value="categories"
      title="Categories"
      options={categories.map((category) => ({
        id: `category-${category.id}`,
        label: category.name,
        checked: currentCategory === category.name,
      }))}
      onToggle={(optionId) => handleChange(optionId.replace("category-", ""))}
    />
  );
}
