import { ManagementCard } from "@/components/shared/management-card";

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
      <div className="flex items-center gap-4 p-5">
        <div
          className="h-14 w-14 shrink-0 rounded-xl shadow-sm ring-1 ring-border"
          style={{ backgroundColor: color.value }}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {color.name}
          </h3>
          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
            {color.value}
          </span>
        </div>
      </div>
    </ManagementCard>
  );
}
