import { createFileRoute } from "@tanstack/react-router";

import { ResourceForm } from "@/components/dashboard/resource/resource-form";
import { saveAdminColor } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/colors/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ResourceForm
      title="New color"
      backHref="/dashboard/colors"
      fields={["name", "value"]}
      initialValues={{ name: "", value: "#000000" }}
      save={(values) => saveAdminColor({ data: { values } })}
    />
  );
}
