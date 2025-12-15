import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Archive,
  DollarSign,
  FileText,
  FolderTree,
  Image as ImageIcon,
  Package,
  Palette,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CloudinaryMultiImageUpload } from "@/components/dashboard/cloudinary-multi-image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/server/products.server";
import { VariantsCardContent } from "./product-form-fields";
import {
  type ProductFormProps,
  type ProductFormValues,
  productFormSchema,
} from "./product-form-schema";

interface UnifiedProductFormProps extends ProductFormProps {
  mode: "create" | "edit";
  product?: {
    id: string;
    name: string;
    description: string;
    price: string;
    categoryId: string;
    colorIds: Array<string>;
    sizeIds: Array<string>;
    images: Array<string>;
    isFeatured: boolean;
    isArchived: boolean;
  };
}

export function UnifiedProductForm({
  categories,
  colors,
  sizes,
  mode,
  product,
}: UnifiedProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Product" : "Create New Product";
  const description = isEditMode
    ? "Update your product details and settings"
    : "Add a new product to your store with all the necessary details";
  const submitButtonText = isEditMode ? "Update Product" : "Create Product";
  const submitLoadingText = isEditMode ? "Updating..." : "Creating...";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product || {
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

  async function onSubmit(values: ProductFormValues) {
    setIsLoading(true);

    try {
      const result = isEditMode
        ? await updateProduct({
            data: { id: product!.id, data: values },
          })
        : await createProduct({ data: values });

      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success(
        isEditMode
          ? "Product updated successfully!"
          : "Product created successfully!",
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.navigate({ to: "/dashboard/products" });
    } catch (error) {
      toast.error(
        `${
          isEditMode ? "Update" : "Create"
        } product failed. Please try again later.`,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6 p-6 md:p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-emerald-500 shadow-lg">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
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
                            autoComplete="off"
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
                              autoComplete="off"
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
                          autoComplete="off"
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
                  render={({ field }) => {
                    const selectedCategory = categories.find(
                      (cat) => cat.id === field.value,
                    );
                    return (
                      <FormItem>
                        <FormLabel className="text-base">Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 text-base">
                              <SelectValue
                                placeholder="Select a category"
                                render={() => (
                                  <span>
                                    {selectedCategory?.name ||
                                      "Select a category"}
                                  </span>
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectPositioner>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectPositioner>
                        </Select>
                        <FormDescription className="text-xs">
                          Choose the most relevant category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                        <div className="rounded-lg border-2 border-dashed p-4 transition-colors bg-muted/30">
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
                <VariantsCardContent
                  control={form.control}
                  colors={colors}
                  sizes={sizes}
                  watchColorIds={form.watch("colorIds")}
                  watchSizeIds={form.watch("sizeIds")}
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
                    {submitLoadingText}
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-5 w-5" />
                    {submitButtonText}
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
