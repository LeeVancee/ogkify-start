import { ManagementCard } from "@/components/shared/management-card";
import { Badge } from "@/components/ui/badge";
import { Ruler, Package } from "lucide-react";

interface SizeCardProps {
  size: {
    id: string;
    name: string;
    value: string;
  };
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function SizeCard({
  size,
  onDelete,
  isDeleting = false,
}: SizeCardProps) {
  return (
    <ManagementCard
      item={size}
      editRoute="/dashboard/sizes/$id"
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteConfirmTitle={`Are you sure you want to delete the size "${size.name}"?`}
    >
      <div className="relative">
        {/* Size display section */}
        <div className="aspect-[4/3] relative bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center space-y-3 transition-all duration-300 group-hover:scale-105">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg ring-1 ring-blue-200/50">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {size.value}
              </div>
              <div className="text-sm text-blue-500 font-medium">
                Size Value
              </div>
            </div>
          </div>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Size type badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-700 backdrop-blur-sm border-0 shadow-sm"
            >
              <Ruler className="w-3 h-3 mr-1" />
              Size
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {size.name}
            </h3>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-sm"
            >
              {size.value}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>Product Size Option</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Ruler className="w-4 h-4" />
              <span>Measurement: {size.value}</span>
            </div>
          </div>
        </div>
      </div>
    </ManagementCard>
  );
}
