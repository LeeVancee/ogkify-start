import { X } from "lucide-react";
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

interface CloudinaryMultiImageUploadProps {
  value: Array<string>;
  onChange: (value: Array<string>) => void;
  disabled?: boolean;
}

export function CloudinaryMultiImageUpload({
  value,
  onChange,
  disabled,
}: CloudinaryMultiImageUploadProps) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  // Initialize widget only after script is loaded
  useEffect(() => {
    if (isScriptLoaded && window.cloudinary) {
      // Calculate how many more images can be uploaded
      const remainingSlots = 4 - value.length;

      // Recreate widget when value changes to update maxFiles
      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFiles: remainingSlots > 0 ? remainingSlots : 1,
          maxFileSize: 5000000, // 5MB in bytes
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          resourceType: "image",
        },
        (
          error: CloudinaryUploadError | null,
          result: CloudinaryUploadResult
        ) => {
          if (error) {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message || "Unknown error"}`);
            return;
          }

          if (result && result.event === "success" && result.info) {
            console.log("Upload successful:", result.info);
            // Add newly uploaded URL to existing value
            const newUrl = result.info.secure_url;
            if (value.length < 4) {
              onChange([...value, newUrl]);
            }
          }

          // Show success message when all uploads are complete
          if (result && result.event === "close") {
            if (
              result.info &&
              result.info.files &&
              result.info.files.length > 0
            ) {
              toast.success("Images uploaded successfully");
            }
          }
        }
      );
    }
  }, [isScriptLoaded, onChange, value]);

  const handleUploadClick = async () => {
    if (disabled || value.length >= 4) {
      if (value.length >= 4) {
        toast.error("Maximum 4 images allowed");
      }
      return;
    }

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
      {/* Uploaded image preview */}
      <div className="flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-[200px] w-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="flex h-7 w-7 items-center justify-center rounded-full p-0 text-white"
                onClick={() => onRemove(url)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img className="object-cover" alt="Product image" src={url} />
          </div>
        ))}
      </div>

      {/* Upload button area */}
      <div>
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={disabled || value.length >= 4 || isLoading}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Initializing..."
            : value.length >= 4
            ? "Maximum images reached"
            : `Upload Images (${4 - value.length} remaining)`}
        </button>
      </div>
    </div>
  );
}
