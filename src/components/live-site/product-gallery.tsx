"use client";

import Image from "next/image";
import { useState } from "react";

const photos = ["6530c9c0c4925.jpg", "6530c9c0d6a39.jpg", "6530c9ce314c3.jpg", "6530c9ce42e07.jpg"];
export default function ProductGallery() {
  const [active, setActive] = useState(0);
  return <div onContextMenu={event => event.preventDefault()}>
    <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-white">
      <Image src={`/images/live-site/${photos[active]}`} alt={`RD-T038 / RD-V038 产品实拍 ${active + 1}`} fill sizes="(max-width: 768px) 90vw, 440px" className="object-contain" priority draggable={false} />
    </div>
    <div className="mt-3 grid grid-cols-4 gap-3" aria-label="产品图片">
      {photos.map((photo, index) => <button key={photo} type="button" aria-label={`查看产品图片 ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`relative aspect-square cursor-pointer overflow-hidden rounded border-2 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${active === index ? "border-brand-500" : "border-line hover:border-brand-500"}`}>
        <Image src={`/images/live-site/${photo}`} alt="" fill sizes="100px" className="object-contain" draggable={false} />
      </button>)}
    </div>
  </div>;
}
