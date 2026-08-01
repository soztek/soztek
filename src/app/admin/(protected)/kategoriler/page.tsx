import { Plus, Save, CornerDownRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveCategory, deleteCategory } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const topLevel = categories.filter((c) => !c.parentId);
  const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);

  const inputCls = "rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500";

  const ParentSelect = ({ selfId, value }: { selfId?: string; value?: string | null }) => (
    <select name="parentId" defaultValue={value ?? ""} className={`${inputCls} min-w-36`}>
      <option value="">— Ana kategori —</option>
      {topLevel
        .filter((t) => t.id !== selfId)
        .map((t) => (
          <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
        ))}
    </select>
  );

  const Row = ({ c, isChild }: { c: (typeof categories)[number]; isChild?: boolean }) => (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border border-green-100 bg-white p-3 ${isChild ? "ml-6 border-l-2 border-l-orange-200" : ""}`}>
      <form action={saveCategory} className="flex flex-1 flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={c.id} />
        {isChild && <CornerDownRight size={16} className="text-orange-400" />}
        <input name="emoji" defaultValue={c.emoji ?? ""} className={`${inputCls} w-14 text-center`} maxLength={4} />
        <input name="name" defaultValue={c.name} className={`${inputCls} min-w-36 flex-1`} />
        <ParentSelect selfId={c.id} value={c.parentId} />
        <input name="order" type="number" defaultValue={c.order} className={`${inputCls} w-16`} />
        <span className="text-xs text-ink/40">{c._count.products} ürün</span>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50">
          <Save size={14} /> Kaydet
        </button>
      </form>
      <DeleteButton action={deleteCategory} id={c.id} confirmText={`"${c.name}" kategorisi ve içindeki ${c._count.products} ürün silinecek. Emin misiniz?`} />
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink">Kategoriler</h1>

      {/* Yeni kategori */}
      <form action={saveCategory} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-green-100 bg-white p-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Emoji</label>
          <input name="emoji" className={`${inputCls} w-16 text-center`} placeholder="🖥️" maxLength={4} />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-ink/60">Kategori Adı</label>
          <input name="name" required className={`${inputCls} w-full`} placeholder="Yeni kategori adı" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Üst Kategori</label>
          <ParentSelect />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Sıra</label>
          <input name="order" type="number" defaultValue={categories.length} className={`${inputCls} w-20`} />
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={16} /> Ekle
        </button>
      </form>

      {/* Mevcut kategoriler — ağaç görünümü */}
      <div className="mt-4 space-y-2">
        {topLevel.map((c) => (
          <div key={c.id} className="space-y-2">
            <Row c={c} />
            {childrenOf(c.id).map((ch) => (
              <Row key={ch.id} c={ch} isChild />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink/40">
        Not: Alt kategori oluşturmak için &ldquo;Üst Kategori&rdquo; seçin. Bir kategoriyi silmek içindeki tüm ürünleri de siler.
      </p>
    </div>
  );
}
