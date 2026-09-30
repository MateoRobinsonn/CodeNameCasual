import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getPublishedProducts } from "@/lib/catalog";

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:py-16">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          Catálogo
        </h1>

        {products.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
            Aún no hay productos publicados.
          </p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
