-- Product image storage: public read, admin-only writes, restricted to
-- image MIME types and a 5MB cap per file.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "admin write product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());

create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin())
  with check (bucket_id = 'product-images' and is_admin());

create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());
