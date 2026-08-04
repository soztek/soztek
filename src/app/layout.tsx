import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/settings";
import { toNumber } from "@/lib/utils";
import { SITE_URL, SITE_NAME, LEGAL_NAME } from "@/lib/seo";

// Site tamamen veritabanından beslendiği için tüm sayfalar dinamik render edilir.
// (Vercel build sırasında DB'ye ihtiyaç duyulmaz.)
export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const TITLE = "SÖZTEK Bilişim — Bilgisayar, Donanım ve Teknoloji Ürünleri";
const DESC =
  "Bilgisayar, notebook, ekran kartı, anakart, çevre birimleri, ağ ve güvenlik ürünleri. Kurumsal ve bireysel bilişim çözümleri; uygun fiyat, hızlı kargo ve güvenli ödeme.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | SÖZTEK Bilişim" },
  description: DESC,
  keywords: ["bilgisayar", "notebook", "ekran kartı", "anakart", "donanım", "çevre birimleri", "ağ ürünleri", "güvenlik kamerası", "monitör", "toner", "soztek", "bilişim", "Soma", "Manisa"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESC,
    images: [{ url: "/logo.png", width: 819, height: 251, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESC,
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: LEGAL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Namazgah Mah. Nazım Usluoğlu Cad. No:45",
      addressLocality: "Soma",
      addressRegion: "Manisa",
      addressCountry: "TR",
    },
    sameAs: settings.instagram ? [`https://instagram.com/${settings.instagram}`] : undefined,
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/arama?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="tr" className={`${manrope.variable} antialiased`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <CartProvider>
          <Header />
          <main className="min-h-[60vh] flex-1">{children}</main>
          <Footer />
          <CartDrawer freeShippingLimit={toNumber(settings.freeShippingLimit)} />
        </CartProvider>
      </body>
    </html>
  );
}
