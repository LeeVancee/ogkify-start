import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateColor } from "@/server/colors.server";

interface ColorEditFormProps {
  color: {
    id: string;
    name: string;
    value: string;
  };
}

export function ColorEditForm({ color }: ColorEditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(color.name);
  const [value, setValue] = useState(color.value);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !value) {
      toast.error("Please fill in all information");
      return;
    }

    setLoading(true);
    try {
      const result = await updateColor({
        data: {
          id: color.id,
          data: {
            name,
            value,
          },
        },
      });
      if (result.success) {
        toast.success("Color updated successfully");
        queryClient.invalidateQueries({ queryKey: ["colors"] });
        router.navigate({ to: "/dashboard/colors" });
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
          placeholder="Input color name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="color"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-[60px]"
          />
          <Input
            placeholder="Color Value (Hex)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Color"}
      </Button>
    </form>
  );
}
