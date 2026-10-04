import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const ADMIN_NAME = "Diana";

type UsefulLink = {
  label: string;
  description: string;
  href: string;
};

function usefulLinks(): UsefulLink[] {
  const links: UsefulLink[] = [
    {
      label: "Ver tienda en vivo",
      description: "Así la ven tus clientas ahora mismo.",
      href: "/",
    },
    {
      label: "Panel de Wompi",
      description: "Pagos, transacciones y tu balance.",
      href: "https://comercios.wompi.co",
    },
    {
      label: "WhatsApp Web",
      description: "Para responder mensajes de clientas desde el computador.",
      href: "https://web.whatsapp.com",
    },
    {
      label: "Políticas de la tienda",
      description: "Envíos, privacidad y términos publicados en el sitio.",
      href: "/politicas/envios",
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    links.splice(2, 0, {
      label: "Panel de Supabase",
      description: "Base de datos, imágenes de productos y usuarios.",
      href: `https://supabase.com/dashboard/project/${projectRef}`,
    });
  }

  return links;
}

export default async function AdminDashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  const supabase = await createClient();
  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });
  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="font-display text-2xl text-foreground">
          Bienvenida, {ADMIN_NAME}
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/productos"
            className="rounded-xl border border-border bg-card p-4 hover:border-primary"
          >
            <p className="text-sm text-muted-foreground">Productos</p>
            <p className="mt-1 text-2xl text-card-foreground">
              {productCount ?? 0}
            </p>
          </Link>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pedidos</p>
            <p className="mt-1 text-2xl text-card-foreground">
              {orderCount ?? 0}
            </p>
          </div>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Agregar producto
        </Link>
        <p className="text-sm text-muted-foreground">
          Gestión de pedidos llega en la siguiente etapa de construcción.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Enlaces útiles</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {usefulLinks().map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <p className="text-sm font-medium text-card-foreground">
                {link.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
