import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { formatCop, productImageUrl } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  name: string;
  imagePath?: string | null;
  imageAlt?: string | null;
  priceFromCopMinor?: number | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary">
        <ProductImage
          src={product.imagePath ? productImageUrl(product.imagePath) : null}
          alt={product.imageAlt || product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-foreground">{product.name}</p>
        {product.priceFromCopMinor != null && (
          <p className="text-sm text-muted-foreground">
            Desde {formatCop(product.priceFromCopMinor)}
          </p>
        )}
      </div>
    </Link>
  );
}
