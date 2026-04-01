import { ManagementCard } from "@/components/shared/management-card";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
        <div className="text-5xl font-black text-foreground tracking-tight">
          {size.value}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{size.name}</span>
          <Badge variant="outline" className="font-mono text-xs">
            {size.value}
          </Badge>
        </div>
      </div>
    </ManagementCard>
  );
}
