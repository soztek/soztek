import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SITE_URL, abs } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Kategori" };
  const desc = `${category.name} ürünleri en uygun fiyatlarla SÖZTEK Bilgisayar'da. Hızlı kargo, güvenli ödeme ve taksit imkânı.`;
  const path = `/kategori/${category.slug}`;
  return {
    title: category.name,
    description: desc,
    alternates: { canonical: path },
    openGraph: { type: "website", url: abs(path), title: category.name, description: desc },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: { select: { name: true, slug: true } },
      children: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
      },
    },
  });

  if (!category) notFound();

  const childIds = category.children.map((c) => c.id);

  const [products, topLevel] = await Promise.all([
    // Bu kategori + alt kategorilerinin ürünleri
    prisma.product.findMany({
      where: { isActive: true, categoryId: { in: [category.id, ...childIds] } },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    }),
    // Kenar çubuğu: üst kategoriler + altları
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: { _count: { select: { products: true } } },
        },
      },
    }),
  ]);

  const activeTop = category.parent?.slug ?? slug;

  const crumbs = [
    { name: "Anasayfa", url: SITE_URL },
    ...(category.parent ? [{ name: category.parent.name, url: abs(`/kategori/${category.parent.slug}`) }] : []),
    { name: category.name, url: abs(`/kategori/${category.slug}`) },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Başlık / breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-orange-600">Anasayfa</Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link href={`/kategori/${category.parent.slug}`} className="hover:text-orange-600">
              {category.parent.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-ink">{category.name}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-green-800 to-green-900 p-8 text-white">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
          <CategoryIcon slug={category.slug} className="h-8 w-8 text-orange-400" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold">{category.name}</h1>
          <p className="mt-1 text-green-100/90">{products.length} ürün</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Kenar çubuğu — hiyerarşik */}
        <aside className="hidden lg:block">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink/60">Kategoriler</h3>
          <div className="space-y-1">
            {topLevel.map((c) => {
              const totalCount = c._count.products + c.children.reduce((s, ch) => s + ch._count.products, 0);
              const isActive = c.slug === slug;
              const expanded = c.slug === activeTop;
              return (
                <div key={c.slug}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? "bg-green-800 text-white" : "text-ink hover:bg-green-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon slug={c.slug} className="h-4 w-4" /> {c.name}
                    </span>
                    <span className={isActive ? "text-green-200" : "text-ink/40"}>{totalCount}</span>
                  </Link>
                  {expanded && c.children.length > 0 && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-green-100 pl-2">
                      {c.children.map((ch) => (
                        <Link
                          key={ch.slug}
                          href={`/kategori/${ch.slug}`}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                            ch.slug === slug ? "bg-orange-500 text-white" : "text-ink/70 hover:bg-green-50 hover:text-orange-600"
                          }`}
                        >
                          {ch.name}
                          <span className={ch.slug === slug ? "text-orange-100" : "text-ink/40"}>{ch._count.products}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* İçerik */}
        <div>
          {/* Alt kategori kartları (varsa) */}
          {category.children.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-ink">Alt Kategoriler</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {category.children.map((ch) => (
                  <Link
                    key={ch.slug}
                    href={`/kategori/${ch.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-green-100 bg-white p-4 card-shadow hover-lift"
                  >
                    <CategoryIcon slug={ch.slug} className="h-7 w-7 shrink-0 text-orange-500" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{ch.name}</p>
                      <p className="text-xs text-ink/50">{ch._count.products} ürün</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ürünler */}
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white p-12 text-center text-ink/50">
              Bu kategoride henüz ürün yok.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={toProductDTO(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
