import { useNavigate, useSearch } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
];

export function ProductSort() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const currentSort = search.sort || "newest";

  // Create query params object, preserving existing parameters
  const createQueryParams = (newSort: string) => {
    const newParams = { ...search };
    newParams.sort = newSort;
    return newParams;
  };

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    navigate({
      to: "/products",
      search: createQueryParams(value),
      replace: true,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-select" className="text-sm font-medium">
        Sort by:
      </Label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          {sortOptions.find((opt) => opt.value === currentSort)?.label ||
            "Sort by"}
        </SelectTrigger>

        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
