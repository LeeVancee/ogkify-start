import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { createCategory } from "@/server/categories.server";
import { SingleImageUpload } from "../single-image-upload";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter a category name")
    .min(2, "Category name must be at least 2 characters"),
  imageUrl: z.string().min(1, "Please upload a category image"),
});

type FormValues = z.infer<typeof formSchema>;

export function CategoryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    try {
      const result = await createCategory({ data: values });
      if (result.success) {
        toast.success("Category created successfully");
        form.reset();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  }

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
                <div className="rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 bg-muted/30">
                  <SingleImageUpload
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
          className="w-full h-11 text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating Category...
            </>
          ) : (
            <>
              <FolderTree className="mr-2 h-5 w-5" />
              Create Category
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
