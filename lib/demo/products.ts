export type DemoSilhouette = "bra" | "brief" | "bodysuit" | "robe";
export type DemoTone = "blush" | "cream" | "sage" | "terracotta";

export type DemoProduct = {
  slug: string;
  name: string;
  collection: string;
  silhouette: DemoSilhouette;
  tone: DemoTone;
  priceFromCopMinor: number;
};

export const DEMO_COLLECTIONS: { name: string; eyebrow: string }[] = [
  { name: "Esencial", eyebrow: "Todos los días" },
  { name: "Encaje", eyebrow: "Edición limitada" },
  { name: "Noche", eyebrow: "Para dormir" },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  { slug: "demo-esencial-balance", name: "Conjunto Balance", collection: "Esencial", silhouette: "bodysuit", tone: "blush", priceFromCopMinor: 14900000 },
  { slug: "demo-esencial-suave", name: "Brasier Suave", collection: "Esencial", silhouette: "bra", tone: "cream", priceFromCopMinor: 8900000 },
  { slug: "demo-esencial-contorno", name: "Panty Contorno", collection: "Esencial", silhouette: "brief", tone: "sage", priceFromCopMinor: 5900000 },
  { slug: "demo-esencial-segunda-piel", name: "Brasier Segunda Piel", collection: "Esencial", silhouette: "bra", tone: "terracotta", priceFromCopMinor: 9900000 },
  { slug: "demo-encaje-devocion", name: "Conjunto Devoción", collection: "Encaje", silhouette: "bodysuit", tone: "terracotta", priceFromCopMinor: 18900000 },
  { slug: "demo-encaje-marea", name: "Brasier Marea", collection: "Encaje", silhouette: "bra", tone: "blush", priceFromCopMinor: 11900000 },
  { slug: "demo-encaje-rocio", name: "Panty Rocío", collection: "Encaje", silhouette: "brief", tone: "cream", priceFromCopMinor: 6900000 },
  { slug: "demo-encaje-penumbra", name: "Conjunto Penumbra", collection: "Encaje", silhouette: "bodysuit", tone: "sage", priceFromCopMinor: 19900000 },
  { slug: "demo-noche-arrullo", name: "Bata Arrullo", collection: "Noche", silhouette: "robe", tone: "cream", priceFromCopMinor: 16900000 },
  { slug: "demo-noche-quietud", name: "Conjunto Quietud", collection: "Noche", silhouette: "bodysuit", tone: "blush", priceFromCopMinor: 17900000 },
  { slug: "demo-noche-susurro", name: "Bata Susurro", collection: "Noche", silhouette: "robe", tone: "terracotta", priceFromCopMinor: 15900000 },
  { slug: "demo-noche-calma", name: "Brasier Calma", collection: "Noche", silhouette: "bra", tone: "sage", priceFromCopMinor: 9900000 },
];

export function demoProductsByCollection(collection: string) {
  return DEMO_PRODUCTS.filter((product) => product.collection === collection);
}
