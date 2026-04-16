import { Check, Palette, Ruler } from "lucide-react";
import type { Control, FieldValues, Path } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import type { Color, Size } from "./product-form-schema";

interface ColorSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  colors: Array<Color>;
  watchValue?: Array<string>;
}

export function ColorSelector<T extends FieldValues>({
  control,
  name,
  colors,
  watchValue = [],
}: ColorSelectorProps<T>) {
  const selectedColorCount = watchValue ? watchValue.length : 0;

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <FormLabel className="text-base font-semibold">
              Available Colors
            </FormLabel>
            <Badge variant="secondary" className="ml-auto">
              {selectedColorCount} selected
            </Badge>
          </div>
          <FormDescription className="text-xs mb-3">
            Select color options for this product (optional, leave empty if not
            applicable)
          </FormDescription>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <FormField
                key={color.id}
                control={control}
                name={name}
                render={({ field }) => {
                  const isSelected = field.value?.includes(color.id);
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
                              ? field.onChange([...field.value, color.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== color.id,
                                  ),
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
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
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
  );
}

interface SizeSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  sizes: Array<Size>;
  watchValue?: Array<string>;
}

export function SizeSelector<T extends FieldValues>({
  control,
  name,
  sizes,
  watchValue = [],
}: SizeSelectorProps<T>) {
  const selectedSizeCount = watchValue ? watchValue.length : 0;

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <FormLabel className="text-base font-semibold">
              Available Sizes
            </FormLabel>
            <Badge variant="secondary" className="ml-auto">
              {selectedSizeCount} selected
            </Badge>
          </div>
          <FormDescription className="text-xs mb-3">
            Select size options for this product (optional, leave empty if not
            applicable)
          </FormDescription>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <FormField
                key={size.id}
                control={control}
                name={name}
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
                              ? field.onChange([...field.value, size.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== size.id,
                                  ),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-medium flex-1">
                        {size.name} ({size.value})
                      </FormLabel>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
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
  );
}

interface VariantsCardContentProps<T extends FieldValues> {
  control: Control<T>;
  colors: Array<Color>;
  sizes: Array<Size>;
  watchColorIds?: Array<string>;
  watchSizeIds?: Array<string>;
}

export function VariantsCardContent<T extends FieldValues>({
  control,
  colors,
  sizes,
  watchColorIds,
  watchSizeIds,
}: VariantsCardContentProps<T>) {
  return (
    <div className="space-y-6">
      <ColorSelector
        control={control}
        name={"colorIds" as Path<T>}
        colors={colors}
        watchValue={watchColorIds}
      />
      <Separator />
      <SizeSelector
        control={control}
        name={"sizeIds" as Path<T>}
        sizes={sizes}
        watchValue={watchSizeIds}
      />
    </div>
  );
}
