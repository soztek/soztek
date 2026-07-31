import {
  Laptop,
  Cpu,
  Mouse,
  Printer,
  Server,
  Wifi,
  Smartphone,
  ScanLine,
  Cctv,
  Headphones,
  Package,
  AppWindow,
  Percent,
  Tag,
  type LucideProps,
} from "lucide-react";

/** Kategori slug'ına göre bilişim ikonu (lucide, ince çizgi, currentColor). */
const MAP: Record<string, React.ComponentType<LucideProps>> = {
  "kisisel-bilgisayarlar": Laptop,
  "bilgisayar-bilesenleri": Cpu,
  "cevre-birimleri": Mouse,
  "baski-cozumleri": Printer,
  "kurumsal-urunler": Server,
  "ag-urunleri": Wifi,
  telefonlar: Smartphone,
  "barkod-urunleri": ScanLine,
  "guvenlik-urunleri": Cctv,
  "tuketici-elektronigi": Headphones,
  "ofis-tuketim-urunleri": Package,
  yazilimlar: AppWindow,
  "indirimli-urunler": Percent,
  kampanyalar: Tag,
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = MAP[slug] ?? Package;
  return <Icon className={className} strokeWidth={1.7} />;
}
