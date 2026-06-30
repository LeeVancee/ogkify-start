import { ImagePlus, LinkIcon, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  hasCloudinaryConfig,
  loadCloudinaryScript,
} from "@/lib/cloudinary";
import type {
  CloudinaryUploadError,
  CloudinaryUploadResult,
} from "@/lib/cloudinary-types";
import { cn } from "@/lib/utils";

interface CloudinaryImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  imageAlt?: string;
  showPreview?: boolean;
}

function addImageUrl({
  url,
  isSingle,
  value,
  maxFiles,
  onChange,
}: {
  url: string;
  isSingle: boolean;
  value: string[];
  maxFiles: number;
  onChange: (value: string[]) => void;
}) {
  const trimmed = url.trim();
  if (!trimmed) return;
  if (isSingle) return onChange([trimmed]);
  if (value.length < maxFiles) onChange([...value, trimmed]);
}

function createCloudinaryUploadWidget({
  isSingle,
  maxFiles,
  value,
  onChange,
}: {
  isSingle: boolean;
  maxFiles: number;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  if (!window.cloudinary) {
    throw new Error("Cloudinary upload widget failed to initialize");
  }

  return window.cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "url", "camera"],
      multiple: !isSingle,
      maxFiles: isSingle ? 1 : Math.max(maxFiles - value.length, 1),
      maxFileSize: isSingle ? 4000000 : 5000000,
      clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
      resourceType: "image",
    },
    (error: CloudinaryUploadError | null, result: CloudinaryUploadResult) => {
      if (error) {
        window.alert(error.message || "Upload failed");
        return;
      }

      if (result.event === "success" && result.info?.secure_url) {
        addImageUrl({
          url: result.info.secure_url,
          isSingle,
          value,
          maxFiles,
          onChange,
        });
      }
    },
  );
}

export function CloudinaryImageUpload({
  value,
  onChange,
  maxFiles = 1,
  disabled,
  imageAlt = "Uploaded image",
  showPreview = true,
}: CloudinaryImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const isSingle = maxFiles === 1;
  const isConfigured = hasCloudinaryConfig();
  const hasReachedLimit = value.length >= maxFiles;

  function removeUrl(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  async function handleUpload() {
    if (disabled || !isConfigured || (!isSingle && hasReachedLimit)) return;

    setIsLoading(true);
    await loadCloudinaryScript()
      .then(() => {
        createCloudinaryUploadWidget({
          isSingle,
          maxFiles,
          value,
          onChange,
        }).open();
      })
      .catch((error: unknown) => {
        window.alert(
          error instanceof Error
            ? error.message
            : "Failed to initialize Cloudinary",
        );
      });
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      {showPreview && value.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            isSingle ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {value.map((url) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-lg border bg-muted"
            >
              <div className={cn(isSingle ? "aspect-[21/9]" : "aspect-video")}>
                <img
                  src={url}
                  alt={imageAlt}
                  className="size-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                className="absolute right-2 top-2"
                onClick={() => removeUrl(url)}
                disabled={disabled}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 rounded-lg border bg-background p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleUpload}
            disabled={
              disabled ||
              !isConfigured ||
              isLoading ||
              (!isSingle && hasReachedLimit)
            }
          >
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            Upload
          </Button>

          <div className="flex min-w-0 flex-1 gap-2">
            <div className="relative min-w-0 flex-1">
              <LinkIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="url"
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="https://example.com/image.png"
                className="pl-9"
                disabled={disabled || (!isSingle && hasReachedLimit)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                addImageUrl({
                  url: urlInput,
                  isSingle,
                  value,
                  maxFiles,
                  onChange,
                });
                setUrlInput("");
              }}
              disabled={
                disabled || !urlInput.trim() || (!isSingle && hasReachedLimit)
              }
            >
              Add
            </Button>
          </div>
        </div>

        {!isConfigured ? (
          <p className="text-xs text-muted-foreground">
            Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to
            enable uploads. Manual URLs still work.
          </p>
        ) : null}
      </div>
    </div>
  );
}
