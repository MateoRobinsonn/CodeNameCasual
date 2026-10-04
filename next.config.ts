import type { NextConfig } from "next";

const supabaseProjectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const isProd = process.env.NODE_ENV === "production";

// Wompi's hosted checkout is reached via a full-page redirect
// (lib/payments/wompi.ts buildCheckoutUrl), not an iframe/fetch/form-post,
// so it needs no CSP allowance yet. If a Wompi JS widget or iframe is added
// later, extend script-src/frame-src/connect-src with checkout.wompi.co then.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://*.supabase.co`,
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];
// Dev serves plain HTTP; upgrade-insecure-requests would make the browser
// rewrite every asset/navigation request to https:// and fail to connect.
if (isProd) cspDirectives.push("upgrade-insecure-requests");
const contentSecurityPolicy = cspDirectives.join("; ");

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
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
    ];
    // HSTS tells the browser to remember "always use HTTPS for this host" —
    // sending it from the plain-HTTP dev server breaks localhost until that
    // policy expires/is cleared. Vercel serves production over HTTPS, so
    // this only ever reaches real browsers there.
    if (isProd) {
      headers.unshift({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" });
    }
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
