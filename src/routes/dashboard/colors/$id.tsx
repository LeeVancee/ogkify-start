import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminColorQueryOptions } from "@/lib/admin/query-options";
import { saveAdminColor } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/colors/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(adminColorQueryOptions(params.id)),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: color } = useSuspenseQuery(adminColorQueryOptions(id));

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
