import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  description: string;
  category: string;
}

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="details" className="mt-10">
      <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent px-0 pb-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Details
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="rounded-none border-b-2 border-transparent px-0 pb-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Notes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="pt-5">
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </TabsContent>
      <TabsContent value="notes" className="pt-5">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Category: {product.category}</p>
          <p>
            Available sizes and colors depend on the current product options.
          </p>
          <p>Orders follow the existing checkout and fulfillment flow.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
