export type DemoSilhouette = "bra" | "brief" | "bodysuit" | "robe";
export type DemoTone = "blush" | "cream" | "sage" | "terracotta";

export type DemoProduct = {
  slug: string;
  name: string;
  collection: string;
  silhouette: DemoSilhouette;
  tone: DemoTone;
  priceFromCopMinor: number;
  /**
   * Local path to a free-to-use stock photo (public/demo/) for products
   * where one exists. No robe/sleepwear flat-lay was available without
   * clutter or visible models, so those keep the line-art placeholder —
   * the same fallback the real site uses for products with no photo yet.
   */
  photoPath?: string;
};

export const DEMO_COLLECTIONS: { name: string; eyebrow: string }[] = [
  { name: "Esencial", eyebrow: "Todos los días" },
  { name: "Encaje", eyebrow: "Edición limitada" },
  { name: "Noche", eyebrow: "Para dormir" },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  { slug: "demo-esencial-balance", name: "Conjunto Balance", collection: "Esencial", silhouette: "bodysuit", tone: "blush", priceFromCopMinor: 14900000 },
  { slug: "demo-esencial-suave", name: "Brasier Suave", collection: "Esencial", silhouette: "bra", tone: "cream", priceFromCopMinor: 8900000, photoPath: "/demo/bra-blanca-encaje.jpg" },
  { slug: "demo-esencial-contorno", name: "Panty Contorno", collection: "Esencial", silhouette: "brief", tone: "sage", priceFromCopMinor: 5900000, photoPath: "/demo/panty-lunares.jpg" },
  { slug: "demo-esencial-segunda-piel", name: "Brasier Segunda Piel", collection: "Esencial", silhouette: "bra", tone: "terracotta", priceFromCopMinor: 9900000 },
  { slug: "demo-encaje-devocion", name: "Conjunto Devoción", collection: "Encaje", silhouette: "bodysuit", tone: "terracotta", priceFromCopMinor: 18900000, photoPath: "/demo/conjunto-rosa-encaje.jpg" },
  { slug: "demo-encaje-marea", name: "Brasier Marea", collection: "Encaje", silhouette: "bra", tone: "blush", priceFromCopMinor: 11900000, photoPath: "/demo/bra-negro-sheer.jpg" },
  { slug: "demo-encaje-rocio", name: "Panty Rocío", collection: "Encaje", silhouette: "brief", tone: "cream", priceFromCopMinor: 6900000, photoPath: "/demo/panty-trio-pastel.jpg" },
  { slug: "demo-encaje-penumbra", name: "Conjunto Penumbra", collection: "Encaje", silhouette: "bodysuit", tone: "sage", priceFromCopMinor: 19900000 },
  { slug: "demo-noche-arrullo", name: "Bata Arrullo", collection: "Noche", silhouette: "robe", tone: "cream", priceFromCopMinor: 16900000 },
  { slug: "demo-noche-quietud", name: "Conjunto Quietud", collection: "Noche", silhouette: "bodysuit", tone: "blush", priceFromCopMinor: 17900000, photoPath: "/demo/conjunto-blanco-azul.jpg" },
  { slug: "demo-noche-susurro", name: "Bata Susurro", collection: "Noche", silhouette: "robe", tone: "terracotta", priceFromCopMinor: 15900000 },
  { slug: "demo-noche-calma", name: "Brasier Calma", collection: "Noche", silhouette: "bra", tone: "sage", priceFromCopMinor: 9900000 },
];

export function demoProductsByCollection(collection: string) {
  return DEMO_PRODUCTS.filter((product) => product.collection === collection);
}
