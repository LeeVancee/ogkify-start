import { Cloudinary } from "@cloudinary/url-gen";

import { env } from "@/env/client";
export const cld = new Cloudinary({
  cloud: {
    cloudName: env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

// Upload preset for client-side uploads
export const CLOUDINARY_UPLOAD_PRESET = env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_CLOUD_NAME = env.VITE_CLOUDINARY_CLOUD_NAME;

export function hasCloudinaryConfig() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
}

// Cache for the script loading promise
let cloudinaryScriptPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Cloudinary upload widget script
 * Only loads once and caches the promise for subsequent calls
 */
export function loadCloudinaryScript(): Promise<void> {
  // If already loaded, resolve immediately
  if (window.cloudinary) {
    return Promise.resolve();
  }

  // If loading is in progress, return the existing promise
  if (cloudinaryScriptPromise) {
    return cloudinaryScriptPromise;
  }

  // Start loading the script
  cloudinaryScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      cloudinaryScriptPromise = null; // Reset on error to allow retry
      reject(new Error("Failed to load Cloudinary script"));
    };

    document.head.appendChild(script);
  });

  return cloudinaryScriptPromise;
}
