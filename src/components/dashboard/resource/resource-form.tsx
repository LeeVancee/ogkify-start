import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

import { CloudinaryImageUpload } from "@/components/dashboard/forms/cloudinary-image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminQueryKeys } from "@/lib/admin/query-options";
import type { AdminResourceFormValues } from "@/lib/admin/types";

interface ResourceFormProps {
  title: string;
  backHref: string;
  initialValues: AdminResourceFormValues;
  fields: Array<"name" | "value" | "imageUrl">;
  save: (
    values: AdminResourceFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function ResourceForm({
  title,
  backHref,
  initialValues,
  fields,
  save,
}: ResourceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState(initialValues);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const result = await save(values);
    setIsPending(false);

    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      router.navigate({ to: backHref });
    } else {
      window.alert(result.error || "Save failed");
    }
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-auto">
      <div className="border-b bg-muted/30 px-4 py-3 md:px-6">
        <Button
          render={<Link to={backHref} />}
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
        className="flex min-h-full w-full flex-col gap-4 p-3 sm:p-4 md:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage this resource across the full admin workspace.
            </p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full gap-2 sm:w-auto"
          >
            <Save className="size-4" />
            {isPending ? "Saving" : "Save"}
          </Button>
        </div>

        <div className="grid flex-1 content-start gap-5 rounded-xl border bg-card p-4 md:p-5 xl:grid-cols-2">
          {fields.includes("name") ? (
            <Field label="Name">
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
          ) : null}

          {fields.includes("value") ? (
            <Field label="Value">
              <Input
                value={values.value ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    value: event.target.value,
                  }))
                }
                required
              />
            </Field>
          ) : null}

          {fields.includes("imageUrl") ? (
            <Field label="Image URL" className="xl:col-span-2">
              <CloudinaryImageUpload
                value={values.imageUrl ? [values.imageUrl] : []}
                onChange={(images) =>
                  setValues((current) => ({
                    ...current,
                    imageUrl: images[0] ?? "",
                  }))
                }
                maxFiles={1}
                disabled={isPending}
                imageAlt={values.name || "Category image"}
              />
            </Field>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
