"use client";

import { useState, useRef } from "react";
import { UploadCloud, Copy, Check, Loader2, ImageIcon } from "lucide-react";

export function ImageLinkTool() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setError(null);
    setUrl("");
    setCopied(false);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = { error: `Sunucu yanıtı okunamadı (HTTP ${res.status})` }; }
      if (!res.ok || !data.url) throw new Error(data.error || `Yükleme başarısız (HTTP ${res.status})`);
      // Göreli URL ise tam adrese çevir
      setUrl(data.url.startsWith("http") ? data.url : `${window.location.origin}${data.url}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* pano izni yoksa kullanıcı elle kopyalar */
    }
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-green-200 bg-green-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Önizleme" className="h-full w-full object-contain" />
          ) : (
            <ImageIcon size={26} className="text-green-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {uploading ? "Yükleniyor…" : url ? "Yeni Görsel Yükle" : "Görsel Yükle"}
          </button>
          <p className="mt-2 text-xs text-ink/50">JPEG / PNG / WebP · en fazla 5MB</p>
          {error && <p className="mt-1 text-xs text-orange-600">{error}</p>}

          {url && (
            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-ink/60">Görsel Adresi (URL)</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full truncate rounded-lg border border-green-200 bg-green-50/50 px-3 py-2.5 text-sm text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={copy}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold ${copied ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-ink/50">
                Bu adresi başka panellere (logo/görsel URL alanı) yapıştırabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>

      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} className="hidden" />
    </div>
  );
}
