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
