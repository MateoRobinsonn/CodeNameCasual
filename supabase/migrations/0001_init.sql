-- Íntimo y Casual: initial schema
-- One seller (admin), Spanish storefront, COP pricing stored as integer minor units.

create extension if not exists "pgcrypto";

create type product_status as enum ('draft', 'published', 'archived');
create type payment_status as enum ('pending', 'approved', 'declined', 'expired', 'refunded', 'voided');
create type fulfillment_status as enum ('awaiting_payment', 'paid', 'preparing', 'shipped', 'delivered', 'canceled', 'refunded');
create type notification_channel as enum ('email', 'sms');
create type notification_recipient as enum ('buyer', 'seller');
create type notification_status as enum ('pending', 'sent', 'failed');

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null,
  status product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  path text not null,
  sort_order integer not null default 0,
  alt_text text not null default ''
);

create table variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  price_cop_minor integer not null check (price_cop_minor >= 0),
  stock_on_hand integer not null default 0 check (stock_on_hand >= 0),
  active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  buyer_name text not null,
  buyer_phone text not null,
  buyer_email text not null,
  buyer_department text not null,
  buyer_municipality text not null,
  buyer_address text not null,
  buyer_notes text,
  subtotal_cop_minor integer not null check (subtotal_cop_minor >= 0),
  shipping_cop_minor integer not null check (shipping_cop_minor >= 0),
  total_cop_minor integer not null check (total_cop_minor >= 0),
  payment_status payment_status not null default 'pending',
  fulfillment_status fulfillment_status not null default 'awaiting_payment',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  variant_id uuid references variants(id) on delete set null,
  sku text not null,
  product_name text not null,
  size text not null,
  color text not null,
  price_cop_minor integer not null check (price_cop_minor >= 0),
  quantity integer not null check (quantity > 0)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null,
  provider_reference text not null unique,
  provider_transaction_id text,
  status payment_status not null default 'pending',
  amount_cop_minor integer not null check (amount_cop_minor >= 0),
  updated_at timestamptz not null default now()
);

create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  carrier text not null default 'Inter Rapidísimo',
  guide_number text,
  shipping_cost_cop_minor integer not null default 0 check (shipping_cost_cop_minor >= 0),
  status text not null default 'pending',
  tracking_url text
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  recipient_type notification_recipient not null,
  channel notification_channel not null,
  template text not null,
  status notification_status not null default 'pending',
  sent_at timestamptz,
  provider_message_id text,
  created_at timestamptz not null default now(),
  -- one send per order/recipient/channel/template to prevent duplicate notifications
  unique (order_id, recipient_type, channel, template)
);

create table payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();

create trigger orders_set_updated_at before update on orders
  for each row execute function set_updated_at();

create trigger payments_set_updated_at before update on payments
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index products_status_idx on products(status);
create index product_images_product_id_idx on product_images(product_id);
create index variants_product_id_idx on variants(product_id);
create index order_items_order_id_idx on order_items(order_id);
create index payments_order_id_idx on payments(order_id);
create index shipments_order_id_idx on shipments(order_id);
create index notifications_order_id_idx on notifications(order_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The single admin is identified by app_metadata.role = 'admin' on their
-- Supabase Auth JWT (set by scripts/bootstrap-admin.ts, never client-settable).
-- Everything else goes through the server-only service role key, which
-- bypasses RLS entirely and is what order/checkout routes must use.
-- ---------------------------------------------------------------------------

create function is_admin() returns boolean as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$ language sql stable;

alter table products enable row level security;
alter table product_images enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table shipments enable row level security;
alter table notifications enable row level security;
alter table payment_events enable row level security;

-- Public (anon + authenticated) can read published catalog data only.
create policy "public read published products" on products
  for select using (status = 'published' or is_admin());

create policy "public read images of visible products" on product_images
  for select using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
        and (products.status = 'published' or is_admin())
    )
  );

create policy "public read active variants of visible products" on variants
  for select using (
    (active and exists (
      select 1 from products
      where products.id = variants.product_id and products.status = 'published'
    )) or is_admin()
  );

-- Admin-only writes on catalog tables.
create policy "admin write products" on products
  for all using (is_admin()) with check (is_admin());

create policy "admin write product images" on product_images
  for all using (is_admin()) with check (is_admin());

create policy "admin write variants" on variants
  for all using (is_admin()) with check (is_admin());

-- Orders, payments, shipments and notifications are private: only the admin
-- can read/write through the browser. The checkout flow (order creation,
-- payment webhooks, buyer order lookup) runs server-side with the service
-- role key, which is exempt from RLS.
create policy "admin manage orders" on orders
  for all using (is_admin()) with check (is_admin());

create policy "admin manage order items" on order_items
  for all using (is_admin()) with check (is_admin());

create policy "admin manage payments" on payments
  for all using (is_admin()) with check (is_admin());

create policy "admin manage shipments" on shipments
  for all using (is_admin()) with check (is_admin());

create policy "admin manage notifications" on notifications
  for all using (is_admin()) with check (is_admin());

create policy "admin manage payment events" on payment_events
  for all using (is_admin()) with check (is_admin());
