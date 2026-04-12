import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  const [urlInput, setUrlInput] = useState("");

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  useEffect(() => {
    if (isScriptLoaded && window.cloudinary) {
      const remainingSlots = 4 - value.length;

      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFiles: remainingSlots > 0 ? remainingSlots : 1,
          maxFileSize: 5000000,
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
            const newUrl = result.info.secure_url;
            if (value.length < 4) {
              onChange([...value, newUrl]);
            }
          }

          if (result && result.event === "close") {
            if (
              result.info &&
              result.info.files &&
              result.info.files.length > 0
            ) {
              toast.success("Images uploaded successfully");
            }
          }
        },
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

    if (isScriptLoaded && uploadWidgetRef.current) {
      uploadWidgetRef.current.open();
      return;
    }

    try {
      setIsLoading(true);
      await loadCloudinaryScript();
      setIsScriptLoaded(true);

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

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed || value.length >= 4) return;
    onChange([...value, trimmed]);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
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
              <img className="object-cover w-full h-full" alt="Product image" src={url} />
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">External URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-3">
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
        </TabsContent>

        <TabsContent value="url" className="pt-3">
          {value.length >= 4 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              Maximum 4 images reached. Remove an image to add more.
            </p>
          ) : (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddUrl}
                disabled={disabled || !urlInput.trim()}
              >
                Add
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
