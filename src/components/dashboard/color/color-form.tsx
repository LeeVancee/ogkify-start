import { zodResolver } from "@hookform/resolvers/zod";
import { Palette } from "lucide-react";
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
import { createColor, updateColor } from "@/server/colors";
import { useResourceFormSubmit } from "../use-resource-form-submit";

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

interface ColorFormProps {
  color?: {
    id: string;
    name: string;
    value: string;
  };
}

export function ColorForm({ color }: ColorFormProps = {}) {
  const isEditMode = Boolean(color);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: color?.name || "",
      value: color?.value || "#000000",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const colorValue = form.watch("value");
  const onSubmit = useResourceFormSubmit<
    FormValues,
    { success: boolean; error?: string }
  >({
    mutationFn: (values) =>
      isEditMode
        ? updateColor({
            data: {
              id: color!.id,
              data: values,
            },
          })
        : createColor({ data: values }),
    queryKey: ["colors"],
    successMessage: isEditMode
      ? "Color updated successfully"
      : "Color created successfully",
    redirectTo: "/dashboard/colors",
  });

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
              <FormLabel className="text-base">Color Value</FormLabel>
              <FormDescription>
                Choose a color or enter a hex value
              </FormDescription>
              <div className="flex items-start gap-3">
                <FormControl>
                  <div className="relative">
                    <Input
                      type="color"
                      {...field}
                      className="h-24 w-24 cursor-pointer rounded-lg border-2 p-1 shadow-sm transition-all hover:shadow-md"
                      disabled={isSubmitting}
                      autoComplete="off"
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
                        field.onChange(
                          value.startsWith("#") ? value : `#${value}`,
                        );
                      }}
                      autoComplete="off"
                    />
                  </FormControl>
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                    <div
                      className="h-10 w-10 rounded-md border-2 border-white shadow-sm"
                      style={{ backgroundColor: colorValue }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Preview</p>
                      <p className="font-mono text-xs text-muted-foreground">
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
          className="h-11 w-full text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isEditMode ? "Updating Color..." : "Creating Color..."}
            </>
          ) : (
            <>
              <Palette className="mr-2 h-5 w-5" />
              {isEditMode ? "Update Color" : "Create Color"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
