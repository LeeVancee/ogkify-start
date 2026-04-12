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
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    if (isScriptLoaded && window.cloudinary && !uploadWidgetRef.current) {
      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          maxFileSize: 4000000,
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
            onChange(result.info.secure_url);
            toast.success("Image uploaded successfully");
          }
        },
      );
    }
  }, [isScriptLoaded, onChange]);

  const handleUploadClick = async () => {
    if (disabled) return;

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

  const handleSetUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\/.+/.test(trimmed)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    onChange(trimmed);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative h-[200px] w-[200px] rounded-md overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="flex h-7 w-7 items-center justify-center rounded-full p-0"
              onClick={() => onChange("")}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <img className="object-cover w-full h-full" alt="Category image" src={value} />
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
            disabled={disabled || isLoading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Initializing..." : "Upload Image"}
          </button>
        </TabsContent>

        <TabsContent value="url" className="pt-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
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
              Set
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
