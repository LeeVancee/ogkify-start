import { deleteColor, getColors } from "@/server/colors";

import { ResourceList } from "../resource-list";
import { ColorCard } from "./color-card";

export function ColorList() {
  return (
    <ResourceList
      queryKey={["colors"]}
      queryFn={() => getColors()}
      deleteFn={(id) => deleteColor({ data: id })}
      searchPlaceholder="Search for colors..."
      addHref="/dashboard/colors/new"
      addLabel="Add Color"
      emptyTitle="No colors found"
      emptyDescription="No colors match your search criteria or you have not added any colors yet."
      errorTitle="Failed to load colors"
      errorDescription="There was an error loading the colors. Please try again."
      matchesSearch={(color, query) =>
        !query ||
        color.name.toLowerCase().includes(query) ||
        color.value.toLowerCase().includes(query)
      }
      getItemId={(color) => color.id}
      getDeleteSuccessMessage={() => "Color deleted successfully"}
      getDeleteErrorMessage={() => "Failed to delete color"}
      renderCard={(color, isDeleting, onDelete) => (
        <ColorCard
          key={color.id}
          color={color}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      )}
    />
  );
}
