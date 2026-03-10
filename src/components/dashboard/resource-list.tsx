import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResourceListProps<TItem> {
  queryKey: string[];
  queryFn: () => Promise<TItem[]>;
  deleteFn: (id: string) => Promise<{ success: boolean; error?: string }>;
  searchPlaceholder: string;
  addHref: string;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  errorTitle: string;
  errorDescription: string;
  matchesSearch: (item: TItem, query: string) => boolean;
  getItemId: (item: TItem) => string;
  getDeleteSuccessMessage: (id: string) => string;
  getDeleteErrorMessage: (id: string) => string;
  renderCard: (
    item: TItem,
    isDeleting: boolean,
    onDelete: (id: string) => void,
  ) => React.ReactNode;
}

export function ResourceList<TItem>({
  queryKey,
  queryFn,
  deleteFn,
  searchPlaceholder,
  addHref,
  addLabel,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  matchesSearch,
  getItemId,
  getDeleteSuccessMessage,
  getDeleteErrorMessage,
  renderCard,
}: ResourceListProps<TItem>) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteFn(id);
      if (!result.success) {
        throw new Error(result.error || getDeleteErrorMessage(id));
      }
      return id;
    },
    onSuccess: (id) => {
      toast.success(getDeleteSuccessMessage(id));
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    },
  });

  const filteredItems = items.filter((item) =>
    matchesSearch(item, searchQuery.trim().toLowerCase()),
  );

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold text-red-500">
            {errorTitle}
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {errorDescription}
          </p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Link
          to={addHref}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </Link>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">{emptyTitle}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) =>
            renderCard(item, deleteMutation.isPending, (id) =>
              deleteMutation.mutate(id),
            ),
          )}
        </div>
      )}
    </div>
  );
}
