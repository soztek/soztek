"use client";

import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  imageUrl,
  alt,
  emoji,
}: {
  images: string[];
  imageUrl?: string | null;
  alt: string;
  emoji?: string | null;
}) {
  const gallery = images.length ? images : imageUrl ? [imageUrl] : [];
  const [active, setActive] = useState(0);
  const current = gallery[active] ?? imageUrl ?? null;

  return (
    <div>
      <ProductImage src={current} alt={alt} emoji={emoji} className="aspect-square rounded-3xl border border-green-100" />

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {gallery.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border-2 bg-white transition",
                i === active ? "border-orange-500" : "border-green-100 hover:border-green-300"
              )}
              aria-label={`Görsel ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
