// n11 SOAP ProductService -> SÖZTEK (Prisma) içe aktarma
// Tüm ürünleri tek "İkinci El" kategorisine aktarır. Fotoğraflar n11 CDN URL'si olarak saklanır.
// Kullanım (Neon'a):  DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" node scripts/import-n11.mjs
import { PrismaClient, Prisma } from "@prisma/client";

// Güvenlik: anahtarları koda gömme. Çalıştırırken env ver:
//   N11_KEY="..." N11_SECRET="..." DATABASE_URL="..." node scripts/import-n11.mjs
const APP_KEY = process.env.N11_KEY;
const APP_SECRET = process.env.N11_SECRET;
if (!APP_KEY || !APP_SECRET) { console.error("N11_KEY ve N11_SECRET env değişkenleri gerekli."); process.exit(1); }
const auth = `<auth><appKey>${APP_KEY}</appKey><appSecret>${APP_SECRET}</appSecret></auth>`;

const prisma = new PrismaClient();

function slugify(t) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return t.toLowerCase().replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function soap(inner, tries = 3) {
  const body = `<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.n11.com/ws/schemas"><soapenv:Header/><soapenv:Body>${inner}</soapenv:Body></soapenv:Envelope>`;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch("https://api.n11.com/ws/ProductService/", {
        method: "POST",
        headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: "" },
        body,
      });
      return await r.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1000);
    }
  }
}
const g1 = (xml, tag) => { const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`)); return m ? m[1].trim() : null; };
function decode(s) {
  return s ? s.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'") : s;
}

const BRANDS = ["HP","Samsung","Brother","Canon","Epson","Xerox","Lexmark","Ricoh","Kyocera","Pantum","OKI","Konica","Minolta","Toshiba","Dell","Asus","MSI","Gigabyte","Lenovo","Logitech","TP-Link","Dahua","Hikvision","Kingston","Intel","AMD","Seagate","Transcend","A4Tech","Rampage","Everest","Frisby","Hiper","Zebra","Printpen"];
function parseBrand(title) {
  const t = title.toLowerCase();
  for (const b of BRANDS) if (t.includes(b.toLowerCase())) return b;
  return null;
}

async function main() {
  console.log("n11 içe aktarma başlıyor...");

  // 1) Tüm ürün id'lerini topla
  const first = await soap(`<sch:GetProductListRequest>${auth}<pagingData><currentPage>0</currentPage><pageSize>100</pageSize></pagingData></sch:GetProductListRequest>`);
  const total = parseInt(g1(first, "totalCount") || "0", 10);
  const pageCount = Math.ceil(total / 100);
  console.log(`Toplam ${total} ürün, ${pageCount} sayfa`);

  const ids = [];
  for (let p = 0; p < pageCount; p++) {
    const xml = p === 0 ? first : await soap(`<sch:GetProductListRequest>${auth}<pagingData><currentPage>${p}</currentPage><pageSize>100</pageSize></pagingData></sch:GetProductListRequest>`);
    for (const m of xml.matchAll(/<product>([\s\S]*?)<\/product>/g)) {
      const id = g1(m[1], "id");
      if (id) ids.push(id);
    }
    await sleep(200);
  }
  console.log(`${ids.length} ürün id alındı. Detaylar çekiliyor...`);

  // 2) DB temizle + İkinci El kategorisi
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  const cat = await prisma.category.create({
    data: { name: "İkinci El", slug: "ikinci-el", emoji: "♻️", order: 0 },
  });

  // 3) Detayları çek + ürünleri oluştur
  let ok = 0, fail = 0, order = 0;
  const usedSlugs = new Set();
  for (const id of ids) {
    try {
      const xml = await soap(`<sch:GetProductByProductIdRequest>${auth}<productId>${id}</productId></sch:GetProductByProductIdRequest>`);
      const prod = xml.match(/<product>([\s\S]*?)<\/product>/);
      if (!prod) { fail++; continue; }
      const P = prod[1];
      const title = decode(g1(P, "title") || `Ürün ${id}`);
      const display = parseFloat(g1(P, "displayPrice") || g1(P, "price") || "0");
      const listPrice = parseFloat(g1(P, "price") || "0");
      const sku = g1(P, "productSellerCode");
      // stok = tüm stockItem quantity toplamı
      let stock = 0;
      for (const q of P.matchAll(/<quantity>(\d+)<\/quantity>/g)) stock += parseInt(q[1], 10);
      // görseller (product seviyesindeki <images> içindeki url'ler; stockItem images boş)
      const images = [...P.matchAll(/<url>(.*?)<\/url>/g)].map((m) => m[1].trim()).filter(Boolean);
      const catName = decode(g1(P, "name")); // <category><name>
      const catFull = decode((P.match(/<fullName>(.*?)<\/fullName>/) || [])[1] || "");

      let slug = slugify(title) || `urun-${id}`;
      let base = slug, n = 1;
      while (usedSlugs.has(slug)) slug = `${base}-${++n}`;
      usedSlugs.add(slug);

      await prisma.product.create({
        data: {
          name: title,
          slug,
          description: catFull || null,
          brand: parseBrand(title),
          sku: sku || null,
          price: new Prisma.Decimal((display || listPrice || 0).toFixed(2)),
          compareAt: listPrice > display ? new Prisma.Decimal(listPrice.toFixed(2)) : null,
          unit: "Adet",
          imageUrl: images[0] || null,
          images: images,
          stock: stock,
          isActive: true,
          isFeatured: order < 12, // ilk 12 öne çıkan (anasayfa dolsun)
          rating: 5,
          reviewCount: 0,
          order: order++,
          categoryId: cat.id,
          // not: n11 kategorisi açıklamaya yazıldı, kullanıcı panelden düzenleyecek
          ...(catName ? {} : {}),
        },
      });
      ok++;
      if (ok % 25 === 0) console.log(`  ${ok} ürün aktarıldı...`);
      await sleep(180);
    } catch (e) {
      fail++;
      console.warn(`  ! ${id} atlandı: ${e.message}`);
    }
  }

  console.log(`\nTamamlandı. Başarılı: ${ok}, atlanan: ${fail}, kategori: İkinci El`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
