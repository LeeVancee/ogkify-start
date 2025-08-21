export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Array<string>;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  discount: number;
  freeShipping: boolean;
  options?: Array<ProductOption>;
  specifications?: Array<ProductSpecification>;
  reviewsList?: Array<ProductReview>;
}

export interface ProductOption {
  name: string;
  values: Array<string>;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
