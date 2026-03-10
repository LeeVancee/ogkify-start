import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { createCategory, updateCategory } from "@/server/categories";
import { CloudinarySingleImageUpload } from "../cloudinary-single-image-upload";
import { useResourceFormSubmit } from "../use-resource-form-submit";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter a category name")
    .min(2, "Category name must be at least 2 characters"),
  imageUrl: z.string().min(1, "Please upload a category image"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

export function CategoryForm({ category }: CategoryFormProps = {}) {
  const isEditMode = Boolean(category);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      imageUrl: category?.imageUrl || "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = useResourceFormSubmit<
    FormValues,
    { success: boolean; error?: string }
  >({
    mutationFn: (values) =>
      isEditMode
        ? updateCategory({
            data: {
              id: category!.id,
              name: values.name,
              imageUrl: values.imageUrl,
            },
          })
        : createCategory({ data: values }),
    queryKey: ["categories"],
    successMessage: isEditMode
      ? "Category updated successfully"
      : "Category created successfully",
    redirectTo: "/dashboard/categories",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Category Name</FormLabel>
              <FormDescription>
                Enter a unique name for your product category
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g., T-Shirts, Shoes, Accessories"
                  {...field}
                  className="text-base"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Category Image</FormLabel>
              <FormDescription>
                Upload an attractive image that represents this category
                (recommended: 800x800px)
              </FormDescription>
              <FormControl>
                <div className="rounded-lg border-2 border-dashed bg-muted/30 p-6 transition-colors">
                  <CloudinarySingleImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isEditMode ? "Updating Category..." : "Creating Category..."}
            </>
          ) : (
            <>
              <FolderTree className="mr-2 h-5 w-5" />
              {isEditMode ? "Update Category" : "Create Category"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
