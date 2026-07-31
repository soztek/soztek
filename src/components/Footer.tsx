import Link from "next/link";
import { Phone, Mail, MapPin, AtSign, ShieldCheck, Truck, CreditCard, Headset } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Logo } from "./Logo";

export async function Footer() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  return (
    <footer className="mt-16 bg-green-900 text-green-100">
      {/* Güven şeridi */}
      <div className="border-b border-green-700/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <Truck className="text-orange-400" size={26} />
            <div>
              <p className="font-semibold text-white">Hızlı & Ücretsiz Kargo</p>
              <p className="text-sm text-green-300">Aynı gün kargo fırsatı</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="text-orange-400" size={26} />
            <div>
              <p className="font-semibold text-white">Taksit İmkânı</p>
              <p className="text-sm text-green-300">Tüm kartlara vade farksız</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-orange-400" size={26} />
            <div>
              <p className="font-semibold text-white">Güvenli Ödeme</p>
              <p className="text-sm text-green-300">SSL & 3D Secure altyapısı</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headset className="text-orange-400" size={26} />
            <div>
              <p className="font-semibold text-white">Teknik Destek</p>
              <p className="text-sm text-green-300">Satış öncesi & sonrası</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="inline-flex rounded-xl bg-white p-3">
            <Logo variant="dark" />
          </div>
          <p className="mt-3 text-sm text-green-300">{settings.tagline}</p>
          <p className="mt-4 flex items-start gap-2 text-sm text-green-300">
            <MapPin size={16} className="mt-0.5 shrink-0 text-orange-400" /> {settings.address}
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Kategoriler</h4>
          <ul className="space-y-2 text-sm text-green-300">
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="hover:text-orange-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Kurumsal</h4>
          <ul className="space-y-2 text-sm text-green-300">
            <li><Link href="/hakkimizda" className="hover:text-orange-400">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-orange-400">İletişim</Link></li>
            <li><Link href="/mesafeli-satis" className="hover:text-orange-400">Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link href="/gizlilik" className="hover:text-orange-400">Gizlilik & KVKK</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">İletişim</h4>
          <ul className="space-y-2.5 text-sm text-green-300">
            <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-orange-400"><Phone size={15} /> {settings.phone}</a></li>
            <li><a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-orange-400"><Mail size={15} /> {settings.email}</a></li>
            <li><a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-orange-400"><AtSign size={15} /> @{settings.instagram}</a></li>
            <li>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
                WhatsApp Destek
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-700/50 py-5 text-center text-xs text-green-400">
        <p className="font-medium text-green-300">
          SÖZTEK BİLGİSAYAR ELEK. GÜV. SİS. İLET. KIR. SAN. VE TİC. LTD. ŞTİ.
        </p>
        <p className="mt-1">Tel &amp; Fax: {settings.phone} · GSM: 0 545 769 83 52</p>
        <p className="mt-1">© {new Date().getFullYear()} {settings.siteName} — {settings.tagline}. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
