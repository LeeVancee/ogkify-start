import type React from "react";

export function CheckoutSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-7 pb-2">
      <h2 className="mb-6 flex items-center gap-3 text-lg font-medium tracking-tight">
        <span className="inline-flex size-7 items-center justify-center rounded-full border border-border text-[11px] font-normal tabular-nums text-muted-foreground">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
