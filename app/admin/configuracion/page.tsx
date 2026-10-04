import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function sendPasswordReset(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${protocol}://${host}/admin/restablecer-contrasena`,
  });

  redirect(
    error
      ? `/admin/configuracion?error=${encodeURIComponent(error.message)}`
      : "/admin/configuracion?sent=1",
  );
}

export default async function AdminSettingsPage({
  searchParams,
}: PageProps<"/admin/configuracion">) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  const params = await searchParams;
  const sent = params.sent === "1";
  const error = typeof params.error === "string" ? params.error : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="max-w-xl space-y-10">
      <h1 className="font-display text-2xl text-foreground">Configuración</h1>

      <section className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Cuenta</h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Correo</p>
          <p className="mt-1 text-card-foreground">{user?.email}</p>

          {sent && (
            <p className="mt-4 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
              Te enviamos un correo con un enlace para cambiar tu contraseña.
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
              {error}
            </p>
          )}

          <form action={sendPasswordReset} className="mt-4">
            <input type="hidden" name="email" value={user?.email ?? ""} />
            <button
              type="submit"
              className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
            >
              Enviar enlace para cambiar contraseña
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg text-foreground">
          Información de la tienda
        </h2>
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 text-sm">
          <div>
            <p className="text-muted-foreground">Número de WhatsApp</p>
            <p className="mt-1 text-card-foreground">
              {whatsappNumber ?? "No configurado"}
            </p>
          </div>
          <p className="text-muted-foreground">
            Para cambiar este número, pide ayuda a tu desarrollador.
          </p>
        </div>
      </section>
    </div>
  );
}
