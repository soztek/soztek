import { Plus, FileDown, ExternalLink, Link2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveDownloadFile, deleteDownloadFile } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { FileUpload } from "@/components/admin/FileUpload";

export const dynamic = "force-dynamic";

function humanSize(b: number | null) {
  if (!b) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, n = b;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export default async function AdminDownloads() {
  const files = await prisma.downloadFile.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const inputCls = "w-full rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink">Dosyalar</h1>
      <p className="mt-1 text-sm text-ink/60">
        Sürücü, yazılım ve yazıcı kurulum dosyalarını yükleyin ya da üretici indirme linkini girin.
        Bu dosyalar sitede <b>Dosyalar</b> sayfasında müşterilere sunulur.
      </p>

      {/* Yeni dosya */}
      <form action={saveDownloadFile} className="mt-6 space-y-4 rounded-2xl border border-green-100 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Dosya Adı *</label>
            <input name="name" required className={inputCls} placeholder="HP LaserJet M141a Yazıcı Sürücüsü" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Kategori</label>
            <input name="category" list="dosya-kategori" className={inputCls} placeholder="Yazıcı Sürücüleri" />
            <datalist id="dosya-kategori">
              <option value="Yazıcı Sürücüleri" />
              <option value="Anakart Sürücüleri" />
              <option value="Ekran Kartı Sürücüleri" />
              <option value="Ağ / Wi-Fi Sürücüleri" />
              <option value="Kamera / Güvenlik Yazılımları" />
              <option value="Yardımcı Programlar" />
              <option value="Kılavuzlar (PDF)" />
            </datalist>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Sürüm (opsiyonel)</label>
            <input name="version" className={inputCls} placeholder="v2.3" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink/70">Açıklama</label>
            <textarea name="description" rows={2} className={inputCls} placeholder="Windows 10/11 64-bit uyumlu tam sürücü paketi" />
          </div>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50/40 p-4">
          <p className="mb-2 text-sm font-semibold text-ink/70">1) Dosya Yükle</p>
          <FileUpload />
          <p className="my-3 text-center text-xs font-medium text-ink/40">— veya —</p>
          <p className="mb-2 text-sm font-semibold text-ink/70">2) Üretici İndirme Linki</p>
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3">
            <Link2 size={16} className="text-ink/40" />
            <input name="linkUrl" className="w-full bg-transparent py-2.5 text-sm outline-none" placeholder="https://support.hp.com/... (dosya yüklemek yerine)" />
          </div>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={16} /> Dosyayı Ekle
        </button>
      </form>

      {/* Mevcut dosyalar */}
      <div className="mt-6 space-y-2">
        {files.length === 0 ? (
          <p className="rounded-xl border border-dashed border-green-200 bg-white p-8 text-center text-sm text-ink/50">
            Henüz dosya eklenmedi.
          </p>
        ) : (
          files.map((f) => (
            <div key={f.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-green-100 bg-white p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-50 text-green-600">
                {f.linkUrl && !f.fileUrl ? <ExternalLink size={18} /> : <FileDown size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{f.name}</p>
                <p className="truncate text-xs text-ink/50">
                  {f.category || "Genel"}
                  {f.version && ` · ${f.version}`}
                  {f.fileSize ? ` · ${humanSize(f.fileSize)}` : f.linkUrl ? " · dış link" : ""}
                  {!f.isActive && " · (gizli)"}
                </p>
              </div>
              <a href={f.fileUrl || f.linkUrl || "#"} target="_blank" rel="noreferrer" className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50">
                Aç
              </a>
              <DeleteButton action={deleteDownloadFile} id={f.id} confirmText={`"${f.name}" silinecek. Emin misiniz?`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
