import { createFileRoute, notFound } from "@tanstack/react-router";
import { SizeEditForm } from "@/components/dashboard/size/size-edit-form";
import { getSize } from "@/server/sizes.server";

export const Route = createFileRoute("/dashboard/sizes/$id")({
  component: RouteComponent,
  loader: async ({ params }: { params: { id: string } }) => {
    const response = await getSize({ data: params.id });
    return { response };
  },
});

function RouteComponent() {
  const { response } = Route.useLoaderData();

  if (!response.success || !response.size) {
    notFound();
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
