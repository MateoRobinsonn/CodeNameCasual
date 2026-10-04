import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";
  const { redirect } = await import("next/navigation");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-xl text-foreground">
          Supabase no está configurado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Agrega las variables de <code>.env.local</code> descritas en{" "}
          <code>.env.example</code> y corre las migraciones antes de usar el
          panel.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/admin" className="font-display text-lg text-foreground">
            Panel · Íntimo y Casual
          </Link>
          {user && (
            <div className="flex items-center gap-5 text-sm">
              <nav className="flex items-center gap-4 text-muted-foreground">
                <Link href="/admin/productos" className="hover:text-foreground">
                  Productos
                </Link>
                <Link href="/admin/configuracion" className="hover:text-foreground">
                  Configuración
                </Link>
              </nav>
              <form action={signOut} className="flex items-center gap-3">
                <span className="text-muted-foreground">{user.email}</span>
                <button
                  type="submit"
                  className="rounded-md border border-border px-3 py-1 text-foreground hover:bg-secondary"
                >
                  Salir
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
