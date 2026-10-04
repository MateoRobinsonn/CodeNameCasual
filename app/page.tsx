import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { DemoProductCard } from "@/components/demo/demo-product-card";
import { Reveal } from "@/components/reveal";
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
                tinted={index % 2 === 1}
              />
              {index < DEMO_COLLECTIONS.length - 1 && <EditorialDivider index={index} />}
            </div>
          ))}

        {(!DEMO_MODE || products.length > 0) && (
          <section className="bg-gradient-to-b from-accent/30 to-transparent">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
              <Reveal>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="font-display text-2xl text-foreground">
                    {DEMO_MODE ? "Recién publicado" : "Destacados"}
                  </h2>
                  {products.length > 0 && (
                    <Link
                      href="/productos"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
              </Reveal>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function RealHero() {
  return (
    <section className="bg-gradient-to-br from-[#fbe9eb] via-[#f8f3ec] to-background px-4 py-20 text-center sm:py-28">
      <div className="mx-auto max-w-3xl">
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
          className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}

function DemoHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fbe9eb] via-[#f8f3ec] to-background px-4 py-28 text-center sm:py-36">
      <p className="animate-fade-up text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Colombia · Envíos discretos
      </p>
      <h1
        className="animate-fade-up mx-auto mt-4 max-w-2xl font-display text-5xl leading-tight text-foreground sm:text-6xl"
        style={{ animationDelay: "0.08s" }}
      >
        Lencería pensada para ti
      </h1>
      <p
        className="animate-fade-up mx-auto mt-4 max-w-md text-muted-foreground"
        style={{ animationDelay: "0.16s" }}
      >
        Catálogo, tallas y colores curados con cuidado. Compra segura,
        pronto disponible directamente desde aquí.
      </p>
      <Link
        href="/productos"
        className="animate-fade-up mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        style={{ animationDelay: "0.24s" }}
      >
        Ver catálogo
      </Link>
    </section>
  );
}

function CollectionSection({
  eyebrow,
  title,
  tinted,
}: {
  eyebrow: string;
  title: string;
  tinted: boolean;
}) {
  const items = demoProductsByCollection(title);

  return (
    <section
      className={
        tinted
          ? "bg-gradient-to-b from-accent/45 via-accent/15 to-transparent"
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {eyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl text-foreground">{title}</h2>
            </div>
            <Link
              href="/productos"
              className="text-xs uppercase tracking-[0.15em] text-foreground underline underline-offset-4 transition-colors hover:text-primary"
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
        </Reveal>
      </div>
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
      <Reveal className="flex items-center justify-center rounded-3xl bg-gradient-to-r from-accent via-[#fdf4f5] to-background px-6 py-16 text-center sm:py-20">
        <p className="max-w-lg font-display text-2xl italic leading-snug text-foreground sm:text-3xl">
          {DIVIDER_COPY[index % DIVIDER_COPY.length]}
        </p>
      </Reveal>
    </div>
  );
}
