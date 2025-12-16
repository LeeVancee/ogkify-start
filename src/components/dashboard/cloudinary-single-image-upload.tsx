import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  loadCloudinaryScript,
} from "@/lib/cloudinary";
import type {
  CloudinaryUploadError,
  CloudinaryUploadResult,
  CloudinaryUploadWidget,
} from "@/lib/cloudinary-types";

interface CloudinarySingleImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CloudinarySingleImageUpload({
  value,
  onChange,
  disabled,
}: CloudinarySingleImageUploadProps) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const onRemove = () => {
    onChange("");
  };

  // Initialize widget only after script is loaded
  useEffect(() => {
    if (isScriptLoaded && window.cloudinary && !uploadWidgetRef.current) {
      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          maxFileSize: 4000000, // 4MB in bytes
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          resourceType: "image",
        },
        (
          error: CloudinaryUploadError | null,
          result: CloudinaryUploadResult,
        ) => {
          if (error) {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message || "Unknown error"}`);
            return;
          }

          if (result && result.event === "success" && result.info) {
            console.log("Upload successful:", result.info);
            onChange(result.info.secure_url);
            toast.success("Image uploaded successfully");
          }
        },
      );
    }
  }, [isScriptLoaded, onChange]);

  const handleUploadClick = async () => {
    if (disabled) return;

    // If script is already loaded and widget is ready, open it
    if (isScriptLoaded && uploadWidgetRef.current) {
      uploadWidgetRef.current.open();
      return;
    }

    // Load the script first
    try {
      setIsLoading(true);
      await loadCloudinaryScript();
      setIsScriptLoaded(true);
      
      // Wait a tick for the widget to be initialized
      setTimeout(() => {
        if (uploadWidgetRef.current) {
          uploadWidgetRef.current.open();
        }
      }, 100);
    } catch (error) {
      console.error("Failed to load Cloudinary script:", error);
      toast.error("Failed to initialize upload widget. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative h-[200px] w-[200px] rounded-md overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="flex h-7 w-7 items-center justify-center rounded-full p-0"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <img className="object-cover" alt="Category image" src={value} />
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={disabled || isLoading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Initializing..." : "Upload Image"}
          </button>
        </div>
      )}
    </div>
  );
}
