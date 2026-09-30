-- Sample catalog for local development. Safe to run repeatedly.

insert into products (id, slug, name, description, category, status)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'conjunto-encaje-rosa',
    'Conjunto de encaje rosa',
    'Conjunto de brasier y panty en encaje suave, copa sin varilla.',
    'Conjuntos',
    'published'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'body-negro-clasico',
    'Body negro clásico',
    'Body de licra con acabado mate, tirantes ajustables.',
    'Bodies',
    'published'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'pijama-satinada-vino',
    'Pijama satinada vino',
    'Conjunto de pijama en satín, top y short.',
    'Pijamas',
    'draft'
  )
on conflict (id) do nothing;

insert into variants (product_id, sku, size, color, price_cop_minor, stock_on_hand, active)
values
  ('00000000-0000-0000-0000-000000000001', 'CER-RS-S', 'S', 'Rosa', 8900000, 12, true),
  ('00000000-0000-0000-0000-000000000001', 'CER-RS-M', 'M', 'Rosa', 8900000, 9, true),
  ('00000000-0000-0000-0000-000000000001', 'CER-RS-L', 'L', 'Rosa', 8900000, 5, true),
  ('00000000-0000-0000-0000-000000000002', 'BNC-NG-S', 'S', 'Negro', 11500000, 7, true),
  ('00000000-0000-0000-0000-000000000002', 'BNC-NG-M', 'M', 'Negro', 11500000, 10, true),
  ('00000000-0000-0000-0000-000000000003', 'PSV-VN-M', 'M', 'Vino', 15900000, 4, true)
on conflict (sku) do nothing;

-- Placeholder paths only; upload real files to the product-images bucket
-- and update these rows once the admin has real photography.
insert into product_images (product_id, path, sort_order, alt_text)
values
  ('00000000-0000-0000-0000-000000000001', 'placeholder/conjunto-encaje-rosa-1.jpg', 0, 'Conjunto de encaje rosa'),
  ('00000000-0000-0000-0000-000000000002', 'placeholder/body-negro-clasico-1.jpg', 0, 'Body negro clásico')
on conflict do nothing;
