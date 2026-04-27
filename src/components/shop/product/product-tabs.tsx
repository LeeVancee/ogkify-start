import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";

interface Product {
  description: string;
  category: string;
}

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const { t } = useI18n();

  return (
    <Tabs defaultValue="details" className="mt-10">
      <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent px-0 pb-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          {t("shop.productDetail.details")}
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="rounded-none border-b-2 border-transparent px-0 pb-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          {t("shop.productDetail.notes")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="pt-5">
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </TabsContent>
      <TabsContent value="notes" className="pt-5">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            {t("shop.productDetail.category")}: {product.category}
          </p>
          <p>{t("shop.productDetail.optionsNote")}</p>
          <p>{t("shop.productDetail.fulfillmentNote")}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
