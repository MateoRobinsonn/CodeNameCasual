import type { CSSProperties } from "react";

const HEARTS = [
  { left: "4%", size: 14, duration: "22s", delay: "0s", opacity: 0.1 },
  { left: "14%", size: 10, duration: "18s", delay: "3s", opacity: 0.08 },
  { left: "26%", size: 18, duration: "26s", delay: "1s", opacity: 0.12 },
  { left: "38%", size: 12, duration: "20s", delay: "6s", opacity: 0.09 },
  { left: "52%", size: 16, duration: "24s", delay: "2s", opacity: 0.11 },
  { left: "64%", size: 11, duration: "19s", delay: "8s", opacity: 0.08 },
  { left: "76%", size: 20, duration: "28s", delay: "4s", opacity: 0.1 },
  { left: "86%", size: 13, duration: "21s", delay: "7s", opacity: 0.09 },
  { left: "94%", size: 15, duration: "25s", delay: "5s", opacity: 0.1 },
];

/** Purely decorative, static CSS-only animation — no client JS, no interactivity. */
export function FloatingHearts() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {HEARTS.map((heart, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="floating-heart"
          style={
            {
              "--heart-left": heart.left,
              "--heart-size": `${heart.size}px`,
              "--heart-duration": heart.duration,
              "--heart-delay": heart.delay,
              "--heart-opacity": heart.opacity,
            } as CSSProperties
          }
        >
          <path d="M12 21s-7.5-4.6-10.2-9.1C-0.3 8.6 1.4 5 5 5c2.1 0 3.6 1.1 4.5 2.3C10.4 6.1 11.9 5 14 5c3.6 0 5.3 3.6 3.2 6.9C19.5 16.4 12 21 12 21Z" />
        </svg>
      ))}
    </div>
  );
}
