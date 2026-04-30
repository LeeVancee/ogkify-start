import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function canAddImage(value: Array<string>, maxFiles: number) {
  return value.length < maxFiles;
}

export function addImageUrl(
  value: Array<string>,
  url: string,
  maxFiles: number,
  options: { replaceExisting?: boolean } = {},
) {
  const trimmed = url.trim();

  if (!trimmed) {
    return value;
  }

  if (options.replaceExisting) {
    return [trimmed];
  }

  if (!canAddImage(value, maxFiles)) {
    return value;
  }

  return [...value, trimmed];
}

export function removeImageUrl(value: Array<string>, url: string) {
  return value.filter((current) => current !== url);
}

interface CloudinaryImageUploadProps {
  value: Array<string>;
  onChange: (value: Array<string>) => void;
  disabled?: boolean;
  maxFiles?: number;
  imageAlt?: string;
}

export function CloudinaryImageUpload({
  value,
  onChange,
  disabled,
  maxFiles = 1,
  imageAlt = "Uploaded image",
}: CloudinaryImageUploadProps) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const isSingleImage = maxFiles === 1;
  const remainingSlots = Math.max(maxFiles - value.length, 0);
  const hasReachedLimit = !canAddImage(value, maxFiles);

  useEffect(() => {
    if (!isScriptLoaded || !window.cloudinary) {
      return;
    }

    uploadWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: !isSingleImage,
        maxFiles: isSingleImage ? 1 : Math.max(remainingSlots, 1),
        maxFileSize: isSingleImage ? 4000000 : 5000000,
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
        resourceType: "image",
      },
      (error: CloudinaryUploadError | null, result: CloudinaryUploadResult) => {
        if (error) {
          console.error("Upload error:", error);
          toast.error(`Upload failed: ${error.message || "Unknown error"}`);
          return;
        }

        if (result?.event === "success" && result.info) {
          onChange(
            addImageUrl(value, result.info.secure_url, maxFiles, {
              replaceExisting: isSingleImage,
            }),
          );

          if (isSingleImage) {
            toast.success("Image uploaded successfully");
          }
        }

        if (
          !isSingleImage &&
          result?.event === "close" &&
          result.info?.files?.length
        ) {
          toast.success("Images uploaded successfully");
        }
      },
    );
  }, [
    isScriptLoaded,
    isSingleImage,
    maxFiles,
    onChange,
    remainingSlots,
    value,
  ]);

  const handleUploadClick = async () => {
    if (disabled) {
      return;
    }

    if (!isSingleImage && hasReachedLimit) {
      toast.error(`Maximum ${maxFiles} images allowed`);
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
        uploadWidgetRef.current?.open();
      }, 100);
    } catch (error) {
      console.error("Failed to load Cloudinary script:", error);
      toast.error("Failed to initialize upload widget. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUrl = () => {
    const nextValue = addImageUrl(value, urlInput, maxFiles, {
      replaceExisting: isSingleImage,
    });

    if (nextValue === value) {
      return;
    }

    onChange(nextValue);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
            >
              <div className="absolute top-2 right-2 z-10">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex h-7 w-7 items-center justify-center rounded-full p-0 text-white"
                  onClick={() => onChange(removeImageUrl(value, url))}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <img
                className="h-full w-full object-cover"
                alt={imageAlt}
                src={url}
              />
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
            disabled={
              disabled || (!isSingleImage && hasReachedLimit) || isLoading
            }
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {getUploadButtonText({
              isLoading,
              isSingleImage,
              hasReachedLimit,
              remainingSlots,
            })}
          </button>
        </TabsContent>

        <TabsContent value="url" className="pt-3">
          {!isSingleImage && hasReachedLimit ? (
            <p className="py-2 text-center text-sm text-muted-foreground">
              Maximum {maxFiles} images reached. Remove an image to add more.
            </p>
          ) : (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.png"
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSetUrl();
                  }
                }}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSetUrl}
                disabled={disabled || !urlInput.trim()}
              >
                {isSingleImage ? "Set" : "Add"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getUploadButtonText({
  isLoading,
  isSingleImage,
  hasReachedLimit,
  remainingSlots,
}: {
  isLoading: boolean;
  isSingleImage: boolean;
  hasReachedLimit: boolean;
  remainingSlots: number;
}) {
  if (isLoading) {
    return "Initializing...";
  }

  if (isSingleImage) {
    return "Upload Image";
  }

  if (hasReachedLimit) {
    return "Maximum images reached";
  }

  return `Upload Images (${remainingSlots} remaining)`;
}
