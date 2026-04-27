import { ArrowRight, Folder } from "lucide-react";

import { ImagePlaceholder } from "@/components/dashboard/image-placeholder";
import { ManagementCard } from "@/components/shared/management-card";
import { Badge } from "@/components/ui/badge";

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
      <div className="aspect-video overflow-hidden relative bg-muted/30">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <ImagePlaceholder label="No category image" />
        )}
        <div className="absolute top-2.5 left-2.5">
          <Badge
            variant="outline"
            className="bg-white/95 text-primary border-primary/20 shadow-sm text-xs"
          >
            <Folder className="w-3 h-3 mr-1" />
            Category
          </Badge>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground truncate">
          {category.name}
        </h3>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
      </div>
    </ManagementCard>
  );
}
