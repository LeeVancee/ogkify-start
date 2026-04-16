import { deleteCategory, getCategories } from "@/server/categories";

import { ResourceList } from "../resource-list";
import { CategoryCard } from "./category-card";

export function CategoryList() {
  return (
    <ResourceList
      queryKey={["categories"]}
      queryFn={() => getCategories()}
      deleteFn={(id) => deleteCategory({ data: id })}
      searchPlaceholder="Search for categories..."
      addHref="/dashboard/categories/new"
      addLabel="Add Category"
      emptyTitle="No categories found"
      emptyDescription="No categories match your search criteria or you have not added any categories yet."
      errorTitle="Failed to load categories"
      errorDescription="There was an error loading the categories. Please try again."
      matchesSearch={(category, query) =>
        !query ||
        category.name.toLowerCase().includes(query) ||
        !!category.imageUrl?.toLowerCase().includes(query)
      }
      getItemId={(category) => category.id}
      getDeleteSuccessMessage={() => "Category deleted successfully"}
      getDeleteErrorMessage={() => "Failed to delete category"}
      renderCard={(category, isDeleting, onDelete) => (
        <CategoryCard
          key={category.id}
          category={category}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      )}
    />
  );
}
