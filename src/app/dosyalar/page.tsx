import type { Metadata } from "next";
import { FileDown, ExternalLink, Download, HardDriveDownload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { abs } from "@/lib/seo";

export const dynamic = "force-dynamic";

const DESC = "Bilgisayar bileşenleri, yazıcı ve çevre birimleri için sürücü, yazılım ve kurulum dosyalarını SÖZTEK Bilgisayar'dan indirin.";
export const metadata: Metadata = {
  title: "Dosyalar — Sürücü ve Yazılım İndirme",
  description: DESC,
  alternates: { canonical: "/dosyalar" },
  openGraph: { type: "website", url: abs("/dosyalar"), title: "Dosyalar — Sürücü ve Yazılım İndirme", description: DESC },
};

function humanSize(b: number | null) {
  if (!b) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, n = b;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export default async function DownloadsPage() {
  const files = await prisma.downloadFile.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  // Kategoriye göre grupla
  const groups = new Map<string, typeof files>();
  for (const f of files) {
    const key = f.category?.trim() || "Genel";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(f);
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-green-800 to-green-900 py-14 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20">
            <HardDriveDownload size={16} className="text-orange-400" /> İndirme Merkezi
          </span>
          <h1 className="mt-4 text-4xl font-extrabold">Dosyalar</h1>
          <p className="mt-3 text-lg text-green-100/90">
            Ürünlerinize ait sürücü, yazılım ve yazıcı kurulum dosyaları burada.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
            Henüz dosya eklenmedi. Kısa süre içinde sürücü ve yazılımlar burada olacak.
          </div>
        ) : (
          <div className="space-y-10">
            {[...groups.entries()].map(([cat, list]) => (
              <section key={cat}>
                <h2 className="mb-4 border-b border-green-100 pb-2 text-lg font-extrabold text-ink">{cat}</h2>
                <div className="space-y-3">
                  {list.map((f) => {
                    const isLink = !f.fileUrl && !!f.linkUrl;
                    const href = f.fileUrl || f.linkUrl || "#";
                    return (
                      <div key={f.id} className="flex items-center gap-4 rounded-xl border border-green-100 bg-white p-4 card-shadow">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-50 text-green-600">
                          {isLink ? <ExternalLink size={22} /> : <FileDown size={22} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-ink">{f.name}</p>
                          {f.description && <p className="mt-0.5 text-sm text-ink/60">{f.description}</p>}
                          <p className="mt-1 text-xs text-ink/40">
                            {f.version && <span className="mr-2 rounded bg-green-50 px-1.5 py-0.5 font-medium text-green-700">{f.version}</span>}
                            {f.fileSize ? humanSize(f.fileSize) : isLink ? "Üretici sitesi" : ""}
                          </p>
                        </div>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          {...(f.fileUrl ? { download: true } : {})}
                          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                          {isLink ? <ExternalLink size={16} /> : <Download size={16} />}
                          {isLink ? "Siteye Git" : "İndir"}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-10 rounded-xl bg-green-50 p-4 text-center text-sm text-ink/60">
          Aradığınız dosyayı bulamadınız mı? Bize ulaşın, yardımcı olalım.
        </p>
      </div>
    </div>
  );
}
