// 12 kategoriyi (boş) geri ekler. İkinci El ve ürünlere dokunmaz.
// Kullanım: DATABASE_URL="..." node scripts/restore-cats.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const CATS = [
  ["Kişisel Bilgisayarlar", "kisisel-bilgisayarlar", "💻"],
  ["Bilgisayar Bileşenleri", "bilgisayar-bilesenleri", "🧩"],
  ["Çevre Birimleri", "cevre-birimleri", "🖱️"],
  ["Baskı Çözümleri", "baski-cozumleri", "🖨️"],
  ["Kurumsal Ürünler", "kurumsal-urunler", "🏢"],
  ["Ağ Ürünleri", "ag-urunleri", "📶"],
  ["Telefonlar", "telefonlar", "📱"],
  ["Barkod Ürünleri", "barkod-urunleri", "🔖"],
  ["Güvenlik Ürünleri", "guvenlik-urunleri", "📹"],
  ["Tüketici Elektroniği", "tuketici-elektronigi", "🎧"],
  ["Ofis & Tüketim Ürünleri", "ofis-tuketim-urunleri", "📎"],
  ["Yazılımlar", "yazilimlar", "💿"],
];
let order = 1;
for (const [name, slug, emoji] of CATS) {
  await prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug, emoji, order },
  });
  order++;
}
const all = await prisma.category.findMany({
  orderBy: { order: "asc" },
  include: { _count: { select: { products: true } } },
});
console.log("Kategoriler:");
for (const c of all) console.log(`  ${c.emoji} ${c.name} (${c._count.products} ürün)`);
await prisma.$disconnect();
