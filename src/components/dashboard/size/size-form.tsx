import { zodResolver } from "@hookform/resolvers/zod";
import { Ruler } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
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
import { createSize, updateSize } from "@/server/sizes";
import { useResourceFormSubmit } from "../use-resource-form-submit";

const formSchema = z.object({
  name: z.string().min(1, "Please enter a size name"),
  value: z.string().min(1, "Please enter a size value"),
});

type FormValues = z.infer<typeof formSchema>;

const commonSizes = [
  { label: "Extra Small", value: "XS" },
  { label: "Small", value: "S" },
  { label: "Medium", value: "M" },
  { label: "Large", value: "L" },
  { label: "Extra Large", value: "XL" },
  { label: "XXL", value: "XXL" },
];

interface SizeFormProps {
  size?: {
    id: string;
    name: string;
    value: string;
  };
}

export function SizeForm({ size }: SizeFormProps = {}) {
  const isEditMode = Boolean(size);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: size?.name || "",
      value: size?.value || "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = useResourceFormSubmit<
    FormValues,
    { success: boolean; error?: string }
  >({
    mutationFn: (values) =>
      isEditMode
        ? updateSize({
            data: {
              id: size!.id,
              data: values,
            },
          })
        : createSize({ data: values }),
    queryKey: ["sizes"],
    successMessage: isEditMode
      ? "Size updated successfully"
      : "Size created successfully",
    redirectTo: "/dashboard/sizes",
  });

  const handleQuickSelect = (selectedSize: { label: string; value: string }) => {
    form.setValue("name", selectedSize.label);
    form.setValue("value", selectedSize.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Size Name</FormLabel>
              <FormDescription>
                Enter a descriptive name for the size (e.g., "Small", "Medium",
                "Large")
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g., Medium"
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Size Value</FormLabel>
              <FormDescription>
                Enter the abbreviated size value (e.g., "S", "M", "L", "42",
                "10.5")
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g., M"
                  {...field}
                  className="text-base font-semibold"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Quick Select Common Sizes:
          </p>
          <div className="flex flex-wrap gap-2">
            {commonSizes.map((selectedSize) => (
              <Badge
                key={selectedSize.value}
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleQuickSelect(selectedSize)}
              >
                {selectedSize.label} ({selectedSize.value})
              </Badge>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isEditMode ? "Updating Size..." : "Creating Size..."}
            </>
          ) : (
            <>
              <Ruler className="mr-2 h-5 w-5" />
              {isEditMode ? "Update Size" : "Create Size"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
