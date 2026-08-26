import Link from "next/link";
import { Plus, Pencil, Star, Truck, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { CategoryIcon } from "@/components/CategoryIcon";
import { toggleProductActive, deleteProduct } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  // Kategorileri sırala: üst kategori, hemen altına alt kategorileri
  const topLevel = categories.filter((c) => !c.parentId);
  const ordered: typeof categories = [];
  for (const t of topLevel) {
    ordered.push(t);
    ordered.push(...categories.filter((c) => c.parentId === t.id));
  }
  for (const c of categories) if (!ordered.some((o) => o.id === c.id)) ordered.push(c);

  // Ürünleri kategoriye göre grupla
  const byCat = new Map<string, typeof products>();
  for (const p of products) {
    if (!byCat.has(p.categoryId)) byCat.set(p.categoryId, []);
    byCat.get(p.categoryId)!.push(p);
  }
  const groups = ordered.filter((c) => (byCat.get(c.id)?.length ?? 0) > 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">
          Ürünler <span className="text-base font-medium text-ink/40">({products.length})</span>
        </h1>
        <Link href="/admin/urunler/yeni" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={17} /> Yeni Ürün
        </Link>
      </div>

      <p className="mt-2 text-sm text-ink/50">Kategoriye tıklayarak açıp kapatabilirsiniz.</p>

      <div className="mt-4 space-y-3">
        {groups.map((c, idx) => {
          const list = byCat.get(c.id)!;
          const activeCount = list.filter((p) => p.isActive).length;
          const isChild = !!c.parentId;
          return (
            <details key={c.id} open={idx === 0} className={`group overflow-hidden rounded-2xl border border-green-100 bg-white ${isChild ? "ml-4 border-l-2 border-l-orange-200" : ""}`}>
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 hover:bg-green-50">
                <ChevronDown size={18} className="shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
                <CategoryIcon slug={c.slug} className="h-5 w-5 shrink-0 text-green-600" />
                <span className="font-bold text-ink">{c.name}</span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">{list.length} ürün</span>
                {activeCount < list.length && (
                  <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-medium text-ink/50">{list.length - activeCount} pasif</span>
                )}
              </summary>

              <div className="border-t border-green-100">
                <div className="hidden grid-cols-[1fr_120px_120px_160px] gap-3 border-b border-green-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink/40 md:grid">
                  <span>Ürün</span><span>Fiyat</span><span>Durum</span><span className="text-right">İşlem</span>
                </div>
                <div className="divide-y divide-green-50">
                  {list.map((p) => (
                    <div key={p.id} className="grid grid-cols-1 items-center gap-3 px-5 py-3 md:grid-cols-[1fr_120px_120px_160px]">
                      <div className="flex items-center gap-3">
                        <ProductImage src={p.imageUrl} alt={p.name} emoji={p.category.emoji} className="h-11 w-11 shrink-0 rounded-lg" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{p.name}</p>
                          <p className="flex items-center gap-2 text-xs text-ink/50">
                            {p.brand || p.unit} {p.isFeatured && <Star size={11} className="fill-orange-400 text-orange-400" />}
                            {p.freeShip && <Truck size={11} className="text-green-500" />}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-800">{formatPrice(p.price)}</span>
                      <form action={toggleProductActive}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.isActive ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/50"}`}>
                          {p.isActive ? "Aktif" : "Pasif"}
                        </button>
                      </form>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/urunler/${p.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-green-200 text-green-700 hover:bg-green-50">
                          <Pencil size={15} />
                        </Link>
                        <DeleteButton action={deleteProduct} id={p.id} confirmText={`"${p.name}" silinsin mi?`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
