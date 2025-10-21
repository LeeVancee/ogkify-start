import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import {
  Archive,
  Check,
  DollarSign,
  FileText,
  FolderTree,
  Image as ImageIcon,
  Package,
  Palette,
  Ruler,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CloudinaryMultiImageUpload } from "@/components/dashboard/cloudinary-multi-image-upload";
import { Badge } from "@/components/ui/badge";
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
  categoryId: z.string().min(1, "Please select a category."),
  colorIds: z.array(z.string()).default([]),
  sizeIds: z.array(z.string()).default([]),
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
    <div className="w-full space-y-6 p-6 md:p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Product
            </h1>
            <p className="text-muted-foreground mt-1">
              Add a new product to your store with all the necessary details
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Top Row - Basic Info and Category */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Basic Information</CardTitle>
                </div>
                <CardDescription>
                  Enter the essential details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base">
                          <Package className="h-4 w-4" />
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Classic Cotton T-Shirt"
                            className="h-11 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Choose a clear, descriptive name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base">
                          <DollarSign className="h-4 w-4" />
                          Price
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                              $
                            </span>
                            <Input
                              placeholder="0.00"
                              className="h-11 pl-8 text-base font-semibold"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Set your product price in USD
                        </FormDescription>
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
                      <FormLabel className="text-base">
                        Product Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product features, materials, and benefits..."
                          className="min-h-[120px] resize-none text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Provide a detailed description to help customers
                        understand your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500">
                    <FolderTree className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Category & Settings</CardTitle>
                </div>
                <CardDescription>
                  Product classification and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 text-base">
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
                      <FormDescription className="text-xs">
                        Choose the most relevant category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Visibility Options
                  </p>
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-yellow-600" />
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium cursor-pointer">
                              Featured Product
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Show on homepage
                            </FormDescription>
                          </div>
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
                        <div className="flex items-center gap-3">
                          <Archive className="h-5 w-5 text-muted-foreground" />
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium cursor-pointer">
                              Archived
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Hide from store
                            </FormDescription>
                          </div>
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
            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Product Images</CardTitle>
                </div>
                <CardDescription>
                  Upload high-quality images (first image will be the main
                  display)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary/50 bg-muted/30">
                          <CloudinaryMultiImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs mt-3">
                        Recommended: Square images (1:1 ratio) at least
                        800x800px
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Product Variants</CardTitle>
                </div>
                <CardDescription>
                  Select available colors and sizes for this product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="colorIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4 flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <FormLabel className="text-base font-semibold">
                          Available Colors
                        </FormLabel>
                        <Badge variant="secondary" className="ml-auto">
                          {form.watch("colorIds")?.length || 0} selected
                        </Badge>
                      </div>
                      <FormDescription className="text-xs mb-3">
                        Select color options for this product (optional, leave
                        empty if not applicable)
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2">
                        {colors.map((color) => (
                          <FormField
                            key={color.id}
                            control={form.control}
                            name="colorIds"
                            render={({ field }) => {
                              const isSelected = field.value?.includes(
                                color.id
                              );
                              return (
                                <FormItem
                                  key={color.id}
                                  className={`flex flex-row items-center space-x-2 space-y-0 rounded-lg border p-3 transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-primary/10 border-primary"
                                      : "hover:bg-accent"
                                  }`}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              color.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value: string) =>
                                                  value !== color.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex items-center gap-2 flex-1">
                                    <div
                                      className="h-5 w-5 rounded-full border-2 border-white shadow-md ring-1 ring-border"
                                      style={{ backgroundColor: color.value }}
                                    />
                                    <FormLabel className="cursor-pointer text-sm font-medium">
                                      {color.name}
                                    </FormLabel>
                                  </div>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
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
                      <div className="mb-4 flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <FormLabel className="text-base font-semibold">
                          Available Sizes
                        </FormLabel>
                        <Badge variant="secondary" className="ml-auto">
                          {form.watch("sizeIds")?.length || 0} selected
                        </Badge>
                      </div>
                      <FormDescription className="text-xs mb-3">
                        Select size options for this product (optional, leave
                        empty if not applicable)
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2">
                        {sizes.map((size) => (
                          <FormField
                            key={size.id}
                            control={form.control}
                            name="sizeIds"
                            render={({ field }) => {
                              const isSelected = field.value?.includes(size.id);
                              return (
                                <FormItem
                                  key={size.id}
                                  className={`flex flex-row items-center space-x-2 space-y-0 rounded-lg border p-3 transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-primary/10 border-primary"
                                      : "hover:bg-accent"
                                  }`}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              size.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value: string) =>
                                                  value !== size.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer text-sm font-medium flex-1">
                                    {size.name} ({size.value})
                                  </FormLabel>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
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
          <Separator className="my-8" />
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              All fields marked with * are required
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.navigate({ to: "/dashboard/products" })}
                disabled={isLoading}
                className="flex-1 sm:flex-none min-w-[120px] h-11"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none min-w-[140px] h-11 font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-5 w-5" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
