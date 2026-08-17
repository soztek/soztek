"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Hit = {
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  brand: string | null;
  emoji: string | null;
};

export function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = await res.json();
        setHits(data.products ?? []);
        setOpen(true);
      } catch {
        /* iptal */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit() {
    const term = q.trim();
    if (term.length >= 2) {
      setOpen(false);
      router.push(`/arama?q=${encodeURIComponent(term)}`);
    }
  }

  return (
    <div ref={boxRef} className="relative mx-auto w-full max-w-xl">
      <div className="flex items-center overflow-hidden rounded-full border border-green-200 bg-white transition focus-within:border-orange-400">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Ürün, marka veya ürün kodu ara…"
          className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-ink/40"
          aria-label="Ürün ara"
        />
        <button
          onClick={submit}
          className="grid h-9 w-10 shrink-0 place-items-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
          aria-label="Ara"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </div>

      {open && q.trim().length >= 3 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-green-100 bg-white text-left shadow-xl">
          {loading && hits.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-ink/50">
              <Loader2 size={16} className="animate-spin" /> Aranıyor…
            </div>
          ) : hits.length === 0 ? (
            <div className="px-4 py-4 text-sm text-ink/50">Sonuç bulunamadı.</div>
          ) : (
            <>
              <ul className="max-h-[70vh] overflow-auto">
                {hits.map((h) => (
                  <li key={h.slug}>
                    <Link
                      href={`/urun/${h.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-green-100 bg-white">
                        {h.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={h.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span>{h.emoji ?? "📦"}</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        {h.brand && (
                          <span className="block text-[10px] font-bold uppercase tracking-wide text-green-500">{h.brand}</span>
                        )}
                        <span className="block truncate text-sm text-ink">{h.name}</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-green-800">{formatPrice(h.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={submit}
                className="block w-full border-t border-green-100 bg-green-50 px-4 py-2.5 text-center text-sm font-semibold text-orange-600 hover:bg-green-100"
              >
                &ldquo;{q.trim()}&rdquo; için tüm sonuçları gör
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
