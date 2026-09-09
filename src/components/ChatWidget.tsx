"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, Bot, Headset, Search } from "lucide-react";

type Hit = { name: string; slug: string; price: number; brand: string | null };
type Msg = {
  id: number;
  role: "bot" | "user";
  text?: string;
  products?: Hit[];
  whatsapp?: boolean;
};

export function ChatWidget({
  whatsapp,
  phone,
  email,
  address,
  freeShippingLimit,
  shippingFee,
}: {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  freeShippingLimit: number;
  shippingFee: number;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  const tl = (n: number) => `₺${n.toLocaleString("tr-TR")}`;
  const nextId = () => ++idRef.current;
  const push = (m: Omit<Msg, "id">) => setMsgs((p) => [...p, { ...m, id: nextId() }]);

  const waLink = (msg: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  // İlk açılışta karşılama
  useEffect(() => {
    if (open && msgs.length === 0) {
      push({ role: "bot", text: "Merhaba! 👋 SÖZTEK Bilgisayar'a hoş geldiniz. Size nasıl yardımcı olabilirim? Aşağıdan bir konu seçebilir ya da ürün adı yazabilirsiniz." });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const TOPICS = [
    "🚚 Kargo & Teslimat",
    "💳 Ödeme & Taksit",
    "🛡️ Garanti & İade",
    "🔎 Ürün ara",
    "📞 Yöneticiye bağlan",
  ];

  function answerTopic(topic: string) {
    push({ role: "user", text: topic });
    setBusy(true);
    setTimeout(() => {
      if (topic.includes("Kargo")) {
        push({
          role: "bot",
          text: `Siparişleriniz stok durumuna göre 1-2 iş günü içinde kargoya verilir (aynı gün kargo fırsatı). ${tl(freeShippingLimit)} ve üzeri alışverişlerde kargo ÜCRETSİZ; altındaki siparişlerde ${tl(shippingFee)} kargo ücreti uygulanır.`,
        });
      } else if (topic.includes("Ödeme")) {
        push({ role: "bot", text: "Kredi/banka kartı ile güvenli ödeme (SSL & 3D Secure) yapabilirsiniz. Tüm kartlara vade farksız taksit imkânı sunuyoruz. Kurumsal faturalı alım için bize ulaşabilirsiniz." });
      } else if (topic.includes("Garanti")) {
        push({ role: "bot", text: "Tüm ürünlerimiz orijinal ve faturalıdır. Teslim aldığınız tarihten itibaren 14 gün içinde koşulsuz iade hakkınız vardır (ürün kullanılmamış ve orijinal ambalajında olmalı). Garanti kapsamındaki arızalar yetkili servis ile çözülür." });
      } else if (topic.includes("Ürün")) {
        push({ role: "bot", text: "Tabii! Aradığınız ürünün adını veya markasını yazın (örn. \"ekran kartı\", \"toner\", \"monitör\"), size uygun ürünleri listeleyeyim." });
      } else if (topic.includes("Yönetici")) {
        push({
          role: "bot",
          text: `Sizi yetkili ekibimize bağlayayım. WhatsApp'tan hemen yazabilir ya da bizi arayabilirsiniz:\n📞 ${phone}\n✉️ ${email}\n📍 ${address}`,
          whatsapp: true,
        });
      }
      setBusy(false);
    }, 350);
  }

  async function handleText(raw: string) {
    const text = raw.trim();
    if (!text) return;
    push({ role: "user", text });
    setInput("");
    const low = text.toLowerCase();
    setBusy(true);

    // Anahtar kelime → SSS
    const has = (...k: string[]) => k.some((w) => low.includes(w));
    if (has("kargo", "teslim", "gönder", "ne zaman gelir")) return finish(() => answerKey("kargo"));
    if (has("ödeme", "taksit", "kart", "kapıda")) return finish(() => answerKey("odeme"));
    if (has("garanti", "iade", "değişim", "arıza", "fatura")) return finish(() => answerKey("garanti"));
    if (has("adres", "nerede", "konum", "mağaza", "dükkan")) return finish(() => answerKey("adres"));
    if (has("yönetici", "insan", "yetkili", "temsilci", "canlı", "destek", "ara", "telefon", "iletişim")) return finish(() => answerKey("iletisim"));
    if (has("merhaba", "selam", "iyi günler", "günaydın")) return finish(() => push({ role: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim? Ürün aramak için bir kelime yazabilirsiniz." }));

    // Değilse ürün araması
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(text)}`);
      const data = await res.json();
      const hits: Hit[] = data.products ?? [];
      if (hits.length > 0) {
        push({ role: "bot", text: `"${text}" için ${hits.length} ürün buldum:`, products: hits.slice(0, 5) });
      } else {
        push({
          role: "bot",
          text: `"${text}" için ürün bulamadım. Dilerseniz sizi yetkili ekibimize bağlayayım — hemen yardımcı olalım.`,
          whatsapp: true,
        });
      }
    } catch {
      push({ role: "bot", text: "Bir sorun oluştu. Yetkili ekibimize WhatsApp'tan ulaşabilirsiniz.", whatsapp: true });
    } finally {
      setBusy(false);
    }
  }

  function finish(fn: () => void) {
    setTimeout(() => { fn(); setBusy(false); }, 300);
  }
  function answerKey(k: string) {
    if (k === "kargo") push({ role: "bot", text: `Siparişleriniz 1-2 iş günü içinde kargoya verilir. ${tl(freeShippingLimit)} ve üzeri alışverişte kargo ÜCRETSİZ; altında ${tl(shippingFee)} kargo ücreti.` });
    else if (k === "odeme") push({ role: "bot", text: "Kart ile güvenli ödeme (3D Secure) ve tüm kartlara vade farksız taksit imkânı sunuyoruz." });
    else if (k === "garanti") push({ role: "bot", text: "Ürünler orijinal ve faturalıdır. 14 gün içinde koşulsuz iade; garanti arızaları yetkili servisle çözülür." });
    else if (k === "adres") push({ role: "bot", text: `Adresimiz: ${address}\nTelefon: ${phone}` , whatsapp: true });
    else if (k === "iletisim") push({ role: "bot", text: `Yetkili ekibimize ulaşın:\n📞 ${phone}\n✉️ ${email}`, whatsapp: true });
  }

  return (
    <>
      {/* Balon butonu */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-orange-500 px-4 py-3.5 font-semibold text-white shadow-xl transition hover:bg-orange-600"
          aria-label="Yardım / Sohbet"
        >
          <MessageCircle size={22} />
          <span className="hidden sm:inline">Yardım</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-0 right-0 z-[60] flex h-[100dvh] w-full flex-col bg-white shadow-2xl sm:bottom-5 sm:right-5 sm:h-[560px] sm:max-h-[85vh] sm:w-[380px] sm:rounded-2xl sm:border sm:border-green-100">
          {/* Başlık */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-green-900 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-500"><Bot size={18} /></span>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">SÖZTEK Yardım</p>
              <p className="text-[11px] text-green-200">Genellikle hemen yanıtlar</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Kapat"><X size={20} /></button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-green-50/40 p-3">
            {msgs.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "rounded-br-sm bg-orange-500 text-white" : "rounded-bl-sm border border-green-100 bg-white text-ink"}`}>
                  {m.text}
                  {m.products && (
                    <div className="mt-2 space-y-1.5">
                      {m.products.map((p) => (
                        <Link key={p.slug} href={`/urun/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between gap-2 rounded-lg border border-green-100 bg-green-50/60 px-2.5 py-1.5 hover:border-orange-300">
                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{p.name}</span>
                          <span className="shrink-0 text-xs font-bold text-green-800">{tl(p.price)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.whatsapp && (
                    <a href={waLink("Merhaba, SÖZTEK sitesinden yazıyorum. Yardımcı olabilir misiniz?")} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">
                      <Headset size={14} /> WhatsApp'tan Yetkiliye Bağlan
                    </a>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-green-100 bg-white px-3.5 py-2.5">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400" />
                  </span>
                </div>
              </div>
            )}
            {/* Hızlı konular (sadece başta) */}
            {msgs.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {TOPICS.map((t) => (
                  <button key={t} onClick={() => answerTopic(t)} className="rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:border-orange-400 hover:text-orange-600">
                    {t}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Giriş */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleText(input); }}
            className="flex items-center gap-2 border-t border-green-100 bg-white p-2.5 sm:rounded-b-2xl"
          >
            <div className="flex flex-1 items-center gap-2 rounded-full border border-green-200 px-3 focus-within:border-orange-400">
              <Search size={15} className="text-ink/40" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ürün ara veya soru yaz…"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink/40"
              />
            </div>
            <button type="submit" disabled={busy || !input.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50" aria-label="Gönder">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
