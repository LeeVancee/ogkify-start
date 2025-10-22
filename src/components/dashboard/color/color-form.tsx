import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Palette } from "lucide-react";
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
import { createColor } from "@/server/colors.server";

const formSchema = z.object({
  name: z.string().min(1, "Please enter a color name"),
  value: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Please enter a valid hex color",
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function ColorForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "#000000",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const colorValue = form.watch("value");

  async function onSubmit(values: FormValues) {
    try {
      const result = await createColor({ data: values });
      if (result.success) {
        toast.success("Color created successfully");
        // Invalidate queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ["colors"] });
        // Navigate back to the colors list
        router.navigate({ to: "/dashboard/colors" });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Color Name</FormLabel>
              <FormDescription>
                Give your color a descriptive name (e.g., "Ocean Blue", "Sunset
                Red")
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g., Forest Green"
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
              <FormLabel className="text-base">Color Value</FormLabel>
              <FormDescription>
                Choose a color or enter a hex value
              </FormDescription>
              <div className="flex gap-3 items-start">
                <FormControl>
                  <div className="relative">
                    <Input
                      type="color"
                      {...field}
                      className="h-24 w-24 cursor-pointer rounded-lg border-2 p-1 shadow-sm transition-all hover:shadow-md"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <div className="flex-1 space-y-3">
                  <FormControl>
                    <Input
                      placeholder="#000000"
                      {...field}
                      className="font-mono text-base uppercase"
                      disabled={isSubmitting}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.startsWith("#")) {
                          field.onChange(value);
                        } else {
                          field.onChange(`#${value}`);
                        }
                      }}
                    />
                  </FormControl>
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                    <div
                      className="h-10 w-10 rounded-md border-2 border-white shadow-sm"
                      style={{ backgroundColor: colorValue }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Preview</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {colorValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
              Creating Color...
            </>
          ) : (
            <>
              <Palette className="mr-2 h-5 w-5" />
              Create Color
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
