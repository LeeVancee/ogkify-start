import { ManagementCard } from "@/components/shared/management-card";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function CategoryCard({
  category,
  onDelete,
  isDeleting = false,
}: CategoryCardProps) {
  return (
    <ManagementCard
      item={category}
      editRoute="/dashboard/categories/$id"
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteConfirmTitle={`Are you sure you want to delete the category "${category.name}"?`}
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={category.imageUrl || "/placeholder.svg"}
          alt={category.name}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category type badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-700 backdrop-blur-sm border-0 shadow-sm"
          >
            <Folder className="w-3 h-3 mr-1" />
            Category
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {category.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Folder className="w-4 h-4" />
          <span>Product Category</span>
        </div>
      </div>
    </ManagementCard>
  );
}
