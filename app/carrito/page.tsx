"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/components/cart-provider";
import { formatCop, productImageUrl } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotalCopMinor, updateQuantity, removeItem } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
        <h1 className="font-display text-3xl text-foreground">Carrito</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Tu carrito está vacío.
            </p>
            <Link
              href="/productos"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-8">
            <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 p-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <ProductImage
                      src={
                        item.imagePath ? productImageUrl(item.imagePath) : null
                      }
                      alt={item.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm text-card-foreground">
                        {item.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="h-7 w-7 rounded-full border border-border text-sm text-foreground hover:bg-secondary"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="h-7 w-7 rounded-full border border-border text-sm text-foreground hover:bg-secondary"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-medium text-card-foreground">
                        {formatCop(item.priceCopMinor * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="self-start text-xs text-muted-foreground hover:text-primary"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-card-foreground">
                  {formatCop(subtotalCopMinor)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                El costo de envío se calcula en el siguiente paso.
              </p>
              <button
                type="button"
                disabled
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground opacity-40"
              >
                Pago próximamente
              </button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
