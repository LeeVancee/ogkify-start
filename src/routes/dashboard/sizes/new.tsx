import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { useI18n } from "@/lib/i18n";
import { saveAdminSize } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/sizes/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();

  return (
    <ResourceForm
      title={t("dashboard.forms.newSize")}
      backHref="/dashboard/sizes"
      fields={["name", "value"]}
      initialValues={{ name: "", value: "" }}
      save={(values) => saveAdminSize({ data: { values } })}
    />
  );
}
