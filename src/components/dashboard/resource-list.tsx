import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { EmptyState } from "./empty-state";

interface ResourceListProps<TItem> {
  layout?: "grid" | "table";
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
  renderTable?: (
    items: TItem[],
    isDeleting: boolean,
    onDelete: (id: string) => void,
  ) => React.ReactNode;
}

export function ResourceList<TItem>({
  layout = "grid",
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
  getItemId: _getItemId,
  getDeleteSuccessMessage,
  getDeleteErrorMessage,
  renderCard,
  renderTable,
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
      <EmptyState
        icon={AlertCircle}
        title={errorTitle}
        description={errorDescription}
        tone="destructive"
        action={
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey })}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="h-10 pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Link
          to={addHref}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </Link>
      </div>
      <div className="text-xs text-muted-foreground">
        Showing {filteredItems.length} of {items.length}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            ) : (
              <Link
                to={addHref}
                className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                {addLabel}
              </Link>
            )
          }
        />
      ) : (
        <>
          {layout === "table" && renderTable ? (
            renderTable(filteredItems, deleteMutation.isPending, (id) =>
              deleteMutation.mutate(id),
            )
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) =>
                renderCard(item, deleteMutation.isPending, (id) =>
                  deleteMutation.mutate(id),
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
