import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SizeEditForm } from "@/components/dashboard/size/size-edit-form";
import Loading from "@/components/loading";
import { getSize } from "@/server/sizes.server";

export const Route = createFileRoute("/dashboard/sizes/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["size", id],
    queryFn: () => getSize({ data: id }),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !response?.success || !response.size) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Size not found</h3>
        <p className="text-muted-foreground">
          The size you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Size</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Size Details</h2>
            <SizeEditForm size={response.size!} />
          </div>
        </div>
      </div>
    </div>
  );
}
