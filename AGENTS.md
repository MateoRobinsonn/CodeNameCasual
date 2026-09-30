# Intimo y Casual: build brief for Claude Code

## Purpose
Build a responsive Colombian lingerie and underwear storefront for one seller (the owner's mother) and many buyers. The initial product is a website optimized for Android Chrome and usable on laptops. The storefront is in Spanish for Colombia, priced in COP. The owner will develop it, but the mother owns the merchant account and receives all payments. Do not assume the developer is the merchant of record.

## Recommended stack
- Next.js App Router, TypeScript, React, Tailwind CSS and accessible component primitives (for example shadcn/ui) for storefront and admin.
- Supabase Postgres for products, variants, inventory, carts/orders and shipping records; Supabase Storage for product images; Supabase Auth for the single seller admin. Use SQL migrations and Row Level Security (RLS).
- Deploy the Next.js application on a host supporting server routes and HTTPS (Vercel is a reasonable default). Configure separate test and production environments.
- Integrate Wompi Colombia Web Checkout first, using the merchant account and settlement account controlled by the mother. Keep payment code behind an adapter so Mercado Pago Checkout Pro or Bold can replace it if onboarding or product-category review requires it.
- Inter Rapidísimo for delivery, handled manually by the mother. The website records order and shipment status and lets her enter a guide/tracking number. Do not build carrier API integration, automatic quotes, labels, pickup booking or tracking synchronization.
- Use a transactional email service for order and shipping notifications; SMS can be added if the mother chooses a provider and accepts its cost. Keep notification sending server-side and record delivery attempts/status.

## Buyer experience
- Home, category/search/filter, product detail, cart, checkout, order confirmation and order status.
- Product images, Spanish name/description, category, size guide, colors, price, availability, care details and discreet shipping/packaging information. Maintain stock per size/color variant, with SKU and optional weight/dimensions.
- Mobile-first design: fast images, readable type, large touch targets, compact navigation, persistent cart, short address form and clear payment return states. Test narrow Android viewport and laptop width.
- Guest checkout first. Capture buyer name, phone, email, Colombian department/municipality, address and delivery notes. Buyer accounts can come later.
- Show shipping charge and total before sending the buyer to payment. If live quoting is unavailable, use a documented zone/rate table or a clearly disclosed flat rate configured by admin; do not promise a rate that has not been established.
- Store only the personal details needed to fulfill and support orders. Provide privacy policy, terms, shipping/returns policy, and a discreet notification approach. Confirm applicable Colombian consumer and data requirements with the merchant before launch.
- Show a clear "Escríbenos" contact button on product pages and in the site footer, opening the mother's business WhatsApp with an optional prefilled product link/message. Messenger may be added if she prefers it. Keep her personal number out of the site unless she approves publishing it; use a business contact number/account.

## Seller experience
- Exactly one initial admin, provisioned by the developer through a secure setup step. No public admin registration. Enable MFA when available.
- Admin dashboard to create, edit, publish/unpublish and archive products; upload/reorder images; manage size/color variants, prices and stock; view and update orders, shipping charges/status and guide numbers.
- When payment is confirmed, notify the mother by email (or SMS if configured) with the order number, items, quantities and a link to the admin order. Avoid placing the buyer's full address in a text notification; she can view it after signing in.
- The mother prepares the package and takes or arranges it with Inter Rapidísimo herself. After she enters the guide number and marks the order shipped, email or text the buyer the tracking number and a link to the carrier's public tracking page. Prevent duplicate notifications on repeated saves.
- Use archive/soft delete for products that appear on past orders so receipts retain their original product snapshots.
- Order states: awaiting_payment, paid, preparing, shipped, delivered, canceled, refunded. Payment state is separate from fulfillment state.

## Data model starting point
- products(id, slug, name, description, category, status, created_at, updated_at)
- product_images(id, product_id, path, sort_order, alt_text)
- variants(id, product_id, sku, size, color, price_cop_minor, stock_on_hand, active)
- orders(id, order_number, buyer contact/address snapshot, subtotal_cop_minor, shipping_cop_minor, total_cop_minor, payment_status, fulfillment_status, created_at)
- order_items(id, order_id, variant_id nullable, SKU/name/size/color/price snapshots, quantity)
- payments(id, order_id, provider, provider_reference unique, provider_transaction_id, status, amount_cop_minor, updated_at)
- shipments(id, order_id, carrier, guide_number, shipping_cost_cop_minor, status, tracking_url)
- notifications(id, order_id, recipient_type, channel, template, status, sent_at, provider_message_id) for reliable, deduplicated delivery
- payment_events(provider, event_id unique, payload metadata, processed_at) for idempotent webhook handling; avoid storing unnecessary sensitive payload fields.

## Payment and inventory rules
- Create a pending order and a unique payment reference on the server. Recompute item prices, inventory and shipping on the server; never trust totals or admin flags from the browser.
- Use the mother's own verified Colombian merchant account, bank settlement details and provider credentials. Keep keys in server environment variables; never commit secrets or expose private keys to the browser.
- Use provider-hosted checkout. Do not collect or store card numbers or CVV. Generate Wompi's required integrity signature server-side according to current official documentation.
- Treat the return URL as informational. Verify provider webhooks and transaction state server-side, match reference and amount, process events idempotently, and mark paid only after provider-confirmed approval. Handle pending, declined, expired, duplicate, refund and chargeback states.
- Reserve inventory atomically with a defined expiration before redirect, or implement another concurrency-safe strategy. Release reservation on expiry/failed payment and deduct/commit only once on confirmed approval. Prevent overselling under concurrent checkouts.
- Never ship an order solely because the buyer reached a success page. Keep audit logs for payment and stock changes.

## Security boundaries
- Public visitors can read only published catalog data. Buyer order and address data is private. Only the authenticated admin can mutate catalog, fulfillment and stock.
- Enforce admin authorization on the server and in database RLS/grants. Do not rely on a hidden admin route, email string sent from the browser, or client-side checks.
- Restrict image uploads by role, MIME type and size; use safe generated paths. Validate all inputs, limit sensitive endpoints, and avoid leaking buyer information through order lookup.
- Keep Supabase service role and Wompi private credentials server-only. Use least-privilege secrets, HTTPS, backups, and separate sandbox/live credentials.

## Implementation sequence
1. Scaffold app, Spanish design system, database migrations, RLS, admin bootstrap and seed products.
2. Build responsive catalog, product variants, cart and seller product editor.
3. Add checkout/order creation, inventory reservation and shipping rate configuration.
4. Integrate Wompi sandbox hosted checkout and verified webhooks. Test paid, pending, declined, duplicate webhook and simultaneous last-item checkout.
5. Add manual fulfillment, Inter Rapidísimo guide entry, mother/buyer notifications, WhatsApp contact links and policy pages.
6. Run end-to-end tests on Android Chrome and laptop, then test a small live purchase/refund with the mother's approval before launch.

## Decisions to confirm before live payments
- Mother's legal merchant identity and bank account, Wompi eligibility for the exact catalog, fees and settlement terms.
- Origin city, delivery coverage, shipping fee to charge at checkout, packaging and the mother's manual drop-off or pickup workflow. No carrier API agreement is needed for this scope.
- Mother's business WhatsApp or Messenger account, notification email/phone, buyer email or SMS preference, and the transactional notification provider.
- Product catalog, sizes, return policy for intimate items, business contact details and branding/assets.
- Tax/invoicing and privacy compliance with a qualified Colombian advisor. Do not invent legal or tax rules in code.

## Development guidance
Make small, reviewable changes. Preserve existing project conventions if this file is added to an established repository. Prefer provider documentation over assumptions; flag unresolved commercial configuration as TODOs, not invented API behavior. Explain each migration and test the authorization and payment state transitions before calling a feature complete.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
