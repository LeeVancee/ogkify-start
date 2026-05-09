import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { useI18n } from "@/lib/i18n";
import { saveAdminCategory } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/categories/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useI18n();

  return (
    <ResourceForm
      title={t("dashboard.forms.newCategory")}
      backHref="/dashboard/categories"
      fields={["name", "imageUrl"]}
      initialValues={{ name: "", imageUrl: "" }}
      save={(values) => saveAdminCategory({ data: { values } })}
    />
  );
}
