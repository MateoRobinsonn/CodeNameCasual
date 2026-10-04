import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCop } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export default async function AdminProductsPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, status, variants(price_cop_minor)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Nuevo producto
        </Link>
      </div>

      {products && products.length > 0 ? (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {products.map((product) => {
            const prices = product.variants.map((v) => v.price_cop_minor);
            return (
              <li key={product.id}>
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="flex flex-col gap-2 px-4 py-4 text-sm hover:bg-secondary sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-card-foreground">{product.name}</p>
                    <p className="truncate text-muted-foreground">/{product.slug}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    {prices.length > 0 && (
                      <span className="text-muted-foreground">
                        {formatCop(Math.min(...prices))}
                      </span>
                    )}
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {statusLabel[product.status] ?? product.status}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Aún no has creado productos.
        </p>
      )}
    </div>
  );
}
