import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { saveAdminSize } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/sizes/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ResourceForm
      title="New size"
      backHref="/dashboard/sizes"
      fields={["name", "value"]}
      initialValues={{ name: "", value: "" }}
      save={(values) => saveAdminSize({ data: { values } })}
    />
  );
}
