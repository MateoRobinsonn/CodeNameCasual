"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  variantId: string;
  productSlug: string;
  productName: string;
  size: string;
  color: string;
  priceCopMinor: number;
  imagePath: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalCopMinor: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "iyc-cart";
const EMPTY_ITEMS: CartItem[] = [];

let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = EMPTY_ITEMS;
const listeners = new Set<() => void>();

function readItems(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : EMPTY_ITEMS;
  } catch {
    cachedItems = EMPTY_ITEMS;
  }
  return cachedItems;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function persist(items: CartItem[]) {
  cachedRaw = JSON.stringify(items);
  cachedItems = items;
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // storage unavailable (private browsing, quota) — cart just won't persist
  }
  listeners.forEach((listener) => listener());
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readItems, getServerSnapshot);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number) => {
      const current = readItems();
      const existing = current.find((i) => i.variantId === item.variantId);
      const next = existing
        ? current.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [...current, { ...item, quantity }];
      persist(next);
    },
    [],
  );

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const current = readItems();
    const next =
      quantity <= 0
        ? current.filter((i) => i.variantId !== variantId)
        : current.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          );
    persist(next);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    persist(readItems().filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => persist(EMPTY_ITEMS), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCopMinor = items.reduce(
    (sum, i) => sum + i.priceCopMinor * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalCopMinor,
        addItem,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
