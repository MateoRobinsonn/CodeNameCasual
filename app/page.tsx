import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { DemoProductCard } from "@/components/demo/demo-product-card";
import { getPublishedProducts } from "@/lib/catalog";
import { DEMO_MODE } from "@/lib/demo/config";
import { DEMO_COLLECTIONS, demoProductsByCollection } from "@/lib/demo/products";

export default async function HomePage() {
  const products = await getPublishedProducts();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {DEMO_MODE ? <DemoHero /> : <RealHero />}

        {DEMO_MODE &&
          DEMO_COLLECTIONS.map((collection, index) => (
            <div key={collection.name}>
              <CollectionSection
                eyebrow={collection.eyebrow}
                title={collection.name}
              />
              {index < DEMO_COLLECTIONS.length - 1 && <EditorialDivider index={index} />}
            </div>
          ))}

        {(!DEMO_MODE || products.length > 0) && (
          <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">
                {DEMO_MODE ? "Recién publicado" : "Destacados"}
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
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function RealHero() {
  return (
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
  );
}

function DemoHero() {
  // This panel's gradient is always light, regardless of OS theme, so its
  // text uses fixed neutral-* colors instead of the theme-reactive
  // foreground/muted-foreground tokens (those flip to near-white in dark
  // mode and vanish against the pastel background).
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fbe9eb] via-[#f8f3ec] to-[#eef1ea] px-4 py-28 text-center sm:py-36">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        Colombia · Envíos discretos
      </p>
      <h1 className="mx-auto mt-4 max-w-2xl font-display text-5xl leading-tight text-neutral-900 sm:text-6xl">
        Lencería pensada para ti
      </h1>
      <p className="mx-auto mt-4 max-w-md text-neutral-600">
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
  );
}

function CollectionSection({ eyebrow, title }: { eyebrow: string; title: string }) {
  const items = demoProductsByCollection(title);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">{title}</h2>
        </div>
        <Link
          href="/productos"
          className="text-xs uppercase tracking-[0.15em] text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Ver todo
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {items.map((product) => (
          <li key={product.slug}>
            <DemoProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const DIVIDER_COPY = [
  "Piezas que se sienten tan bien como se ven.",
  "Diseñadas para acompañar cada día, sin esfuerzo.",
];

function EditorialDivider({ index }: { index: number }) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex items-center justify-center rounded-3xl bg-gradient-to-r from-[#f5e3da] via-[#f8f3ec] to-[#eef1ea] px-6 py-16 text-center sm:py-20">
        <p className="max-w-lg font-display text-2xl italic leading-snug text-neutral-900 sm:text-3xl">
          {DIVIDER_COPY[index % DIVIDER_COPY.length]}
        </p>
      </div>
    </div>
  );
}
