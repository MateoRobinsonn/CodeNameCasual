import { randomUUID } from "node:crypto";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProductStatus } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils";

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status: ProductStatus =
    formData.get("status") === "draft" ? "draft" : "published";
  const size = String(formData.get("size") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const priceCop = Math.round(Number(formData.get("price") ?? 0));
  const stock = Math.round(Number(formData.get("stock") ?? 0));
  const image = formData.get("image");

  if (!name || !category || !size || !color || !priceCop) {
    redirect(
      `/admin/productos/nuevo?error=${encodeURIComponent(
        "Completa nombre, categoría, talla, color y precio.",
      )}`,
    );
  }

  const supabase = await createClient();
  const baseSlug = slugify(name);

  let product;
  for (const slug of [baseSlug, `${baseSlug}-${randomUUID().slice(0, 4)}`]) {
    const { data, error } = await supabase
      .from("products")
      .insert({ name, slug, category, description, status })
      .select("id, slug")
      .single();

    if (!error) {
      product = data;
      break;
    }
    if (error.code !== "23505") {
      redirect(
        `/admin/productos/nuevo?error=${encodeURIComponent(error.message)}`,
      );
    }
  }

  if (!product) {
    redirect(
      `/admin/productos/nuevo?error=${encodeURIComponent(
        "No se pudo crear el producto. Intenta con otro nombre.",
      )}`,
    );
  }

  const sku = `${baseSlug}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
  await supabase.from("variants").insert({
    product_id: product.id,
    sku,
    size,
    color,
    price_cop_minor: priceCop * 100,
    stock_on_hand: stock,
    active: true,
  });

  if (image instanceof File && image.size > 0) {
    const ext = image.name.split(".").pop() || "jpg";
    const path = `${product.id}/${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, image, { contentType: image.type || "image/jpeg" });

    if (!uploadError) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        path,
        sort_order: 0,
        alt_text: name,
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export default async function NewProductPage({
  searchParams,
}: PageProps<"/admin/productos/nuevo">) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-2xl text-foreground">
        Nuevo producto
      </h1>

      {error && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      <form action={createProduct} className="flex flex-col gap-5">
        <Field label="Nombre">
          <input
            name="name"
            required
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </Field>

        <Field label="Categoría">
          <input
            name="category"
            required
            placeholder="Conjuntos, Bodies, Pijamas..."
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </Field>

        <Field label="Descripción">
          <textarea
            name="description"
            rows={3}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          />
        </Field>

        <Field label="Estado">
          <select
            name="status"
            defaultValue="published"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
          >
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Talla">
            <input
              name="size"
              required
              placeholder="S, M, L"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
            />
          </Field>
          <Field label="Color">
            <input
              name="color"
              required
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (COP)">
            <input
              name="price"
              type="number"
              min={0}
              required
              placeholder="89000"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
            />
          </Field>
          <Field label="Stock">
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={0}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
            />
          </Field>
        </div>

        <Field label="Imagen (opcional)">
          <input
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="text-sm text-muted-foreground"
          />
        </Field>

        <button
          type="submit"
          className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Crear producto
        </button>
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
