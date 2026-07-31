import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ShieldCheck, Headset, CreditCard } from "lucide-react";

export const metadata: Metadata = { title: "Hakkımızda" };

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-green-800 to-green-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">Hakkımızda</span>
          <h1 className="mt-3 text-4xl font-extrabold">Teknolojiyi güvenle buluşturuyoruz</h1>
          <p className="mt-4 text-lg text-green-100/90">
            SÖZTEK Bilgisayar; bilişim, elektronik, güvenlik sistemleri, iletişim ve kırtasiye alanında
            kurumsal ve bireysel müşterilerine uygun fiyat, geniş ürün yelpazesi ve güçlü satış sonrası
            destekle hizmet veren bir teknoloji çözüm ortağıdır.
          </p>
          <p className="mt-3 text-sm font-medium italic text-orange-200">
            &ldquo;Sözün, Güvenin, Barışın ve Bilginin Sembolü Söztek&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="max-w-none text-ink/80">
          <p className="text-lg leading-relaxed">
            Bilgisayar ve donanım ürünlerinden ağ altyapısına, güvenlik kamerası sistemlerinden yazıcı ve
            sarf malzemelerine kadar geniş bir ürün yelpazesini tek çatı altında sunuyoruz. Orijinal ve
            garantili ürünleri, rekabetçi fiyatlarla ve hızlı kargoyla müşterilerimize ulaştırıyoruz.
          </p>
          <p className="mt-4 leading-relaxed">
            Kurumsal müşterilerimize toplu alımlarda özel fiyatlandırma, faturalı satış ve proje bazlı
            teknoloji danışmanlığı sağlıyoruz. Deneyimli teknik ekibimiz, satış öncesinde doğru ürün
            seçiminde, satış sonrasında ise kurulum ve destek süreçlerinde her zaman yanınızda.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Truck, t: "Hızlı Kargo", d: "Aynı gün kargo fırsatı" },
            { i: CreditCard, t: "Taksit İmkânı", d: "Tüm kartlara vade farksız" },
            { i: ShieldCheck, t: "Orijinal & Garantili", d: "Tüm ürünler faturalı" },
            { i: Headset, t: "Teknik Destek", d: "Satış öncesi & sonrası" },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-green-100 bg-white p-6 text-center card-shadow">
              <x.i size={30} className="mx-auto text-orange-500" />
              <h3 className="mt-3 font-bold text-ink">{x.t}</h3>
              <p className="mt-1 text-sm text-ink/60">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/#kategoriler" className="inline-flex rounded-lg bg-orange-500 px-8 py-3.5 font-semibold text-white hover:bg-orange-600">
            Ürünleri Keşfet
          </Link>
        </div>
      </section>
    </div>
  );
}
