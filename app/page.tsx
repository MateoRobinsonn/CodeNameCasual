import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getPublishedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const products = await getPublishedProducts();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Colombia · Envíos discretos
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Lencería pensada para ti
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Catálogo, tallas y colores curados con cuidado. Compra segura,
            pronto disponible directamente desde aquí.
          </p>
          <Link
            href="/productos"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Ver catálogo
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:pb-28">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground">
              Destacados
            </h2>
            {products.length > 0 && (
              <Link
                href="/productos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Ver todo
              </Link>
            )}
          </div>

          {products.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Aún no hay productos publicados.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
