import { Upload, X } from "lucide-react";
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
  const uploadWidgetRef = useRef<any>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Calculate how many more images can be uploaded
        const remainingSlots = 4 - value.length;

        // Create upload widget
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
          (error: any, result: any) => {
            if (error) {
              console.error("Upload error:", error);
              toast.error(`Upload failed: ${error.message || "Unknown error"}`);
              return;
            }

            if (result && result.event === "success") {
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

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current && !disabled) {
            if (value.length >= 4) {
              toast.error("Maximum 4 images allowed");
              return;
            }
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
      <div className="space-y-4">
        <div
          className={`
            border-2 border-dashed 
            p-8
            h-[200px]
            rounded-lg 
            transition 
            flex flex-col items-center justify-center
            relative
            border-muted
            ${disabled ? "opacity-50" : ""}
          `}
        >
          <div className="text-center space-y-2">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click the button below to upload images
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF, WEBP (max 5MB each)
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {value.length} / 4 images uploaded
            </p>
          </div>
        </div>
        <button
          ref={uploadButtonRef}
          type="button"
          disabled={disabled || value.length >= 4}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {value.length >= 4
            ? "Maximum images reached"
            : `Upload Images (${4 - value.length} remaining)`}
        </button>
      </div>
    </div>
  );
}
