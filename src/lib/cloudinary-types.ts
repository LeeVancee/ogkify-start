export interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
}

export interface CloudinaryUploadError {
  message?: string;
}

export interface CloudinaryUploadResult {
  event: "success" | "close" | "abort" | "queues-end";
  info?: {
    secure_url?: string;
    files?: Array<unknown>;
    [key: string]: unknown;
  };
}

export interface CloudinaryBase {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (
      error: CloudinaryUploadError | null,
      result: CloudinaryUploadResult,
    ) => void,
  ) => CloudinaryUploadWidget;
}

declare global {
  interface Window {
    cloudinary?: CloudinaryBase;
  }
}
