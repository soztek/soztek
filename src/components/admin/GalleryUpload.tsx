"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Plus, Star } from "lucide-react";

export function GalleryUpload({ defaultImages = [] }: { defaultImages?: string[] }) {
  const [urls, setUrls] = useState<string[]>(defaultImages.filter(Boolean));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const text = await res.text();
        let data: { url?: string; error?: string } = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = { error: `Sunucu yanıtı okunamadı (HTTP ${res.status})` }; }
        if (!res.ok || !data.url) throw new Error(data.error || `Yükleme başarısız (HTTP ${res.status})`);
        setUrls((prev) => [...prev, data.url!]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const remove = (i: number) => setUrls((prev) => prev.filter((_, idx) => idx !== i));
  const makeMain = (i: number) => setUrls((prev) => {
    const copy = [...prev];
    const [x] = copy.splice(i, 1);
    copy.unshift(x);
    return copy;
  });

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">
        Ürün Görselleri <span className="font-normal text-ink/40">(ilk görsel ana görseldir)</span>
      </label>

      {/* her url için gizli input -> formData.getAll("images") */}
      {urls.map((u, i) => (
        <input key={`${u}-${i}`} type="hidden" name="images" value={u} />
      ))}

      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={`${u}-${i}`} className="relative h-28 w-28 overflow-hidden rounded-xl border border-green-200 bg-green-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt={`Görsel ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 ? (
              <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                <Star size={9} className="fill-white" /> Ana
              </span>
            ) : (
              <button type="button" onClick={() => makeMain(i)} title="Ana görsel yap" className="absolute left-1 top-1 rounded-full bg-ink/60 px-1.5 py-0.5 text-[10px] font-semibold text-white hover:bg-orange-500">
                Ana yap
              </button>
            )}
            <button type="button" onClick={() => remove(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/60 text-white hover:bg-red-500" aria-label="Kaldır">
              <X size={13} />
            </button>
          </div>
        ))}

        {/* ekle butonu */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid h-28 w-28 place-items-center gap-1 rounded-xl border-2 border-dashed border-green-300 text-green-700 hover:border-orange-400 hover:bg-green-50 disabled:opacity-60"
        >
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <Plus size={22} />}
          <span className="text-xs font-semibold">{uploading ? "Yükleniyor…" : "Görsel Ekle"}</span>
        </button>
      </div>

      <p className="mt-2 text-xs text-ink/50">
        <Upload size={12} className="mr-1 inline" /> JPEG / PNG / WebP · birden fazla seçebilirsiniz · en fazla 5MB
      </p>
      {error && <p className="mt-1 text-xs text-orange-600">{error}</p>}
    </div>
  );
}
