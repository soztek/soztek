"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { UploadCloud, Check, Loader2, X } from "lucide-react";

function humanSize(b: number) {
  if (!b) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, n = b;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export function FileUpload({
  defaultUrl = "",
  defaultSize = 0,
}: {
  defaultUrl?: string;
  defaultSize?: number;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [size, setSize] = useState(defaultSize);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setFileName(file.name);
    try {
      const blob = await upload(`dosyalar/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload-file",
      });
      setUrl(blob.url);
      setSize(file.size);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
      setFileName("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="fileUrl" value={url} />
      <input type="hidden" name="fileSize" value={size || ""} />

      {url ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm">
          <Check size={18} className="shrink-0 text-green-600" />
          <span className="min-w-0 flex-1 truncate text-green-800">
            {fileName || url.split("/").pop()} {size ? `· ${humanSize(size)}` : ""}
          </span>
          <button
            type="button"
            onClick={() => { setUrl(""); setSize(0); setFileName(""); }}
            className="shrink-0 rounded-full p-1 text-ink/40 hover:bg-white hover:text-red-500"
            aria-label="Kaldır"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm font-medium transition ${uploading ? "border-orange-300 bg-orange-50 text-orange-600" : "border-green-200 text-green-700 hover:border-orange-400 hover:bg-green-50"}`}>
          <input type="file" onChange={onChange} disabled={uploading} className="hidden" />
          {uploading ? (
            <><Loader2 size={18} className="animate-spin" /> Yükleniyor… ({fileName})</>
          ) : (
            <><UploadCloud size={18} /> Dosya Seç ve Yükle (en fazla 500 MB)</>
          )}
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
