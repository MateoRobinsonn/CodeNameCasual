"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCop } from "@/lib/utils";

type Variant = {
  id: string;
  size: string;
  color: string;
  price_cop_minor: number;
  stock_on_hand: number;
};

export function AddToCartForm({
  productSlug,
  productName,
  imagePath,
  variants,
}: {
  productSlug: string;
  productName: string;
  imagePath: string | null;
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(
    variants.find((v) => v.stock_on_hand > 0)?.id ?? variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = useMemo(
    () => variants.find((v) => v.id === variantId),
    [variants, variantId],
  );

  const outOfStock = !selected || selected.stock_on_hand <= 0;

  function handleAdd() {
    if (!selected || outOfStock) return;
    addItem(
      {
        variantId: selected.id,
        productSlug,
        productName,
        size: selected.size,
        color: selected.color,
        priceCopMinor: selected.price_cop_minor,
        imagePath,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="variant" className="text-sm text-foreground">
          Talla y color
        </label>
        <select
          id="variant"
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id} disabled={v.stock_on_hand <= 0}>
              {v.size} · {v.color} — {formatCop(v.price_cop_minor)}
              {v.stock_on_hand <= 0 ? " (agotado)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quantity" className="text-sm text-foreground">
            Cantidad
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={selected?.stock_on_hand ?? 1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {outOfStock ? "Agotado" : added ? "Agregado ✓" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
