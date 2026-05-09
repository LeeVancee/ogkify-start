import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminCategoryQueryOptions } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { saveAdminCategory } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/categories/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(adminCategoryQueryOptions(params.id)),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { data: category } = useSuspenseQuery(adminCategoryQueryOptions(id));

  return (
    <ResourceForm
      title={t("dashboard.forms.editCategory")}
      backHref="/dashboard/categories"
      fields={["name", "imageUrl"]}
      initialValues={{ name: category.name, imageUrl: category.imageUrl ?? "" }}
      save={(values) =>
        saveAdminCategory({ data: { id: category.id, values } })
      }
    />
  );
}
