import { Hash, Palette } from "lucide-react";
import { ManagementCard } from "@/components/shared/management-card";
import { Badge } from "@/components/ui/badge";

interface ColorCardProps {
  color: {
    id: string;
    name: string;
    value: string;
  };
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ColorCard({
  color,
  onDelete,
  isDeleting = false,
}: ColorCardProps) {
  return (
    <ManagementCard
      item={color}
      editRoute="/dashboard/colors/$id"
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteConfirmTitle={`Are you sure you want to delete the color "${color.name}"?`}
    >
      <div className="relative">
        {/* Color preview section */}
        <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div
            className="h-32 w-32 rounded-2xl shadow-lg ring-4 ring-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
            style={{ backgroundColor: color.value }}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Color type badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-700 backdrop-blur-sm border-0 shadow-sm"
            >
              <Palette className="w-3 h-3 mr-1" />
              Color
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {color.name}
            </h3>
            <div
              className="h-6 w-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
              style={{ backgroundColor: color.value }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Hash className="w-4 h-4" />
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {color.value}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Palette className="w-4 h-4" />
              <span>Product Color Option</span>
            </div>
          </div>
        </div>
      </div>
    </ManagementCard>
  );
}
