import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { useI18n } from "@/lib/i18n";
import { saveAdminColor } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/colors/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();

  return (
    <ResourceForm
      title={t("dashboard.forms.newColor")}
      backHref="/dashboard/colors"
      fields={["name", "value"]}
      initialValues={{ name: "", value: "#000000" }}
      save={(values) => saveAdminColor({ data: { values } })}
    />
  );
}
