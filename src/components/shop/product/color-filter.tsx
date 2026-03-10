import { CheckboxFilterSection } from "./checkbox-filter-section";
import { normalizeArray } from "./filter-types";
import { useProductFilterNavigation } from "./use-product-filter-navigation";

interface ColorFilterProps {
  colors: Array<{ id: string; name: string; value: string }>;
}

export function ColorFilter({ colors }: ColorFilterProps) {
  const { search, updateSearch } = useProductFilterNavigation();
  const currentColorNames = normalizeArray(search.color);

  const handleChange = (color: { id: string; name: string; value: string }) => {
    const colorName = color.name;
    const newColors = currentColorNames.includes(colorName)
      ? currentColorNames.filter((name: string) => name !== colorName)
      : [...currentColorNames, colorName];

    updateSearch({
      color: newColors.length ? newColors.join(",") : undefined,
    });
  };

  return (
    <CheckboxFilterSection
      value="colors"
      title="Colors"
      options={colors.map((color) => ({
        id: `color-${color.id}`,
        label: color.name,
        checked: currentColorNames.includes(color.name),
        swatchColor: color.value,
      }))}
      emptyState={colors.length === 0}
      columnsClassName="grid grid-cols-2 gap-2"
      onToggle={(optionId) => {
        const color = colors.find(
          (item) => item.id === optionId.replace("color-", ""),
        );

        if (color) {
          handleChange(color);
        }
      }}
    />
  );
}
