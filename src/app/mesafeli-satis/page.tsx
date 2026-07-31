import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-extrabold text-ink">Mesafeli Satış Sözleşmesi</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
        <p>
          İşbu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
          Sözleşmeler Yönetmeliği hükümlerine uygun olarak düzenlenmiştir. Alıcı, siparişini onayladığında
          bu sözleşmenin tüm koşullarını kabul etmiş sayılır.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">1. Taraflar ve Konu</h2>
        <p>
          Bu sözleşme, <strong>SÖZTEK Bilgisayar Elek. Güv. Sis. İlet. Kır. San. ve Tic. Ltd. Şti.</strong>{" "}
          (Satıcı — Namazgah Mah. Nazım Usluoğlu Cad. No:45, Soma / Manisa · Tel: 0236 612 75 10 ·
          soztek@soztekbilgisayar.com.tr) ile sitede sipariş veren müşteri (Alıcı) arasında, sipariş edilen
          ürünlerin satışı ve teslimine ilişkin hak ve yükümlülükleri düzenler.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">2. Teslimat</h2>
        <p>
          Ürünler, stok durumuna göre sipariş onayından itibaren ortalama 1-2 iş günü içinde kargoya verilir.
          Kargo süresi bölgeye ve kargo firmasına göre değişebilir. Tüm ürünler orijinal ve faturalıdır.
        </p>
        <h2 className="pt-2 text-lg font-bold text-ink">3. Cayma Hakkı</h2>
        <p>
          Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma
          hakkını kullanabilir; ürünün kullanılmamış, hasarsız ve orijinal ambalajında olması gerekir. Lisans
          kodları ve dijital yazılımlar gibi ambalajı/aktivasyonu açılmış ürünlerde cayma hakkı istisnaları
          uygulanabilir. Garanti kapsamındaki arızalar yetkili servis süreçleriyle yürütülür.
        </p>
        <p className="pt-4 text-sm text-ink/50">
          Not: Bu metin genel bilgilendirme amaçlıdır. Yayına almadan önce bir hukuk danışmanıyla
          işletmenize özel olarak güncellemeniz önerilir.
        </p>
      </div>
    </div>
  );
}
