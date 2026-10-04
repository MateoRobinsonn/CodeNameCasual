"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal: native IntersectionObserver, no animation
 * library. Content is visible by default in the server-rendered HTML
 * (.reveal only hides via CSS once JS/the observer are confirmed working,
 * and a <noscript> rule in layout.tsx hard-disables it for no-JS visitors)
 * so a slow or failed script load never leaves content stuck invisible.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already on screen (or above it) at mount — just show it, no point
    // animating content the visitor can already see.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
