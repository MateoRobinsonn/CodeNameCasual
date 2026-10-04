/**
 * One switch for every piece of placeholder content on this branch (demo
 * products, demo images, editorial showcase sections). Set
 * NEXT_PUBLIC_DEMO_MODE=false in the environment before going to production
 * and the whole storefront falls back to real Supabase-driven content —
 * no hunting down and deleting fake rows/images one by one.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

if (DEMO_MODE && process.env.NODE_ENV === "production") {
  console.warn(
    "[demo] NEXT_PUBLIC_DEMO_MODE is not set to \"false\" in a production build — the homepage is showing placeholder products and imagery.",
  );
}
