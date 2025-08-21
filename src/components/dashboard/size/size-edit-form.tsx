import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSize } from "@/server/sizes.server";

interface SizeEditFormProps {
  size: {
    id: string;
    name: string;
    value: string;
  };
}

export function SizeEditForm({ size }: SizeEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(size.name);
  const [value, setValue] = useState(size.value);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !value) {
      toast.error("Please fill in all information");
      return;
    }

    setLoading(true);
    try {
      const result = await updateSize({
        data: { id: size.id, data: { name, value } },
      });
      if (result.success) {
        toast.success("Size updated successfully");
        router.navigate({ to: "/dashboard/sizes" });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Input size name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Input size value (e.g., S, M, L)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Size"}
      </Button>
    </form>
  );
}
