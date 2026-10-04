import { randomUUID } from "node:crypto";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProductStatus } from "@/lib/supabase/types";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { ImagePicker } from "@/components/admin/image-picker";
import { Section, Field, fieldInputClass } from "@/components/admin/product-form-fields";
import { productImageUrl } from "@/lib/utils";

async function updateProduct(formData: FormData) {
  "use server";

  const productId = String(formData.get("product_id"));
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status: ProductStatus =
    formData.get("status") === "draft"
      ? "draft"
      : formData.get("status") === "archived"
        ? "archived"
        : "published";
  const variantIds = String(formData.get("variant_ids") ?? "")
    .split(",")
    .filter(Boolean);

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ name, category, description, status })
    .eq("id", productId);

  if (error) {
    redirect(
      `/admin/productos/${productId}?error=${encodeURIComponent(error.message)}`,
    );
  }

  for (const variantId of variantIds) {
    const price = Math.round(Number(formData.get(`price-${variantId}`) ?? 0));
    const stock = Math.round(Number(formData.get(`stock-${variantId}`) ?? 0));
    const active = formData.get(`active-${variantId}`) === "on";

    await supabase
      .from("variants")
      .update({
        price_cop_minor: price * 100,
        stock_on_hand: stock,
        active,
      })
      .eq("id", variantId);
  }

  const image = formData.get("image");
  const existingImageId = String(formData.get("existing_image_id") ?? "");
  const existingImagePath = String(formData.get("existing_image_path") ?? "");

  if (image instanceof File && image.size > 0) {
    const ext = image.name.split(".").pop() || "jpg";
    const path = `${productId}/${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, image, { contentType: image.type || "image/jpeg" });

    if (!uploadError) {
      if (existingImageId) {
        await supabase
          .from("product_images")
          .update({ path, alt_text: name })
          .eq("id", existingImageId);
      } else {
        await supabase.from("product_images").insert({
          product_id: productId,
          path,
          sort_order: 0,
          alt_text: name,
        });
      }
      // Best-effort cleanup — the swap above already succeeded either way,
      // so a failure here just leaves one orphaned object in storage.
      if (existingImagePath) {
        await supabase.storage.from("product-images").remove([existingImagePath]);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

async function deleteProduct(formData: FormData) {
  "use server";

  const productId = String(formData.get("product_id"));
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", productId);

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps<"/admin/productos/[id]">) {
  const { id } = await params;
  const search = await searchParams;
  const error = typeof search.error === "string" ? search.error : null;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, category, description, status, variants(*), product_images(id, path, alt_text, sort_order)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

  const image = [...product.product_images].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-2xl text-foreground">
        Editar producto
      </h1>

      {error && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      <form action={updateProduct} className="flex flex-col gap-6">
        <input type="hidden" name="product_id" value={product.id} />
        <input
          type="hidden"
          name="variant_ids"
          value={product.variants.map((v) => v.id).join(",")}
        />
        <input type="hidden" name="existing_image_id" value={image?.id ?? ""} />
        <input
          type="hidden"
          name="existing_image_path"
          value={image?.path ?? ""}
        />

        <Section title="Información del producto">
          <Field label="Nombre">
            <input
              name="name"
              required
              defaultValue={product.name}
              className={fieldInputClass}
            />
          </Field>

          <Field label="Categoría">
            <input
              name="category"
              required
              defaultValue={product.category}
              className={fieldInputClass}
            />
          </Field>

          <Field label="Descripción">
            <textarea
              name="description"
              rows={3}
              defaultValue={product.description}
              className={fieldInputClass}
            />
          </Field>

          <Field label="Estado">
            <select
              name="status"
              defaultValue={product.status}
              className={fieldInputClass}
            >
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="archived">Archivado</option>
            </select>
          </Field>
        </Section>

        {product.variants.length > 0 && (
          <Section title="Variantes">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-end sm:gap-3 sm:p-3"
              >
                <span className="text-sm text-foreground">
                  {variant.size} · {variant.color}
                </span>
                <div className="grid grid-cols-2 gap-3 sm:contents">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Precio
                    </span>
                    <input
                      name={`price-${variant.id}`}
                      type="number"
                      min={0}
                      defaultValue={Math.round(variant.price_cop_minor / 100)}
                      className="w-full rounded-md border border-border bg-card px-2 py-2 text-base sm:w-24 sm:py-1 sm:text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Stock</span>
                    <input
                      name={`stock-${variant.id}`}
                      type="number"
                      min={0}
                      defaultValue={variant.stock_on_hand}
                      className="w-full rounded-md border border-border bg-card px-2 py-2 text-base sm:w-20 sm:py-1 sm:text-sm"
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 sm:pb-1.5">
                  <input
                    name={`active-${variant.id}`}
                    type="checkbox"
                    defaultChecked={variant.active}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-muted-foreground sm:text-xs">
                    Activo
                  </span>
                </label>
              </div>
            ))}
          </Section>
        )}

        <Section title="Foto">
          <ImagePicker
            name="image"
            initialImageUrl={image ? productImageUrl(image.path) : null}
          />
        </Section>

        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Guardar cambios
        </button>
      </form>

      <form action={deleteProduct} className="border-t border-border pt-5">
        <input type="hidden" name="product_id" value={product.id} />
        <ConfirmSubmitButton
          confirmMessage={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Eliminar producto
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
