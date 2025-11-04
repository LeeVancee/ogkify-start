// Product type for dashboard views
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: { id: string; name: string };
  colors: Array<{ id: string; name: string; value: string }>;
  sizes: Array<{ id: string; name: string; value: string }>;
  images: Array<{ id: string; url: string }>;
  isFeatured: boolean;
  isArchived: boolean;
}

// Utility functions
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
