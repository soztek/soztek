import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Destek botu için hızlı/ucuz model; env ile değiştirilebilir (claude-opus-5, claude-sonnet-5 ...)
const MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5";

type InMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let body: { messages?: InMsg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));

  const lastUser = [...history].reverse().find((m) => m.role === "user")?.content?.trim() ?? "";
  if (!lastUser) return NextResponse.json({ error: "Mesaj yok" }, { status: 400 });

  // Ürün bağlamı: son kullanıcı mesajına göre ürün ara
  let products: { name: string; slug: string; price: number; brand: string | null; stock: number }[] = [];
  if (lastUser.length >= 3) {
    const found = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: lastUser, mode: "insensitive" } },
          { brand: { contains: lastUser, mode: "insensitive" } },
          ...lastUser.split(/\s+/).filter((w) => w.length >= 3).slice(0, 4).map((w) => ({ name: { contains: w, mode: "insensitive" as const } })),
        ],
      },
      take: 6,
      orderBy: [{ stock: "desc" }, { order: "asc" }],
      select: { name: true, slug: true, price: true, brand: true, stock: true },
    });
    products = found.map((p) => ({ name: p.name, slug: p.slug, price: toNumber(p.price), brand: p.brand, stock: p.stock }));
  }

  const settings = await getSettings();
  const tl = (n: number) => `${n.toLocaleString("tr-TR")} TL`;

  // API anahtarı yoksa nazik yedek yanıt (bot yine çalışsın)
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      reply: "Şu an size daha iyi yardımcı olabilmem için sizi yetkili ekibimize bağlayayım. WhatsApp'tan hemen yazabilirsiniz. [WHATSAPP]",
      products: products.slice(0, 4),
    });
  }

  const productContext = products.length
    ? products.map((p) => `- ${p.name}${p.brand ? ` (${p.brand})` : ""} — ${tl(p.price)}${p.stock <= 0 ? " — STOKTA YOK" : ""} [/urun/${p.slug}]`).join("\n")
    : "(bu mesajla eşleşen ürün bulunamadı)";

  const system = `Sen SÖZTEK Bilgisayar'ın web sitesindeki Türkçe müşteri destek asistanısın. Kısa, samimi ve yardımsever ol (en fazla 3-4 cümle). Sadece SÖZTEK ile ilgili konularda yardım et.

FİRMA BİLGİLERİ:
- SÖZTEK Bilgisayar — bilişim, bilgisayar, donanım, çevre birimleri, ağ, güvenlik ve yazıcı ürünleri satışı (Soma / Manisa).
- Telefon: ${settings.phone} · WhatsApp: ${settings.whatsapp} · E-posta: ${settings.email}
- Kargo: Siparişler 1-2 iş günü içinde kargoya verilir. ${tl(toNumber(settings.freeShippingLimit))} ve üzeri alışverişte kargo ÜCRETSİZ; altında ${tl(toNumber(settings.shippingFee))} kargo ücreti.
- Ödeme: Kart ile güvenli ödeme (3D Secure), tüm kartlara vade farksız taksit.
- Garanti/İade: Ürünler orijinal ve faturalı. 14 gün içinde koşulsuz iade. Garanti arızaları yetkili servisle.

DİL:
- Her zaman dilbilgisi açısından doğru, akıcı ve nazik Türkçe kullan. Müşteriye "siz" diye hitap et (senli-benli konuşma; "ihtiyacınız", "hoşunuza gitti" gibi).
- Kapanışlarda net ve olumlu ifadeler kullan: "Başka bir sorunuz olursa çekinmeden yazabilirsiniz." Asla "yazma" gibi olumsuz emir kullanma.

KURALLAR:
- Ürün önerirken YALNIZCA aşağıdaki listede olan ürünleri öner; fiyat/stok uydurma. Ürünler kullanıcıya tıklanabilir kart olarak ayrıca gösterilecek, o yüzden ham /urun/... linki yazma, sadece ürün adıyla bahset.
- Bilmediğin, emin olmadığın, sipariş durumu/iade talebi/şikâyet gibi kişisel işlemler ya da müşteri "insana/yetkiliye bağlan" derse: kısaca yardımcı ol ve mesajının SONUNA aynen [WHATSAPP] etiketini ekle (kullanıcıya WhatsApp butonu gösterilecek). Etiketi cümle içinde açıklama.
- SÖZTEK dışı / alakasız sorularda kibarca konuyu ürün ve hizmetlere getir.

BU MESAJLA EŞLEŞEN ÜRÜNLER:
${productContext}`;

  try {
    const client = new Anthropic();
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system,
      messages: history,
    });
    const reply = resp.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    return NextResponse.json({
      reply: reply || "Size nasıl yardımcı olabilirim?",
      products: products.slice(0, 4),
    });
  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json({
      reply: "Şu an bir aksaklık var. Sizi yetkili ekibimize bağlayayım — WhatsApp'tan hemen yardımcı olalım. [WHATSAPP]",
      products: products.slice(0, 4),
    });
  }
}
