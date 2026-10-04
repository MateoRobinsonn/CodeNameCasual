import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";

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
    // On mobile this is an exact-height flex shell (header, scrollable
    // main, bottom nav) instead of a fixed-position bottom bar: iOS
    // Safari/Chrome only reconcile `position: fixed; bottom: 0` against
    // the real viewport once the page scrolls, so on short pages (nothing
    // to scroll) the toolbar never collapses and a fixed bar ends up
    // stranded mid-page instead of pinned to the bottom. Pinning it via
    // flexbox instead — nav as the last flex child of a column that's
    // exactly 100dvh tall — sidesteps that bug entirely. Desktop drops
    // the height constraint and scrolls the page normally, as before.
    <div className="flex h-dvh flex-col bg-muted md:h-auto md:min-h-screen">
      {/* Desktop: full top bar with inline nav + account controls. */}
      <header className="hidden shrink-0 border-b border-border bg-card md:block">
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

      {/* Mobile: slim top bar, just the brand + sign out — primary nav
          lives in the bottom tab bar instead, within thumb reach. */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link href="/admin" className="font-display text-base text-foreground">
          Íntimo y Casual
        </Link>
        {user && (
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-secondary"
            >
              Salir
            </button>
          </form>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-8">
        {children}
      </main>

      {user && <AdminBottomNav />}
    </div>
  );
}
