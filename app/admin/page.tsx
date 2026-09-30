import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-foreground">Bienvenida</h1>
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
  );
}
