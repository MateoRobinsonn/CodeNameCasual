import { LingeriePlaceholder } from "@/components/demo/lingerie-placeholder";
import type { DemoProduct } from "@/lib/demo/products";
import { formatCop } from "@/lib/utils";

export function DemoProductCard({ product }: { product: DemoProduct }) {
  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <LingeriePlaceholder
          silhouette={product.silhouette}
          tone={product.tone}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground backdrop-blur">
          Vista previa
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-foreground">{product.name}</p>
        <p className="text-sm text-muted-foreground">
          Desde {formatCop(product.priceFromCopMinor)}
        </p>
      </div>
    </div>
  );
}
