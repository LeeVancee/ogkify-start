import { ShieldCheck } from "lucide-react";

import { useI18n } from "@/lib/i18n";

export function SecurePaymentNote() {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <ShieldCheck className="h-4 w-4 text-slate-700" />
      {t("shop.cart.securePaymentNote")}
    </div>
  );
}
