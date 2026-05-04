import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { saveAdminCategory } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/categories/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ResourceForm
      title="New category"
      backHref="/dashboard/categories"
      fields={["name", "imageUrl"]}
      initialValues={{ name: "", imageUrl: "" }}
      save={(values) => saveAdminCategory({ data: { values } })}
    />
  );
}
