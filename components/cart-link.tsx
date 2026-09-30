"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/carrito"
      className="flex items-center gap-1.5 transition-colors hover:text-foreground"
    >
      Carrito
      {itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
