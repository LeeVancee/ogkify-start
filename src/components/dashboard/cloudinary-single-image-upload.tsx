import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/lib/cloudinary";

declare global {
  interface Window {
    cloudinary: CloudinaryBase;
  }
}

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
  const uploadWidgetRef = useRef<any>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  const onRemove = () => {
    onChange("");
  };

  useEffect(() => {
    const initializeUploadWidget = () => {
      // Only initialize when there's no image (button is visible)
      if (window.cloudinary && uploadButtonRef.current && !value) {
        // Create upload widget
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
          (error: any, result: any) => {
            if (error) {
              console.error("Upload error:", error);
              toast.error(`Upload failed: ${error.message || "Unknown error"}`);
              return;
            }

            if (result && result.event === "success") {
              console.log("Upload successful:", result.info);
              onChange(result.info.secure_url);
              toast.success("Image uploaded successfully");
            }
          },
        );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current && !disabled) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener("click", handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener("click", handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [disabled, onChange, value]);

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
            ref={uploadButtonRef}
            type="button"
            disabled={disabled}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Image
          </button>
        </div>
      )}
    </div>
  );
}
