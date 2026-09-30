"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "src" | "onError" | "alt"> & {
  src?: string | null;
  alt: string;
};

/** Falls back to a placeholder icon if there's no image, or the image 404s. */
export function ProductImage({ src, alt, className, ...rest }: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <ImagePlaceholder className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className ?? ""}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-10 w-10 text-muted-foreground/40"
      >
        <path
          d="M24 6c-3.3 0-6 2.7-6 6h12c0-3.3-2.7-6-6-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 12 6 20l4 6 3-2v16h22V24l3 2 4-6-12-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
