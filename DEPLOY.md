# SÖZTEK — Yayına Alma (Vercel + Neon)

## 1) GitHub reposu
Boş bir repo oluştur (README/gitignore/lisans **ekleme**): https://github.com/new
- Repo adı: `soztek`
- Sonra bu klasörde:
  ```bash
  git remote add origin https://github.com/<KULLANICI>/soztek.git
  git push -u origin main
  ```

## 2) Vercel projesi
- vercel.com → Add New → Project → GitHub'dan `soztek` reposunu import et.
- Framework otomatik: **Next.js**. Build ayarına dokunma (`prisma generate && next build` zaten package.json'da).
- İlk deploy DB olmadan **build alır** ama çalışma anında hata verir; DB + env eklenince düzelir.

## 3) Veritabanı — Neon (Vercel Storage)
- Proje → **Storage** → **Create Database** → **Neon (Postgres)** → oluştur.
- Bu, `DATABASE_URL` env değişkenini **otomatik** ekler.

## 4) Environment Variables (Project → Settings → Environment Variables)
Aşağıdakileri **Production** (ve istersen Preview) için ekle:

| Key | Value |
|-----|-------|
| `AUTH_SECRET` | `11124373cf26e99930e9af160e0e77ed461e2aa8bc82223cd7a4b8ba2adbea64` |
| `ADMIN_EMAIL` | `admin@soztekbilgisayar.com.tr` |
| `ADMIN_PASSWORD` | *(güçlü bir şifre belirle)* |
| `NEXT_PUBLIC_BASE_URL` | `https://<vercel-adresin>.vercel.app` (sonra domain) |
| `IYZICO_API_KEY` | *(boş = demo mod; canlı için iyzico'dan)* |
| `IYZICO_SECRET_KEY` | *(boş = demo mod)* |
| `IYZICO_BASE_URL` | `https://api.iyzipay.com` (canlı) / `https://sandbox-api.iyzipay.com` (test) |

`DATABASE_URL` → Neon entegrasyonundan otomatik gelir, elle ekleme.

## 5) Şema + demo veriyi Neon'a yükleme (yerelden, tek sefer)
Neon panosundan **connection string**'i al (pooler değil, **direct/unpooled** olan; host'ta `-pooler` yoksa odur). Sonra bu klasörde geçici olarak:
```bash
# PowerShell:
$env:DATABASE_URL = "postgresql://...neon.tech/...?sslmode=require"
npx prisma db push
npx tsx prisma/seed.ts
```
(Bu adımı Neon URL'sini verince ben de yapabilirim.)

## 6) Redeploy
Env'ler eklendikten sonra Vercel → Deployments → son deploy → **Redeploy**. Site canlı.

## Sonraki
- Ürün görselleri: panel `/admin` üzerinden yüklenir. Vercel'de kalıcı depolama için **Vercel Blob** (public depo) gerekir; yoksa yerel disk (Vercel'de kalıcı değil). Blob token'ı env'e eklenir.
- Domain: `soztek.com.tr` → Vercel → Settings → Domains.
- iyzico canlı anahtar → gerçek tahsilat.

## Yerel geliştirme
```bash
# Node PATH'e:  $env:Path = "C:\Program Files\nodejs;" + $env:Path
npm run dev   # http://localhost:3000
# Admin: /admin/login
```
