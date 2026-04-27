import { useI18n } from "@/lib/i18n";

import { CheckboxFilterSection } from "./checkbox-filter-section";
import { normalizeArray } from "./filter-types";
import { useProductFilterNavigation } from "./use-product-filter-navigation";

interface SizeFilterProps {
  sizes: Array<{ id: string; name: string; value: string }>;
}

export function SizeFilter({ sizes }: SizeFilterProps) {
  const { search, updateSearch } = useProductFilterNavigation();
  const { t } = useI18n();
  const currentSizeNames = normalizeArray(search.size);

  const handleChange = (size: { id: string; name: string; value: string }) => {
    const sizeName = size.value;
    const newSizes = currentSizeNames.includes(sizeName)
      ? currentSizeNames.filter((name: string) => name !== sizeName)
      : [...currentSizeNames, sizeName];

    updateSearch({
      size: newSizes.length ? newSizes.join(",") : undefined,
    });
  };

  return (
    <CheckboxFilterSection
      value="sizes"
      title={t("shop.productFilters.sizes")}
      options={sizes.map((size) => ({
        id: `size-${size.id}`,
        label: size.value,
        checked: currentSizeNames.includes(size.value),
      }))}
      emptyState={sizes.length === 0}
      columnsClassName="grid grid-cols-2 gap-2"
      onToggle={(optionId) => {
        const size = sizes.find(
          (item) => item.id === optionId.replace("size-", ""),
        );

        if (size) {
          handleChange(size);
        }
      }}
    />
  );
}
