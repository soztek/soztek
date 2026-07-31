import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  };
  return text
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type Seed = {
  name: string;
  desc: string;
  brand?: string;
  sku?: string;
  price: number;
  compareAt?: number;
  unit?: string;
  freeShip?: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: number;
};

const DATA: { cat: string; emoji: string; items: Seed[] }[] = [
  {
    cat: "Kişisel Bilgisayarlar",
    emoji: "💻",
    items: [
      { name: "Lenovo IdeaCentre Neo 50t i5-14400 16GB 512GB SSD FreeDOS Masaüstü", desc: "14. nesil Intel Core i5 işlemci, 16GB DDR4 RAM ve 512GB NVMe SSD ile ofis ve günlük kullanım için güçlü masaüstü bilgisayar.", brand: "Lenovo", sku: "NEO50T-14400", price: 24990, compareAt: 27990, unit: "Adet", freeShip: true, featured: true, rating: 4.8, reviews: 64 },
      { name: "ASUS Vivobook 15 i7-1355U 16GB 1TB SSD 15.6\" FHD Notebook", desc: "Intel Core i7 işlemci, 16GB RAM, 1TB SSD ve 15.6 inç Full HD ekranla taşınabilir performans.", brand: "ASUS", sku: "VIVO15-1355U", price: 32750, unit: "Adet", freeShip: true, featured: true, rating: 4.7, reviews: 118 },
      { name: "Lenovo ThinkPad E16 R5-220 16GB 512GB SSD 16\" FreeDOS", desc: "İş dünyası için tasarlanmış dayanıklı ThinkPad; AMD Ryzen 5, 16GB RAM ve 16 inç geniş ekran.", brand: "Lenovo", sku: "TP-E16-R5", price: 36900, unit: "Adet", featured: true, rating: 4.9, reviews: 42 },
      { name: "SÖZTEK Gaming PC Ryzen 5 7600 / RTX 4060 / 16GB / 1TB SSD", desc: "Toplama oyun bilgisayarı: AMD Ryzen 5 7600, GeForce RTX 4060 ekran kartı, 16GB DDR5 ve 1TB NVMe SSD.", brand: "SÖZTEK", sku: "GMR-7600-4060", price: 41500, compareAt: 45000, unit: "Adet", freeShip: true, featured: true, rating: 5.0, reviews: 87 },
      { name: "Apple MacBook Air M3 8GB 256GB 13\" Gümüş", desc: "Apple M3 çip, 8GB birleşik bellek ve 256GB SSD; ince, hafif ve tüm gün pil ömrü.", brand: "Apple", sku: "MBA-M3-256", price: 54990, unit: "Adet", rating: 4.9, reviews: 156 },
      { name: "HP 240 G9 i3-1215U 8GB 256GB SSD 14\" Notebook", desc: "Uygun fiyatlı, günlük işler için ideal HP dizüstü; Intel Core i3, 8GB RAM, 256GB SSD.", brand: "HP", sku: "HP240G9-I3", price: 18990, compareAt: 21500, unit: "Adet", rating: 4.5, reviews: 73 },
    ],
  },
  {
    cat: "Bilgisayar Bileşenleri",
    emoji: "🧩",
    items: [
      { name: "ASUS PRIME B650M-A WIFI II DDR5 AM5 mATX Anakart", desc: "AMD AM5 soket, DDR5 6400MHz(OC) desteği, PCIe 4.0 M.2 ve WiFi 6 ile modern anakart.", brand: "ASUS", sku: "PRIME-B650M-A", price: 8990, compareAt: 9750, unit: "Adet", freeShip: true, featured: true, rating: 4.8, reviews: 91 },
      { name: "MSI B650 Gaming Plus WiFi AM5 DDR5 ATX Anakart", desc: "Oyuncular için güçlü VRM, DDR5 6000MHz, çift M.2 ve WiFi ile ATX anakart.", brand: "MSI", sku: "B650-GPLUS-WIFI", price: 9750, unit: "Adet", rating: 4.7, reviews: 58 },
      { name: "Intel Core i5-12400F 2.5GHz 18MB 1700p İşlemci (Tray)", desc: "6 çekirdek 12 iş parçacığı, oyun ve iş için dengeli fiyat/performans işlemcisi.", brand: "Intel", sku: "I5-12400F", price: 5490, compareAt: 5990, unit: "Adet", featured: true, rating: 4.9, reviews: 204 },
      { name: "Sparkle Intel Arc B580 Titan OC 12GB GDDR6 Ekran Kartı", desc: "12GB GDDR6 bellek, ray tracing ve XeSS desteğiyle 1440p oyun performansı.", brand: "Sparkle", sku: "ARC-B580-TITAN", price: 15900, unit: "Adet", freeShip: true, featured: true, rating: 4.6, reviews: 37 },
      { name: "Patriot Viper Venom 16GB (1x16GB) DDR5 6000MHz CL30 RAM", desc: "Düşük gecikmeli CL30, XMP 3.0 destekli yüksek hızlı DDR5 oyuncu belleği.", brand: "Patriot", sku: "PVV516G60", price: 2190, compareAt: 2490, unit: "Adet", rating: 4.8, reviews: 143 },
      { name: "Colorful SL500 512GB 500/450 MB/s SATA 3 SSD Disk", desc: "2.5 inç SATA3 SSD; sessiz, düşük tüketimli ve hızlı sistem açılışı.", brand: "Colorful", sku: "SL500-512", price: 1090, unit: "Adet", rating: 4.7, reviews: 267 },
      { name: "Kingston NV3 1TB 6000/5000 MB/s NVMe Gen4 SSD", desc: "PCIe 4.0 NVMe M.2 SSD; oyun ve iş yüklerinde yüksek okuma/yazma hızı.", brand: "Kingston", sku: "NV3-1TB", price: 2390, compareAt: 2790, unit: "Adet", freeShip: true, rating: 4.9, reviews: 189 },
      { name: "Hiper K-740 350W 12cm Fan Mini ATX Kasa", desc: "Kompakt mATX kasa, dahili 350W güç kaynağı ve iyi hava akışı.", brand: "Hiper", sku: "K740-350", price: 1290, unit: "Adet", rating: 4.4, reviews: 62 },
    ],
  },
  {
    cat: "Çevre Birimleri",
    emoji: "🖱️",
    items: [
      { name: "Logitech MK295 Kablosuz Klavye + Mouse Set (Sessiz)", desc: "SilentTouch teknolojisiyle sessiz tuşlar, uzun pil ömrü ve dayanıklı kablosuz set.", brand: "Logitech", sku: "MK295-BK", price: 1490, compareAt: 1690, unit: "Adet", featured: true, rating: 4.8, reviews: 312 },
      { name: "Logitech M330 Silent Kablosuz Mouse Siyah", desc: "Sessiz tıklama, 24 aya kadar pil ömrü ve konforlu kavrama.", brand: "Logitech", sku: "M330-BK", price: 690, unit: "Adet", rating: 4.7, reviews: 421 },
      { name: "GamePower Kaze T20 27\" 240Hz 0.5ms FHD Fast IPS Monitör", desc: "27 inç Full HD, 240Hz yenileme hızı ve hızlı IPS panelle rekabetçi oyun deneyimi.", brand: "GamePower", sku: "KAZE-T20", price: 6990, compareAt: 7900, unit: "Adet", freeShip: true, featured: true, rating: 4.6, reviews: 54 },
      { name: "A4Tech KR-92 Q Klavye USB Standart Siyah", desc: "Sessiz tuş yapısı, su geçirmez tasarım ve ergonomik standart Türkçe Q klavye.", brand: "A4Tech", sku: "KR-92", price: 340, unit: "Adet", rating: 4.5, reviews: 178 },
      { name: "Redragon Kumara K552 RGB Mekanik Oyuncu Klavyesi", desc: "Mavi switch, RGB aydınlatma ve dayanıklı metal gövdeli TKL mekanik klavye.", brand: "Redragon", sku: "K552-RGB", price: 1290, unit: "Adet", rating: 4.7, reviews: 96 },
      { name: "Logitech C920 HD Pro 1080p Webcam", desc: "Full HD 1080p görüntü, otomatik ışık düzeltme ve stereo mikrofon.", brand: "Logitech", sku: "C920-HD", price: 2490, compareAt: 2890, unit: "Adet", rating: 4.8, reviews: 233 },
    ],
  },
  {
    cat: "Baskı Çözümleri",
    emoji: "🖨️",
    items: [
      { name: "HP LaserJet Pro M141a Yazıcı/Tarayıcı/Fotokopi A4", desc: "Çok fonksiyonlu mono lazer yazıcı; hızlı baskı, tarama ve fotokopi.", brand: "HP", sku: "M141A", price: 6490, compareAt: 7200, unit: "Adet", freeShip: true, featured: true, rating: 4.6, reviews: 87 },
      { name: "Canon PIXMA G3420 Tanklı Renkli Yazıcı WiFi", desc: "Dolum tanklı, ekonomik baskı maliyeti, WiFi ile kablosuz yazdırma.", brand: "Canon", sku: "G3420", price: 5990, unit: "Adet", rating: 4.7, reviews: 142 },
      { name: "Epson EcoTank L3250 Tanklı Yazıcı/Tarayıcı/Fotokopi", desc: "Yüksek sayfa verimi, renkli baskı ve WiFi Direct destekli çok fonksiyonlu yazıcı.", brand: "Epson", sku: "L3250", price: 7290, compareAt: 7990, unit: "Adet", featured: true, rating: 4.8, reviews: 176 },
      { name: "Brother HL-L2375DW Mono Lazer Yazıcı Dubleks WiFi", desc: "Çift taraflı otomatik baskı, WiFi ve hızlı mono lazer performansı.", brand: "Brother", sku: "L2375DW", price: 6790, unit: "Adet", rating: 4.6, reviews: 63 },
      { name: "HP 305 Siyah Orijinal Mürekkep Kartuşu", desc: "HP DeskJet serisi için orijinal siyah mürekkep kartuşu.", brand: "HP", sku: "HP305-BK", price: 690, unit: "Adet", rating: 4.5, reviews: 210 },
    ],
  },
  {
    cat: "Kurumsal Ürünler",
    emoji: "🏢",
    items: [
      { name: "QNAP TS-464 4 Yuvalı NAS Depolama Ünitesi", desc: "Intel Celeron dört çekirdek, 4GB RAM, 2.5GbE; kurumsal yedekleme ve dosya sunucusu.", brand: "QNAP", sku: "TS-464", price: 21900, unit: "Adet", freeShip: true, featured: true, rating: 4.8, reviews: 29 },
      { name: "Seagate IronWolf 4TB 3.5\" NAS Sabit Disk", desc: "7/24 çalışmaya uygun, NAS sistemleri için optimize edilmiş dayanıklı disk.", brand: "Seagate", sku: "IW-4TB", price: 4290, compareAt: 4790, unit: "Adet", rating: 4.9, reviews: 88 },
      { name: "APC Back-UPS 850VA Line-Interactive UPS", desc: "Elektrik kesintilerine karşı kesintisiz güç kaynağı; ofis ekipmanları için ideal.", brand: "APC", sku: "BX850", price: 3990, unit: "Adet", freeShip: true, rating: 4.7, reviews: 54 },
      { name: "HPE ProLiant MicroServer Gen10 Plus v2 Sunucu", desc: "Küçük ofisler için kompakt sunucu; sanallaştırma ve dosya paylaşımına uygun.", brand: "HPE", sku: "MSGEN10", price: 38900, unit: "Adet", featured: true, rating: 4.6, reviews: 17 },
    ],
  },
  {
    cat: "Ağ Ürünleri",
    emoji: "📶",
    items: [
      { name: "ASUS RT-AX52 AX3000 Dual Band WiFi 6 Router", desc: "WiFi 6 teknolojisi, 3000Mbps hız ve AiMesh desteğiyle geniş kapsama.", brand: "ASUS", sku: "RT-AX52", price: 2290, compareAt: 2590, unit: "Adet", freeShip: true, featured: true, rating: 4.7, reviews: 132 },
      { name: "TP-Link Archer C6 AC1200 Dual Band Router", desc: "Uygun fiyatlı, 1200Mbps çift bant, MU-MIMO destekli ev tipi router.", brand: "TP-Link", sku: "ARCHER-C6", price: 990, unit: "Adet", rating: 4.6, reviews: 298 },
      { name: "Huawei eKit AP361 1775Mbps Tavan Tipi Access Point", desc: "Kurumsal iç mekan kablosuz erişim noktası; yoğun kullanıcı ortamları için.", brand: "Huawei", sku: "AP361", price: 3490, unit: "Adet", featured: true, rating: 4.8, reviews: 41 },
      { name: "TP-Link TL-SG108 8 Port Gigabit Switch", desc: "Tak-çalıştır 8 port gigabit yönetilemez switch; metal kasa.", brand: "TP-Link", sku: "SG108", price: 690, compareAt: 820, unit: "Adet", rating: 4.9, reviews: 187 },
      { name: "Unitek USB-A to Gigabit Ethernet Dönüştürücü", desc: "USB üzerinden gigabit kablolu internet bağlantısı sağlayan adaptör.", brand: "Unitek", sku: "Y-1468", price: 490, unit: "Adet", rating: 4.5, reviews: 76 },
    ],
  },
  {
    cat: "Telefonlar",
    emoji: "📱",
    items: [
      { name: "Samsung Galaxy A55 5G 8GB 256GB Akıllı Telefon", desc: "6.6\" Super AMOLED ekran, 50MP kamera, 5000mAh batarya ve 5G bağlantı.", brand: "Samsung", sku: "GLX-A55-256", price: 21990, compareAt: 23990, unit: "Adet", freeShip: true, featured: true, rating: 4.7, reviews: 214 },
      { name: "Xiaomi Redmi Note 13 Pro 8GB 256GB", desc: "200MP kamera, 120Hz AMOLED ekran ve hızlı şarj destekli akıllı telefon.", brand: "Xiaomi", sku: "RN13PRO-256", price: 15490, unit: "Adet", featured: true, rating: 4.6, reviews: 176 },
      { name: "Apple iPhone 15 128GB", desc: "A16 Bionic çip, 48MP ana kamera, Dynamic Island ve USB-C.", brand: "Apple", sku: "IP15-128", price: 52990, compareAt: 55990, unit: "Adet", rating: 4.9, reviews: 341 },
      { name: "Honor Play 8T 8GB 256GB", desc: "Uygun fiyatlı, büyük batarya ve akıcı performans sunan model.", brand: "Honor", sku: "PLAY8T-256", price: 9990, unit: "Adet", rating: 4.4, reviews: 58 },
    ],
  },
  {
    cat: "Barkod Ürünleri",
    emoji: "🔖",
    items: [
      { name: "Zebra ZD230 Termal Barkod Yazıcı USB", desc: "Etiket ve barkod baskısı için ekonomik masaüstü termal yazıcı.", brand: "Zebra", sku: "ZD230", price: 6490, compareAt: 6990, unit: "Adet", freeShip: true, featured: true, rating: 4.7, reviews: 46 },
      { name: "Datalogic QuickScan QW2120 Barkod Okuyucu USB", desc: "Hızlı ve hassas 1D barkod okuma; perakende ve depo için ideal.", brand: "Datalogic", sku: "QW2120", price: 1890, unit: "Adet", rating: 4.6, reviews: 83 },
      { name: "Argox OS-2140 Termal Transfer Barkod Yazıcı", desc: "Yüksek çözünürlüklü etiket baskısı, dayanıklı endüstriyel gövde.", brand: "Argox", sku: "OS-2140", price: 5290, unit: "Adet", rating: 4.5, reviews: 31 },
      { name: "Newland HR32 2D Kablolu El Barkod Okuyucu", desc: "1D/2D ve karekod okuma; ekrandan barkod okuma desteği.", brand: "Newland", sku: "HR32", price: 2190, compareAt: 2490, unit: "Adet", rating: 4.7, reviews: 52 },
    ],
  },
  {
    cat: "Güvenlik Ürünleri",
    emoji: "📹",
    items: [
      { name: "Hikvision DS-2CD1043G2 4MP IP Bullet Güvenlik Kamerası", desc: "4MP çözünürlük, gece görüş ve IP67 dış mekan koruması ile ağ kamerası.", brand: "Hikvision", sku: "2CD1043G2", price: 1890, compareAt: 2190, unit: "Adet", freeShip: true, featured: true, rating: 4.8, reviews: 124 },
      { name: "Dahua IPC-HFW1230TC 2MP Sesli IP Bullet Kamera", desc: "2MP, dahili mikrofon, akıllı hareket algılama ve PoE desteği.", brand: "Dahua", sku: "HFW1230TC", price: 1590, unit: "Adet", featured: true, rating: 4.7, reviews: 98 },
      { name: "Reolink RLC-810A 8MP 4K PoE Akıllı Kamera", desc: "4K Ultra HD, insan/araç algılama ve gece renkli görüş.", brand: "Reolink", sku: "RLC-810A", price: 3290, unit: "Adet", rating: 4.6, reviews: 67 },
      { name: "Hikvision DS-7108 8 Kanal NVR Kayıt Cihazı", desc: "8 kanal IP kamera kaydı, 4K çözünürlük desteği ve uzaktan izleme.", brand: "Hikvision", sku: "DS-7108", price: 2790, compareAt: 3100, unit: "Adet", freeShip: true, rating: 4.7, reviews: 54 },
      { name: "AJAX StarterKit Kablosuz Alarm Seti (Beyaz)", desc: "Hub, hareket sensörü, kapı sensörü ve kumandadan oluşan akıllı alarm seti.", brand: "AJAX", sku: "AJX-START", price: 6990, unit: "Adet", featured: true, rating: 4.9, reviews: 38 },
    ],
  },
  {
    cat: "Tüketici Elektroniği",
    emoji: "🎧",
    items: [
      { name: "JBL Tune 520BT Kablosuz Kulak Üstü Kulaklık", desc: "Pure Bass ses, 57 saate kadar pil ömrü ve çoklu cihaz bağlantısı.", brand: "JBL", sku: "T520BT", price: 1690, compareAt: 1990, unit: "Adet", freeShip: true, featured: true, rating: 4.7, reviews: 203 },
      { name: "Xiaomi Redmi Buds 5 TWS Kulak İçi Kulaklık", desc: "Aktif gürültü engelleme, 46 saat pil ve düşük gecikmeli oyun modu.", brand: "Xiaomi", sku: "BUDS5", price: 990, unit: "Adet", rating: 4.5, reviews: 176 },
      { name: "Samsung 55\" Crystal UHD 4K Smart TV", desc: "4K çözünürlük, HDR ve Tizen akıllı TV platformu ile geniş ekran keyfi.", brand: "Samsung", sku: "UHD55-CU", price: 18990, compareAt: 20990, unit: "Adet", featured: true, rating: 4.8, reviews: 91 },
      { name: "Anker PowerCore 20000mAh Taşınabilir Şarj Cihazı", desc: "Yüksek kapasiteli powerbank; hızlı şarj ve çift USB çıkış.", brand: "Anker", sku: "PC-20000", price: 1290, unit: "Adet", rating: 4.8, reviews: 264 },
    ],
  },
  {
    cat: "Ofis & Tüketim Ürünleri",
    emoji: "📎",
    items: [
      { name: "PLM Drexel 8300 15.6\" Notebook Sırt Çantası Siyah", desc: "15.6 inç dizüstü bölmeli, su itici, dayanıklı ofis ve okul çantası.", brand: "PLM", sku: "DREXEL-8300", price: 490, compareAt: 590, unit: "Adet", rating: 4.6, reviews: 142 },
      { name: "Logitech B100 USB Optik Mouse Siyah", desc: "Her iki elle kullanıma uygun, sade ve dayanıklı ofis mouse.", brand: "Logitech", sku: "B100", price: 290, unit: "Adet", rating: 4.7, reviews: 388 },
      { name: "SanDisk Ultra 128GB USB 3.0 Flash Bellek", desc: "Hızlı USB 3.0 aktarım, kompakt tasarımlı taşınabilir bellek.", brand: "SanDisk", sku: "ULTRA-128", price: 490, unit: "Adet", freeShip: false, rating: 4.8, reviews: 456 },
      { name: "Baseus 6\'lı USB + Type-C Priz Çoklayıcı Şarj İstasyonu", desc: "Çoklu cihaz şarjı için akıllı priz ve USB dağıtıcı istasyonu.", brand: "Baseus", sku: "BS-6PORT", price: 890, compareAt: 1090, unit: "Adet", rating: 4.6, reviews: 77 },
    ],
  },
  {
    cat: "Yazılımlar",
    emoji: "💿",
    items: [
      { name: "Microsoft Windows 11 Pro 64Bit Türkçe OEM", desc: "Orijinal Windows 11 Pro lisansı; kurumsal ve bireysel kullanım için.", brand: "Microsoft", sku: "W11PRO-OEM", price: 4290, compareAt: 4790, unit: "Adet", freeShip: true, featured: true, rating: 4.9, reviews: 187 },
      { name: "Microsoft Office 2021 Home & Business", desc: "Word, Excel, PowerPoint ve Outlook içeren kalıcı lisanslı ofis paketi.", brand: "Microsoft", sku: "OFF2021-HB", price: 6990, unit: "Adet", rating: 4.8, reviews: 143 },
      { name: "ESET NOD32 Antivirus 1 Yıl 1 Kullanıcı", desc: "Hafif ve etkili antivirüs koruması; 1 yıllık dijital lisans.", brand: "ESET", sku: "NOD32-1Y", price: 690, compareAt: 890, unit: "Adet", rating: 4.7, reviews: 98 },
      { name: "Kaspersky Plus 3 Cihaz 1 Yıl", desc: "Gelişmiş güvenlik, VPN ve performans araçları içeren koruma paketi.", brand: "Kaspersky", sku: "KAS-PLUS-3", price: 990, unit: "Adet", rating: 4.6, reviews: 64 },
    ],
  },
];

