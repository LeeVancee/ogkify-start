import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminCategoryQueryOptions } from "@/lib/admin/query-options";
import { saveAdminCategory } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/categories/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(adminCategoryQueryOptions(params.id)),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: category } = useSuspenseQuery(adminCategoryQueryOptions(id));

  return (
    <ResourceForm
      title="Edit category"
      backHref="/dashboard/categories"
      fields={["name", "imageUrl"]}
      initialValues={{ name: category.name, imageUrl: category.imageUrl ?? "" }}
      save={(values) =>
        saveAdminCategory({ data: { id: category.id, values } })
      }
    />
  );
}
