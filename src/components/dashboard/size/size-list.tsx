import { deleteSize, getSizes } from "@/server/sizes";
import { ResourceList } from "../resource-list";
import { SizeCard } from "./size-card";

type Size = {
  id: string;
  name: string;
  value: string;
};

export function SizeList() {
  return (
    <ResourceList
      queryKey={["sizes"]}
      queryFn={() => getSizes()}
      deleteFn={(id) => deleteSize({ data: id })}
      searchPlaceholder="Search for sizes..."
      addHref="/dashboard/sizes/new"
      addLabel="Add Size"
      emptyTitle="No sizes found"
      emptyDescription="No sizes match your search criteria or you have not added any sizes yet."
      errorTitle="Failed to load sizes"
      errorDescription="There was an error loading the sizes. Please try again."
      matchesSearch={(size, query) =>
        !query ||
        size.name.toLowerCase().includes(query) ||
        size.value.toLowerCase().includes(query)
      }
      getItemId={(size) => size.id}
      getDeleteSuccessMessage={() => "Size deleted successfully"}
      getDeleteErrorMessage={() => "Failed to delete size"}
      renderCard={(size, isDeleting, onDelete) => (
        <SizeCard
          key={size.id}
          size={size}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      )}
    />
  );
}
