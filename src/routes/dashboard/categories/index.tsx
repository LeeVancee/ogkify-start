import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { ResourceList } from "@/components/dashboard/resource/resource-list";
import { PagePendingSpinner } from "@/components/ui/page-pending-spinner";
import { adminCategoriesQueryOptions } from "@/lib/admin/query-options";
import { deleteAdminCategory } from "@/server/admin/resources";

export const Route = createFileRoute("/dashboard/categories/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(adminCategoriesQueryOptions());
  },
  pendingComponent: PagePendingSpinner,
  component: RouteComponent,
});

function RouteComponent() {
  const categoriesQuery = useQuery(adminCategoriesQueryOptions());

  if (categoriesQuery.isPending) {
    return <PagePendingSpinner />;
  }

  if (categoriesQuery.isError) {
    throw categoriesQuery.error;
  }

  const categories = categoriesQuery.data;

  return (
    <DashboardPageShell
      title="Categories"
      description="Organize storefront taxonomy and category imagery."
    >
      <ResourceList
        title="Categories"
        items={categories}
        newHref="/dashboard/categories/new"
        editHref="/dashboard/categories/$id"
        accent="image"
        onDelete={(id) => deleteAdminCategory({ data: id })}
      />
    </DashboardPageShell>
  );
}
