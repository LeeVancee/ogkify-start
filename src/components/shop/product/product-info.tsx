import {
  Divide,
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProductColor {
  id: string;
  name: string;
  value: string;
}

interface ProductSize {
  id: string;
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: Array<ProductColor>;
  sizes: Array<ProductSize>;
  images: Array<string>;
  inStock?: boolean;
  freeShipping?: boolean;
}

interface ProductInfoProps {
  product: Product;
  addToCartAction: (
    formData: FormData,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function ProductInfo({ product, addToCartAction }: ProductInfoProps) {
  const [quantity, setQuantity] = useState("1");
  const [mainImage, setMainImage] = useState(
    product.images[0] || "/placeholder.svg",
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors.length > 0 ? product.colors[0].id : undefined,
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length > 0 ? product.sizes[0].id : undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("quantity", quantity);

    if (selectedColor) {
      formData.append("colorId", selectedColor);
    }

    if (selectedSize) {
      formData.append("sizeId", selectedSize);
    }

    try {
      const result = await addToCartAction(formData);

      if (result.success) {
        toast.success(result.message || `${product.name} added to cart`);
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to wishlist`);
  };

  const formatPrice = (price: number) => {
    return `$ ${price.toFixed(2)}`;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <img
            src={mainImage}
            alt="Product image"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg border bg-muted cursor-pointer"
              onClick={() => setMainImage(image)}
            >
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-3xl font-bold">{formatPrice(product.price)}</div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="space-y-6">
          {product.colors.length > 0 && (
            <div className="grid gap-2">
              <div className="font-medium">Colors</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color.id}
                    variant="outline"
                    className={cn(
                      "flex h-10 items-center justify-center rounded-md border-2 text-sm transition-all",
                      selectedColor === color.id
                        ? "border-blue-600 bg-muted text-blue-600"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    title={color.name}
                    onClick={() => setSelectedColor(color.id)}
                  >
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="grid gap-2">
              <div className="font-medium">Sizes</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant="outline"
                    className={cn(
                      "flex h-10 items-center justify-center rounded-md border-2 text-sm transition-all",
                      selectedSize === size.id
                        ? "border-blue-600 bg-muted text-blue-600"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <div className="font-medium">Quantity</div>
            <div className="flex items-center gap-3">
              <Select
                value={quantity}
                onValueChange={(value) => setQuantity(value as string)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="sm:flex-1"
            onClick={handleAddToCart}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-black" />
              Free Shipping
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-black" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RotateCcw className="w-4 h-4 text-black" />
              Easy Returns
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
