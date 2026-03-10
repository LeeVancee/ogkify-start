import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryForm } from "@/components/dashboard/category/category-form";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { getCategory } from "@/server/categories";

export const Route = createFileRoute("/dashboard/categories/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategory({ data: id }),
  });

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (isError || !response?.success || !response.category) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Category not found</h3>
        <p className="text-muted-foreground">
          The category you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Category Details</h2>
            <CategoryForm category={response.category!} />
          </div>
        </div>
      </div>
    </div>
  );
}
