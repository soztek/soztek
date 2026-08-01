// QRMENU public menüsünden (soztekqrmenu.com.tr/m/soztek) monitör ürünlerini
// SÖZTEK "Monitörler" alt kategorisine aktarır (ad, açıklama, fiyat, foto).
// Kullanım: DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" node scripts/import-qrmenu-monitors.mjs
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const MENU_URL = process.env.QRMENU_URL || "https://www.soztekqrmenu.com.tr/m/soztek";
const CAT_SLUG = "monitorler";

function slugify(t) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
  return t.toLowerCase().replace(/[çğıöşüİÇĞÖŞÜ]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}
const BRANDS = ["Asus", "AOC", "Gigabyte", "MSI", "Samsung", "KTC", "Koorui", "Dell", "LG", "Philips", "HP", "Lenovo", "ViewSonic", "BenQ", "Xiaomi", "Acer", "Hikvision"];
function parseBrand(t) {
  const low = t.toLowerCase();
  for (const b of BRANDS) if (low.includes(b.toLowerCase())) return b;
  return null;
}

async function main() {
  const res = await fetch(MENU_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  const s = html.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\u002[fF]/g, "/");

  const re = /"id":"[^"]+","name":"((?:[^"\\]|\\.)*)","description":(null|"(?:[^"\\]|\\.)*"),"price":"?([0-9.]+)"?,"photoUrl":(null|"(?:[^"\\]|\\.)*")/g;
  const items = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(s))) {
    const name = JSON.parse('"' + m[1] + '"');
    if (seen.has(name)) continue;
    seen.add(name);
    items.push({
      name,
      description: m[2] === "null" ? null : JSON.parse(m[2]),
      price: parseFloat(m[3]),
      photoUrl: m[4] === "null" ? null : JSON.parse(m[4]),
    });
  }
  console.log(`Menüden ${items.length} ürün ayrıştırıldı.`);
  if (items.length === 0) { console.error("Ürün bulunamadı, iptal."); process.exit(1); }

  const cat = await prisma.category.findUnique({ where: { slug: CAT_SLUG } });
  if (!cat) { console.error(`"${CAT_SLUG}" kategorisi yok.`); process.exit(1); }

  // Bu kategorideki mevcut ürünleri temizle (tekrar çalıştırılabilir olsun)
  await prisma.product.deleteMany({ where: { categoryId: cat.id } });

  let order = 0;
  const used = new Set();
  for (const it of items) {
    let slug = slugify(it.name) || `monitor-${order}`;
    let base = slug, n = 1;
    while (used.has(slug) || (await prisma.product.findUnique({ where: { slug } }))) slug = `${base}-${++n}`;
    used.add(slug);
    await prisma.product.create({
      data: {
        name: it.name,
        slug,
        description: it.description,
        brand: parseBrand(it.name),
        price: new Prisma.Decimal((it.price || 0).toFixed(2)),
        unit: "Adet",
        imageUrl: it.photoUrl,
        images: it.photoUrl ? [it.photoUrl] : [],
        stock: 10,
        isActive: true,
        isFeatured: order < 4,
        rating: 5,
        order: order++,
        categoryId: cat.id,
      },
    });
  }
  console.log(`Tamamlandı: ${order} monitör "Monitörler" kategorisine aktarıldı.`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
