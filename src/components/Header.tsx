import Link from "next/link";
import { MessageCircle, User, Truck, ShieldCheck, Headset, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/user-auth";
import { CartButton } from "./cart/CartButton";
import { MobileNav } from "./MobileNav";
import { CategoryIcon } from "./CategoryIcon";
import { Logo } from "./Logo";
import { HeaderSearch } from "./HeaderSearch";

export async function Header() {
  const [settings, categories, user] = await Promise.all([
    getSettings(),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      select: {
        name: true,
        slug: true,
        emoji: true,
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: { name: true, slug: true },
        },
      },
    }),
    getCurrentUser(),
  ]);

  // WhatsApp numarasını yerel biçime çevir: 905457698352 -> 0545 769 83 52
  const waDisplay = (settings.whatsapp.startsWith("90") ? "0" + settings.whatsapp.slice(2) : settings.whatsapp)
    .replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");

  return (
    <>
      {/* Duyuru şeridi */}
      <div className="overflow-hidden bg-green-800 text-white">
        <div className="flex whitespace-nowrap py-2 text-xs font-medium sm:text-sm">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex items-center gap-2">
                <Truck size={14} className="text-orange-400" /> {settings.announcement}
                <span className="text-orange-400">•</span>
                <ShieldCheck size={14} className="text-orange-400" /> Güvenli ödeme
                <span className="text-orange-400">•</span>
                <Headset size={14} className="text-orange-400" /> Kurumsal & bireysel satış
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <MobileNav categories={categories} userName={user?.name ?? null} />

          <Link href="/" className="flex shrink-0 items-center" aria-label={settings.siteName}>
            <Logo variant="dark" />
          </Link>

          {/* Orta: canlı arama (masaüstü) */}
          <div className="hidden flex-1 justify-center px-4 lg:flex">
            <HeaderSearch />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:border-orange-400 hover:text-orange-600 md:flex"
            >
              <MessageCircle size={16} /> {waDisplay}
            </a>
            <Link
              href={user ? "/hesabim" : "/giris"}
              className="hidden items-center gap-2 rounded-lg border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 hover:border-orange-400 hover:text-orange-600 sm:flex"
            >
              <User size={16} />
              <span className="hidden lg:inline">{user ? user.name.split(" ")[0] : "Giriş Yap"}</span>
            </Link>
            <CartButton />
          </div>
        </div>

        {/* Kategori menüsü — ikonlu çubuk + alt kategori açılır menüsü (masaüstü) */}
        <nav className="hidden border-t border-green-100 bg-white lg:block">
          <div className="mx-auto flex max-w-7xl items-stretch justify-center">
            {categories.map((c) => (
              <div key={c.slug} className="group relative flex flex-1">
                <Link
                  href={`/kategori/${c.slug}`}
                  className="flex w-full flex-col items-center gap-2 border-l border-green-100 px-2 py-3.5 transition group-first:border-l-0 group-hover:bg-green-50"
                >
                  <CategoryIcon slug={c.slug} className="h-6 w-6 text-ink/60 transition group-hover:text-orange-500" />
                  <span className="flex items-center gap-1 text-center text-[13px] font-semibold text-ink group-hover:text-orange-600">
                    {c.name}
                    {c.children.length > 0 && <ChevronDown size={12} className="text-ink/40" />}
                  </span>
                </Link>
                {/* Alt kategori açılır menüsü */}
                {c.children.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-50 min-w-52 -translate-x-1/2 rounded-xl border border-green-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                    {c.children.map((ch) => (
                      <Link
                        key={ch.slug}
                        href={`/kategori/${ch.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-green-50 hover:text-orange-600"
                      >
                        {ch.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
