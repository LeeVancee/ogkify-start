import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ColorForm } from "@/components/dashboard/color/color-form";
import { SpinnerLoading } from "@/components/shared/flexible-loading";
import { getColor } from "@/server/colors";

export const Route = createFileRoute("/dashboard/colors/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["color", id],
    queryFn: () => getColor({ data: id }),
  });

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (isError || !response?.success || !response.color) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Color not found</h3>
        <p className="text-muted-foreground">
          The color you're looking for doesn't exist.
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Color</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Color Details</h2>
            <ColorForm color={response.color!} />
          </div>
        </div>
      </div>
    </div>
  );
}
