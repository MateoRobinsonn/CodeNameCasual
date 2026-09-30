import type { NextConfig } from "next";

const supabaseProjectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseProjectRef
      ? [{ protocol: "https", hostname: supabaseProjectRef, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  experimental: {
    // Matches the 5MB cap on the product-images storage bucket
    // (supabase/migrations/0002_storage.sql), plus headroom for the
    // rest of the product form's fields.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
