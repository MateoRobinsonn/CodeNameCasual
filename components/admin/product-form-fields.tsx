import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </label>
  );
}

export const fieldInputClass =
  "rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground sm:py-2 sm:text-sm";