async function main() {
  console.log("Seed başlıyor...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Ayarlar
  const settingsData = {
    siteName: "SÖZTEK Bilgisayar",
    tagline: "Bilişim & Teknoloji Çözümleri",
    phone: "0236 612 75 10",
    whatsapp: "905457698352",
    email: "soztek@soztekbilgisayar.com.tr",
    instagram: "soztekbilgisayar",
    address: "Namazgah Mah. Nazım Usluoğlu Cad. No:45, Soma / MANİSA",
    freeShippingLimit: new Prisma.Decimal(5000),
    shippingFee: new Prisma.Decimal(149.9),
    heroTitle: "Teknolojinin Güç Merkezi",
    heroSubtitle:
      "Bilgisayar, donanım, çevre birimleri, ağ ve güvenlik ürünleri; en uygun fiyatlarla, hızlı kargoyla kapınızda.",
    announcement: "₺5000 ve üzeri alışverişlerde ÜCRETSİZ kargo — Aynı gün kargo fırsatı",
  };
  await prisma.setting.upsert({
    where: { id: "main" },
    update: settingsData,
    create: { id: "main", ...settingsData },
  });

  let catOrder = 0;
  let total = 0;
  for (const group of DATA) {
    const category = await prisma.category.create({
      data: {
        name: group.cat,
        slug: slugify(group.cat),
        emoji: group.emoji,
        order: catOrder++,
      },
    });

    let pOrder = 0;
    for (const it of group.items) {
      await prisma.product.create({
        data: {
          name: it.name,
          slug: slugify(it.name),
          description: it.desc,
          brand: it.brand ?? null,
          sku: it.sku ?? null,
          price: new Prisma.Decimal(it.price),
          compareAt: it.compareAt ? new Prisma.Decimal(it.compareAt) : null,
          unit: it.unit ?? "Adet",
          freeShip: it.freeShip ?? false,
          isFeatured: it.featured ?? false,
          rating: it.rating ?? 4.7,
          reviewCount: it.reviews ?? 0,
          stock: 100,
          order: pOrder++,
          categoryId: category.id,
        },
      });
      total++;
    }
    console.log(`  ${group.emoji} ${group.cat}: ${group.items.length} ürün`);
  }

  console.log(`Seed tamamlandı. Toplam ${total} ürün, ${DATA.length} kategori.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
