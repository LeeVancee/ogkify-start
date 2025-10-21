import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Ruler } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { createSize } from "@/server/sizes.server";

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

export function SizeForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    try {
      const result = await createSize({ data: values });
      if (result.success) {
        toast.success("Size created successfully");
        // Invalidate queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ["sizes"] });
        // Navigate back to the sizes list
        router.navigate({ to: "/dashboard/sizes" });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  }

  const handleQuickSelect = (size: { label: string; value: string }) => {
    form.setValue("name", size.label);
    form.setValue("value", size.value);
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
            {commonSizes.map((size) => (
              <Badge
                key={size.value}
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleQuickSelect(size)}
              >
                {size.label} ({size.value})
              </Badge>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating Size...
            </>
          ) : (
            <>
              <Ruler className="mr-2 h-5 w-5" />
              Create Size
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
