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
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface to-white">
        <Image
          key={current.url}
          src={current.url}
          alt={`${altBase} 产品图 ${safeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 90vw, 460px"
          className="object-contain p-6"
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
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
                safeIndex === index ? "border-brand-500" : "border-line hover:border-brand-500"
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
