import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface FormFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "color" | "email" | "password";
  required?: boolean;
  component?: ReactNode;
}

interface SimpleFormProps<T> {
  fields: FormFieldConfig[];
  formData: T;
  onFieldChange: (field: keyof T, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitText?: string;
  className?: string;
  children?: ReactNode;
}

export function SimpleForm<T extends Record<string, any>>({
  fields,
  formData,
  onFieldChange,
  onSubmit,
  loading = false,
  submitText = "Submit",
  className = "space-y-4",
  children,
}: SimpleFormProps<T>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          {field.label && (
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {field.component ||
            (field.type === "color" ? (
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData[field.key] || ""}
                  onChange={(e) => onFieldChange(field.key, e.target.value)}
                  className="w-[60px]"
                  disabled={loading}
                />
                <Input
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) => onFieldChange(field.key, e.target.value)}
                  disabled={loading}
                />
              </div>
            ) : (
              <Input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formData[field.key] || ""}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                disabled={loading}
              />
            ))}
        </div>
      ))}
      {children}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : submitText}
      </Button>
    </form>
  );
}
