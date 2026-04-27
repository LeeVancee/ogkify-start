import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

export function ImagePlaceholder({
  label = "No image",
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground",
        className,
      )}
    >
      <ImageOff className="h-5 w-5" />
      {label && (
        <span className="text-[0.65rem] font-medium leading-none">{label}</span>
      )}
    </div>
  );
}
