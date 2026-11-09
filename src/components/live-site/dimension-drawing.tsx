"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

export default function DimensionDrawing({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`放大查看 ${alt}`}
        className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-white transition-all hover:border-brand-500 hover:shadow-[0_14px_36px_rgba(232,120,26,0.1)]"
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 680px" className="object-contain p-3" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4 backdrop-blur-sm"
        >
          <div className="relative h-[86vh] w-full max-w-5xl">
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="关闭"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition-colors hover:border-brand-500 hover:text-brand-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
}
