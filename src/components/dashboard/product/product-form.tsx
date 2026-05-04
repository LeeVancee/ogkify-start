import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

import { CloudinaryImageUpload } from "@/components/dashboard/forms/cloudinary-image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emptyProductFormValues } from "@/lib/admin/form-utils";
import { adminQueryKeys } from "@/lib/admin/query-options";
import type {
  AdminColorOption,
  AdminOption,
  AdminProductFormValues,
} from "@/lib/admin/types";

interface ProductFormProps {
  title: string;
  initialValues?: AdminProductFormValues;
  categories: AdminOption[];
  colors: AdminColorOption[];
  sizes: AdminOption[];
  save: (
    values: AdminProductFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function ProductForm({
  title,
  initialValues,
  categories,
  colors,
  sizes,
  save,
}: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState(
    initialValues ?? emptyProductFormValues(),
  );
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const result = await save(values);
    setIsPending(false);

    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      router.navigate({ to: "/dashboard/products" });
    } else {
      window.alert(result.error || "Save failed");
    }
  }

  function toggleArrayValue(field: "colorIds" | "sizeIds", id: string) {
    setValues((current) => {
      const set = new Set(current[field]);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return {
        ...current,
        [field]: Array.from(set),
      };
    });
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-auto">
      <div className="border-b bg-muted/30 px-4 py-3 md:px-6">
        <Button
          render={<Link to="/dashboard/products" />}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid min-h-full w-full gap-4 p-3 sm:p-4 md:p-5 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <main className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Product details, media, catalog options and publishing status.
              </p>
            </div>
          </div>

          <section className="space-y-4 rounded-xl border bg-card p-4 md:p-5">
            <Field label="Product name">
              <Input
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                value={values.description}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                required
                rows={5}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price">
                <Input
                  value={values.price}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field label="Category">
                <select
                  value={values.categoryId}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                  required
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="flex-1 space-y-4 rounded-xl border bg-card p-4 md:p-5">
            <Field label="Images">
              <CloudinaryImageUpload
                value={values.images.filter(Boolean)}
                onChange={(images) =>
                  setValues((current) => ({
                    ...current,
                    images,
                  }))
                }
                maxFiles={8}
                disabled={isPending}
                imageAlt={values.name || "Product image"}
              />
            </Field>
          </section>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <section className="space-y-4 rounded-xl border bg-card p-4 md:p-5">
            <h2 className="text-sm font-semibold">Status</h2>
            <label className="flex items-center justify-between gap-3 text-sm">
              Featured
              <input
                type="checkbox"
                checked={values.isFeatured}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    isFeatured: event.target.checked,
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              Archived
              <input
                type="checkbox"
                checked={values.isArchived}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    isArchived: event.target.checked,
                  }))
                }
              />
            </label>
          </section>

          <ChoiceSection
            title="Colors"
            items={colors}
            selected={values.colorIds}
            onToggle={(id) => toggleArrayValue("colorIds", id)}
            color
          />
          <ChoiceSection
            title="Sizes"
            items={sizes}
            selected={values.sizeIds}
            onToggle={(id) => toggleArrayValue("sizeIds", id)}
          />

          <Button type="submit" disabled={isPending} className="w-full gap-2">
            <Save className="size-4" />
            {isPending ? "Saving" : "Save product"}
          </Button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function ChoiceSection({
  title,
  items,
  selected,
  onToggle,
  color = false,
}: {
  title: string;
  items: Array<AdminOption | AdminColorOption>;
  selected: string[];
  onToggle: (id: string) => void;
  color?: boolean;
}) {
  return (
    <section className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="grid gap-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background p-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => onToggle(item.id)}
            />
            {color && "value" in item ? (
              <span
                className="size-4 rounded-full border"
                style={{ backgroundColor: item.value }}
              />
            ) : null}
            <span>{item.name}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
