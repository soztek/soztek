import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";
import { saveProduct } from "@/lib/admin-actions";
import { GalleryUpload } from "@/components/admin/GalleryUpload";

export const dynamic = "force-dynamic";

export default async function ProductForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "yeni";

  const [product, categories] = await Promise.all([
    isNew ? null : prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!isNew && !product) notFound();

  const inputCls =
    "w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/urunler" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline">
        <ArrowLeft size={16} /> Ürünlere Dön
      </Link>
      <h1 className="text-2xl font-extrabold text-ink">{isNew ? "Yeni Ürün" : "Ürünü Düzenle"}</h1>

      <form action={saveProduct} className="mt-6 space-y-5">
        {!isNew && <input type="hidden" name="id" value={product!.id} />}

        <div className="rounded-2xl border border-green-100 bg-white p-6">
          <GalleryUpload
            defaultImages={
              product
                ? product.images.length
                  ? product.images
                  : product.imageUrl
                    ? [product.imageUrl]
                    : []
                : []
            }
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-green-100 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Ürün Adı *</label>
            <input name="name" required defaultValue={product?.name ?? ""} className={inputCls} placeholder="ASUS TUF Gaming B650-PLUS Anakart" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Açıklama</label>
            <textarea name="description" rows={3} defaultValue={product?.description ?? ""} className={inputCls} placeholder="Ürün açıklaması" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Kategori *</label>
              <select name="categoryId" required defaultValue={product?.categoryId ?? ""} className={inputCls}>
                <option value="" disabled>Seçin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Marka</label>
              <input name="brand" defaultValue={product?.brand ?? ""} className={inputCls} placeholder="ASUS" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Ürün Kodu (SKU)</label>
              <input name="sku" defaultValue={product?.sku ?? ""} className={inputCls} placeholder="TUF-B650-PLUS" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Birim</label>
              <input name="unit" defaultValue={product?.unit ?? ""} className={inputCls} placeholder="Adet" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Fiyat (₺) *</label>
              <input name="price" required type="number" step="0.01" defaultValue={product ? toNumber(product.price) : ""} className={inputCls} placeholder="620" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Eski Fiyat (₺)</label>
              <input name="compareAt" type="number" step="0.01" defaultValue={product?.compareAt ? toNumber(product.compareAt) : ""} className={inputCls} placeholder="İndirim için (opsiyonel)" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/70">Stok</label>
              <input name="stock" type="number" defaultValue={product?.stock ?? 100} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-2">
            <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
              <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="h-4 w-4 accent-green-600" /> Aktif (sitede görünür)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="h-4 w-4 accent-green-600" /> Öne çıkan
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
              <input type="checkbox" name="freeShip" defaultChecked={product?.freeShip ?? false} className="h-4 w-4 accent-green-600" /> Ücretsiz kargo
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700">
            {isNew ? "Ürünü Oluştur" : "Değişiklikleri Kaydet"}
          </button>
          <Link href="/admin/urunler" className="rounded-full border border-green-200 px-8 py-3 font-semibold text-green-700 hover:bg-green-50">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
