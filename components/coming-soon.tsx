import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </main>
      <SiteFooter />
    </>
  );
}
