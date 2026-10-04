import Link from "next/link";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-t from-accent/50 to-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-display text-base text-foreground">
            Íntimo y Casual
          </p>
          <p>Envíos discretos a todo Colombia.</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link href="/politicas/privacidad" className="hover:text-foreground">
            Privacidad
          </Link>
          <Link href="/politicas/terminos" className="hover:text-foreground">
            Términos
          </Link>
          <Link href="/politicas/envios" className="hover:text-foreground">
            Envíos y devoluciones
          </Link>
        </nav>
        <WhatsAppButton message="Hola, tengo una pregunta sobre un producto." />
      </div>
    </footer>
  );
}
