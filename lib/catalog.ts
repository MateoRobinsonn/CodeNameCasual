import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/components/product-card";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  product_images: { path: string; alt_text: string; sort_order: number }[];
  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    price_cop_minor: number;
    stock_on_hand: number;
    active: boolean;
  }[];
};

function toCard(product: ProductRow): ProductCardData {
  const image = [...product.product_images].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];
  const activePrices = product.variants
    .filter((v) => v.active)
    .map((v) => v.price_cop_minor);

  return {
    slug: product.slug,
    name: product.name,
    imagePath: image?.path ?? null,
    imageAlt: image?.alt_text ?? null,
    priceFromCopMinor: activePrices.length ? Math.min(...activePrices) : null,
  };
}

export async function getPublishedProducts(): Promise<ProductCardData[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, category, product_images(path, alt_text, sort_order), variants(id, sku, size, color, price_cop_minor, stock_on_hand, active)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return ((data as ProductRow[] | null) ?? []).map(toCard);
}

export async function getProductBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, category, product_images(path, alt_text, sort_order), variants(id, sku, size, color, price_cop_minor, stock_on_hand, active)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;

  const product = data as ProductRow;
  return {
    ...product,
    product_images: [...product.product_images].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  };
}
