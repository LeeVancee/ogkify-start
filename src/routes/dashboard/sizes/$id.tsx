import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminSizeQueryOptions } from "@/lib/admin/query-options";
import { useI18n } from "@/lib/i18n";
import { saveAdminSize } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/sizes/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(adminSizeQueryOptions(params.id)),
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { data: size } = useSuspenseQuery(adminSizeQueryOptions(id));

  return (
    <ResourceForm
      title={t("dashboard.forms.editSize")}
      backHref="/dashboard/sizes"
      fields={["name", "value"]}
      initialValues={{ name: size.name, value: size.value }}
      save={(values) => saveAdminSize({ data: { id: size.id, values } })}
    />
  );
}
