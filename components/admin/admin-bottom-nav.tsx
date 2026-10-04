"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/admin",
    label: "Inicio",
    match: (path: string) => path === "/admin",
    icon: (
      <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />
    ),
  },
  {
    href: "/admin/productos",
    label: "Productos",
    match: (path: string) => path.startsWith("/admin/productos"),
    icon: (
      <path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Zm0 0V17l8 3.5 8-3.5V7.5M12 11v9.5" />
    ),
  },
  {
    href: "/admin/configuracion",
    label: "Ajustes",
    match: (path: string) => path === "/admin/configuracion",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H4.5a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 6.15 9.4a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1.03-1.56V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.56 1.03h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
      </>
    ),
  },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex shrink-0 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegación principal"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden
            >
              {tab.icon}
            </svg>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
