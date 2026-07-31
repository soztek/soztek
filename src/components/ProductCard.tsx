import Link from "next/link";
import { Star, Truck } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./cart/AddToCartButton";
import type { ProductDTO } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductDTO }) {
  const discount = discountPercent(product.price, product.compareAt);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-green-100 bg-white card-shadow hover-lift">
      <Link href={`/urun/${product.slug}`} className="relative block">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          emoji={product.categoryEmoji}
          className="aspect-square"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount && (
            <span className="rounded-md bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow">
              %{discount} İNDİRİM
            </span>
          )}
          {product.freeShip && (
            <span className="flex items-center gap-1 rounded-md bg-green-800/90 px-2 py-1 text-[10px] font-semibold text-white shadow">
              <Truck size={11} /> Ücretsiz Kargo
            </span>
          )}
        </div>
        {product.stock <= 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-green-900/80 py-1 text-center text-xs font-semibold text-white">
            Stokta Yok
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand ? (
          <span className="text-[11px] font-bold uppercase tracking-wide text-green-500">
            {product.brand}
          </span>
        ) : (
          product.categoryName && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-500">
              {product.categoryName}
            </span>
          )
        )}
        <Link href={`/urun/${product.slug}`} className="mt-1 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition group-hover:text-orange-600 sm:text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-xs text-ink/60">
          <Star size={13} className="fill-orange-400 text-orange-400" />
          <span className="font-semibold text-ink/80">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
          {product.sku && <span className="ml-auto truncate text-ink/40">{product.sku}</span>}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-green-800">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-ink/40 line-through">{formatPrice(product.compareAt)}</span>
          )}
        </div>

        <div className="mt-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
