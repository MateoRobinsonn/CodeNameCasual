import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductImage } from "@/components/product-image";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { getProductBySlug } from "@/lib/catalog";
import { productImageUrl } from "@/lib/utils";

export default async function ProductPage({
  params,
}: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const activeVariants = product.variants.filter((v) => v.active);
  const mainImage = product.product_images[0];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary">
              <ProductImage
                src={mainImage ? productImageUrl(mainImage.path) : null}
                alt={mainImage?.alt_text || product.name}
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
            {product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.product_images.slice(1).map((image) => (
                  <div
                    key={image.path}
                    className="relative aspect-square overflow-hidden rounded-lg bg-secondary"
                  >
                    <ProductImage
                      src={productImageUrl(image.path)}
                      alt={image.alt_text || product.name}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {product.category}
              </p>
              <h1 className="mt-1 font-display text-3xl text-foreground">
                {product.name}
              </h1>
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="border-t border-border pt-6">
              {activeVariants.length > 0 ? (
                <AddToCartForm
                  productSlug={product.slug}
                  productName={product.name}
                  imagePath={mainImage?.path ?? null}
                  variants={activeVariants}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin variantes disponibles por el momento.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
