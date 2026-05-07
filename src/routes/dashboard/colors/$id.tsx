import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminColorQueryOptions } from "@/lib/admin/query-options";
import { saveAdminColor } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/colors/$id")({
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(adminColorQueryOptions(params.id));
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const colorQuery = useQuery(adminColorQueryOptions(id));

  if (colorQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (colorQuery.isError) {
    throw colorQuery.error;
  }

  const color = colorQuery.data;

  return (
    <ResourceForm
      title="Edit color"
      backHref="/dashboard/colors"
      fields={["name", "value"]}
      initialValues={{ name: color.name, value: color.value }}
      save={(values) => saveAdminColor({ data: { id: color.id, values } })}
    />
  );
}
