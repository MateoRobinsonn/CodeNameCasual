import Link from "next/link";
import { CartLink } from "@/components/cart-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-foreground"
        >
          Íntimo y Casual
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/productos" className="transition-colors hover:text-foreground">
            Catálogo
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
