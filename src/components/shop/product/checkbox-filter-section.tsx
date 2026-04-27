import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

interface CheckboxFilterOption {
  id: string;
  label: string;
  checked: boolean;
  swatchColor?: string;
}

interface CheckboxFilterSectionProps {
  value: string;
  title: string;
  options: CheckboxFilterOption[];
  emptyState?: boolean;
  columnsClassName?: string;
  onToggle: (optionId: string) => void;
}

export function CheckboxFilterSection({
  value,
  title,
  options,
  emptyState = false,
  columnsClassName = "grid gap-2",
  onToggle,
}: CheckboxFilterSectionProps) {
  const { t } = useI18n();

  if (emptyState) {
    return (
      <AccordionItem value={value}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">
            {t("shop.productFilters.noOptions")}
          </p>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className={columnsClassName}>
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={option.checked}
                onCheckedChange={() => onToggle(option.id)}
              />
              <div className="flex items-center gap-1.5">
                {option.swatchColor ? (
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: option.swatchColor }}
                  />
                ) : (
                  <></>
                )}
                <Label htmlFor={option.id} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
