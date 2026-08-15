import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "daily" },
    { path: "/dosyalar", priority: 0.6, freq: "weekly" },
    { path: "/hakkimizda", priority: 0.5, freq: "monthly" },
    { path: "/iletisim", priority: 0.5, freq: "monthly" },
    { path: "/mesafeli-satis", priority: 0.3, freq: "yearly" },
    { path: "/gizlilik", priority: 0.3, freq: "yearly" },
  ];

  return [
    ...staticPaths.map((s) => ({
      url: `${SITE_URL}${s.path}`,
      changeFrequency: s.freq,
      priority: s.priority,
    })),
    ...categories.map((c) => ({
      url: `${SITE_URL}/kategori/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
