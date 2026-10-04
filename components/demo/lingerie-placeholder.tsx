import type { DemoSilhouette, DemoTone } from "@/lib/demo/products";

const TONE_GRADIENTS: Record<DemoTone, string> = {
  blush: "from-[#fbe9eb] to-[#f1c9ce]",
  cream: "from-[#f8f3ec] to-[#e9dcc8]",
  sage: "from-[#eef1ea] to-[#d8e2cc]",
  terracotta: "from-[#f5e3da] to-[#e3b79f]",
};

/** Minimal line-art stand-ins for product photography — no real images on this branch. */
function SilhouetteIcon({ silhouette }: { silhouette: DemoSilhouette }) {
  const common = {
    viewBox: "0 0 100 100",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (silhouette) {
    case "bra":
      return (
        <svg {...common}>
          <path d="M20 38c0-10 8-16 16-12 4 2 6 6 6 10" />
          <path d="M80 38c0-10-8-16-16-12-4 2-6 6-6 10" />
          <path d="M20 38c-2 14 6 26 18 28" />
          <path d="M80 38c2 14-6 26-18 28" />
          <path d="M38 66c4 2 8 2 12 0" />
          <path d="M20 38H10M80 38h10" />
        </svg>
      );
    case "brief":
      return (
        <svg {...common}>
          <path d="M22 30h56l-6 16c-2 6-4 10-4 16 0 10-8 18-18 18s-18-8-18-18c0-6-2-10-4-16Z" />
          <path d="M22 30c-4 0-8 2-10 6M78 30c4 0 8 2 10 6" />
        </svg>
      );
    case "bodysuit":
      return (
        <svg {...common}>
          <path d="M28 24c0-8 6-14 14-14h16c8 0 14 6 14 14" />
          <path d="M28 24c-3 10 1 20 7 24-4 4-7 10-7 18 0 10 8 20 22 20s22-10 22-20c0-8-3-14-7-18 6-4 10-14 7-24" />
          <path d="M42 16c2 6 6 10 8 10s6-4 8-10" />
        </svg>
      );
    case "robe":
      return (
        <svg {...common}>
          <path d="M34 18 24 28v54h16V46l10 10 10-10v36h16V28L66 18" />
          <path d="M50 46v36M34 18c4 6 10 10 16 10s12-4 16-10" />
        </svg>
      );
  }
}

export function LingeriePlaceholder({
  silhouette,
  tone,
  className,
}: {
  silhouette: DemoSilhouette;
  tone: DemoTone;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${TONE_GRADIENTS[tone]} ${className ?? ""}`}
    >
      {/* Fixed dark tone, not the theme-reactive foreground token — the
          gradient behind it is always light regardless of OS theme. */}
      <div className="h-2/5 w-2/5 text-neutral-900/35">
        <SilhouetteIcon silhouette={silhouette} />
      </div>
    </div>
  );
}
