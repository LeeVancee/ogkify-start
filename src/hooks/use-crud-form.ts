import { useState } from "react";
import { toast } from "sonner";

interface UseCrudFormOptions<T> {
  createFn: (data: {
    data: T;
  }) => Promise<{ success: boolean; error?: string }>;
  updateFn?: (
    id: string,
    data: { data: T },
  ) => Promise<{ success: boolean; error?: string }>;
  deleteFn?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  initialValues?: T;
  isEdit?: boolean;
  id?: string;
}

export function useCrudForm<T extends Record<string, any>>({
  createFn,
  updateFn,
  deleteFn,
  onSuccess,
  initialValues,
  isEdit = false,
  id,
}: UseCrudFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues || ({} as T));
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateField = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialValues || ({} as T));
  };

  const validateForm = (requiredFields: (keyof T)[]) => {
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error("Please fill in all required fields");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (requiredFields: (keyof T)[] = []) => {
    if (!validateForm(requiredFields)) return;

    setLoading(true);
    try {
      const operation =
        isEdit && updateFn && id
          ? updateFn(id, { data: formData })
          : createFn({ data: formData });

      const result = await operation;

      if (result.success) {
        const action = isEdit ? "updated" : "created";
        toast.success(`Item ${action} successfully`);
        if (!isEdit) resetForm();
        onSuccess?.();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteFn || !id) return;

    setDeleting(true);
    try {
      const result = await deleteFn(id);
      if (result.success) {
        toast.success("Item deleted successfully");
        onSuccess?.();
      } else {
        toast.error(result.error || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return {
    formData,
    loading,
    deleting,
    updateField,
    resetForm,
    handleSubmit,
    handleDelete,
    isEdit,
  };
}
