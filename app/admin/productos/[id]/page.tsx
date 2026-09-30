import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProductStatus } from "@/lib/supabase/types";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

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
    .select("id, name, category, description, status, variants(*)")
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

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

      <form action={updateProduct} className="flex flex-col gap-5">
        <input type="hidden" name="product_id" value={product.id} />
        <input
          type="hidden"
          name="variant_ids"
          value={product.variants.map((v) => v.id).join(",")}
        />

        <Field label="Nombre">
          <input
            name="name"
            required
            defaultValue={product.name}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </Field>

        <Field label="Categoría">
          <input
            name="category"
            required
            defaultValue={product.category}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </Field>

        <Field label="Descripción">
          <textarea
            name="description"
            rows={3}
            defaultValue={product.description}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </Field>

        <Field label="Estado">
          <select
            name="status"
            defaultValue={product.status}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          >
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
            <option value="archived">Archivado</option>
          </select>
        </Field>

        {product.variants.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-border pt-5">
            <p className="text-sm text-foreground">Variantes</p>
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-3 rounded-lg border border-border bg-card p-3"
              >
                <span className="text-sm text-card-foreground">
                  {variant.size} · {variant.color}
                </span>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Precio
                  </span>
                  <input
                    name={`price-${variant.id}`}
                    type="number"
                    min={0}
                    defaultValue={Math.round(variant.price_cop_minor / 100)}
                    className="w-24 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Stock</span>
                  <input
                    name={`stock-${variant.id}`}
                    type="number"
                    min={0}
                    defaultValue={variant.stock_on_hand}
                    className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  />
                </label>
                <label className="flex items-center gap-1.5 pb-1.5">
                  <input
                    name={`active-${variant.id}`}
                    type="checkbox"
                    defaultChecked={variant.active}
                  />
                  <span className="text-xs text-muted-foreground">
                    Activo
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
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

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </label>
  );
}
