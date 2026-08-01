import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headset, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Reviews } from "@/components/Reviews";
import { SearchSection } from "@/components/SearchSection";

export default async function HomePage() {
  const [settings, categories, discounted, featured, brands] = await Promise.all([
    getSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, compareAt: { not: null } },
      include: { category: true },
      take: 8,
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      take: 8,
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
      take: 16,
    }),
  ]);

  const brandNames = brands.map((b) => b.brand).filter(Boolean) as string[];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20">
              <Zap size={15} className="text-orange-400" /> Kurumsal & bireysel bilişim çözümleri
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[3.4rem]">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-green-100/90">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#kategoriler" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-7 py-3.5 text-base font-semibold shadow-lg transition hover:bg-orange-600">
                Ürünleri Keşfet <ArrowRight size={18} />
              </Link>
              <Link href="#one-cikan" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-7 py-3.5 text-base font-semibold ring-1 ring-white/25 transition hover:bg-white/20">
                Fırsat Ürünleri
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-green-100/80">
              <span className="flex items-center gap-1.5"><Truck size={15} className="text-orange-400" /> Aynı gün kargo</span>
              <span className="flex items-center gap-1.5"><CreditCard size={15} className="text-orange-400" /> Taksit imkânı</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-orange-400" /> Güvenli ödeme</span>
            </div>
          </div>

          {/* Öne çıkan kategori kartları */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {categories.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
                >
                  <CategoryIcon slug={c.slug} className="h-9 w-9 text-orange-400" />
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-sm text-green-100/70">{c._count.products} ürün</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ÜRÜN ARAMA */}
      <SearchSection />

      {/* GÜVEN ŞERİDİ */}
      <section className="border-b border-green-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Hızlı & Ücretsiz Kargo", s: "Aynı gün kargo fırsatı" },
            { icon: CreditCard, t: "Taksit İmkânı", s: "Tüm kartlara vade farksız" },
            { icon: ShieldCheck, t: "Güvenli Ödeme", s: "SSL & 3D Secure" },
            { icon: Headset, t: "Teknik Destek", s: "Satış öncesi & sonrası" },
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-3">
              <x.icon className="shrink-0 text-orange-500" size={26} />
              <div>
                <p className="text-sm font-bold text-ink">{x.t}</p>
                <p className="text-xs text-ink/55">{x.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KATEGORİLER */}
      <section id="kategoriler" className="mx-auto max-w-7xl px-6 py-14">
        <SectionTitle kicker="Ne arıyorsunuz?" title="Kategoriler" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-green-100 bg-white p-5 text-center card-shadow hover-lift"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-green-50 transition group-hover:bg-orange-50">
                <CategoryIcon slug={c.slug} className="h-8 w-8 text-green-600 transition group-hover:text-orange-500" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink group-hover:text-orange-600">{c.name}</p>
                <p className="text-xs text-ink/50">{c._count.products} ürün</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* İNDİRİMLİ ÜRÜNLER */}
      {discounted.length > 0 && (
        <section className="bg-green-50 py-14">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle kicker="🔥 Fırsat" title="İndirimli Ürünler" />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {discounted.map((p) => (
                <ProductCard key={p.id} product={toProductDTO(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ÖNE ÇIKANLAR */}
      <section id="one-cikan" className="mx-auto max-w-7xl px-6 py-14">
        <SectionTitle kicker="Çok satanlar" title="Öne Çıkan Ürünler" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={toProductDTO(p)} />
          ))}
        </div>
      </section>

      {/* MARKALAR */}
      {brandNames.length > 0 && (
        <section className="border-y border-green-100 bg-white py-12">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-ink/50">
              Çözüm Ortaklarımız
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {brandNames.map((b) => (
                <span
                  key={b}
                  className="rounded-lg border border-green-100 bg-green-50 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-green-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MÜŞTERİ YORUMLARI */}
      <Reviews />

      {/* KURUMSAL ÇAĞRI */}
      <section className="bg-gradient-to-br from-green-800 to-green-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">Kurumsal Çözümler</span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Şirketiniz için doğru teknoloji, tek noktadan</h2>
            <p className="mt-5 text-green-100/90">
              Ofis bilgisayarlarından sunucu ve depolama sistemlerine, ağ altyapısından güvenlik kamerası
              kurulumuna kadar kurumsal bilişim ihtiyaçlarınızın tamamını uzman ekibimizle karşılıyoruz.
              Toplu alımlarda özel fiyat ve fatura desteği için bizimle iletişime geçin.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold transition hover:bg-orange-600">
                Teklif Alın <ArrowRight size={18} />
              </Link>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold ring-1 ring-white/25 transition hover:bg-white/20">
                WhatsApp Destek
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: "10.000+", t: "Ürün çeşidi" },
              { n: "7/24", t: "Sipariş & destek" },
              { n: "Aynı gün", t: "Kargo" },
              { n: "3D Secure", t: "Güvenli ödeme" },
              { n: "Taksit", t: "Vade farksız" },
              { n: "Kurumsal", t: "Fatura desteği" },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15">
                <p className="text-lg font-extrabold text-orange-400">{s.n}</p>
                <p className="mt-1 text-xs text-green-100/80">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">{kicker}</span>
        <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden items-center gap-1 whitespace-nowrap text-sm font-semibold text-green-700 hover:text-orange-600 sm:flex">
          Tümünü Gör <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
