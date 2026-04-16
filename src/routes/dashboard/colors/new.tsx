import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette } from "lucide-react";

import { ColorForm } from "@/components/dashboard/color/color-form";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/colors/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <Link to="/dashboard/colors">
          <Button variant="ghost" size="sm" className="gap-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Colors
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 shadow-md">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Color</h1>
            <p className="text-muted-foreground mt-1">
              Create a new color option for your products
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Color Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the color information below
            </p>
          </div>
          <div className="p-6">
            <ColorForm />
          </div>
        </div>
      </div>
    </div>
  );
}
