import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminSizeQueryOptions } from "@/lib/admin/query-options";
import { saveAdminSize } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/sizes/$id")({
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(adminSizeQueryOptions(params.id));
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const sizeQuery = useQuery(adminSizeQueryOptions(id));

  if (sizeQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (sizeQuery.isError) {
    throw sizeQuery.error;
  }

  const size = sizeQuery.data;

  return (
    <ResourceForm
      title="Edit size"
      backHref="/dashboard/sizes"
      fields={["name", "value"]}
      initialValues={{ name: size.name, value: size.value }}
      save={(values) => saveAdminSize({ data: { id: size.id, values } })}
    />
  );
}
