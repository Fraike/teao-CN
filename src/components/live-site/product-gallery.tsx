"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/product-content";

export default function ProductGallery({ images, altBase }: { images: ProductImage[]; altBase: string }) {
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, images.length - 1);
  const current = images[safeIndex];

  if (!current) return null;

  return (
    <div onContextMenu={event => event.preventDefault()}>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_50px_rgba(30,30,32,0.06)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(232,120,26,0.06),transparent_45%)]" />
        <Image
          key={current.url}
          src={current.url}
          alt={`${altBase} 产品图 ${safeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 90vw, 460px"
          className="object-contain p-8 lg:p-10"
          priority
          draggable={false}
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5" aria-label="产品图片">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              aria-label={`查看产品图片 ${index + 1}`}
              aria-pressed={safeIndex === index}
              onClick={() => setActive(index)}
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
                safeIndex === index ? "border-brand-500 shadow-[0_6px_16px_rgba(232,120,26,0.16)]" : "border-line opacity-80 hover:border-brand-500 hover:opacity-100"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="96px" className="object-contain p-1.5" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
