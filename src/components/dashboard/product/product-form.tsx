import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UploadThingImage } from "@/components/dashboard/upload-thing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/server/products.server";

interface Category {
  id: string;
  name: string;
}

interface Color {
  id: string;
  name: string;
  value: string;
}

interface Size {
  id: string;
  name: string;
  value: string;
}

interface ProductFormProps {
  categories: Array<Category>;
  colors: Array<Color>;
  sizes: Array<Size>;
}

const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "Product name must be at least 1 character.",
  }),
  description: z.string().min(1, {
    message: "Product description must be at least 1 character.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  colorIds: z.array(z.string()).min(1, {
    message: "Please select at least one color.",
  }),
  sizeIds: z.array(z.string()).min(1, {
    message: "Please select at least one size.",
  }),
  images: z.array(z.string()).min(1, {
    message: "Please upload at least one product image.",
  }),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

type FormValues = z.infer<typeof productFormSchema>;

export function ProductForm({ categories, colors, sizes }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      colorIds: [],
      sizeIds: [],
      images: [],
      isFeatured: false,
      isArchived: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const result = await createProduct({ data: values });

      if (result.error) {
        toast.error(result.error);
      }
      toast.success("Product created successfully!");
      router.navigate({ to: "/dashboard/products" });
    } catch (error) {
      toast.error("Create product failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your store with all the necessary details.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Top Row - Basic Info and Category */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details about your product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              placeholder="99.99"
                              className="h-11 pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product in detail..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category & Settings</CardTitle>
                <CardDescription>
                  Product classification and visibility settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Featured
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Display on homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isArchived"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Archived
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Hide from store
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row - Images and Variants */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Upload high-quality images. First image will be the main
                  display.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <UploadThingImage
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>
                  Select available colors and sizes for this product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="colorIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-3">
                        <FormLabel className="text-sm font-semibold">
                          Colors
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Choose at least one color option.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {colors.map((color) => (
                          <FormField
                            key={color.id}
                            control={form.control}
                            name="colorIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={color.id}
                                  className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(color.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              color.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value: string) =>
                                                  value !== color.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-4 w-4 rounded-full border-2 border-border shadow-sm"
                                      style={{ backgroundColor: color.value }}
                                    />
                                    <FormLabel className="cursor-pointer text-xs font-normal">
                                      {color.name}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="sizeIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-3">
                        <FormLabel className="text-sm font-semibold">
                          Sizes
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Choose at least one size option.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sizes.map((size) => (
                          <FormField
                            key={size.id}
                            control={form.control}
                            name="sizeIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={size.id}
                                  className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(size.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              size.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value: string) =>
                                                  value !== size.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer text-xs font-normal">
                                    {size.name} ({size.value})
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.navigate({ to: "/dashboard/products" })}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
