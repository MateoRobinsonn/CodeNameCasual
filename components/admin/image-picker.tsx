"use client";

import { useEffect, useRef, useState } from "react";

export function ImagePicker({ name }: { name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setFileName(null);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not an optimizable remote image */}
          <img
            src={preview}
            alt=""
            className="h-20 w-16 rounded-lg object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm text-card-foreground">{fileName}</p>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-foreground underline underline-offset-2 hover:text-primary"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={clear}
                className="text-muted-foreground underline underline-offset-2 hover:text-primary"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/50 py-10 text-center transition-colors hover:border-primary hover:bg-accent/30"
        >
          <span aria-hidden className="text-3xl">
            📷
          </span>
          <span className="text-sm font-medium text-foreground">
            Agregar foto
          </span>
          <span className="text-xs text-muted-foreground">
            PNG, JPG o WEBP
          </span>
        </button>
      )}
    </div>
  );
}
