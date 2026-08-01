import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { SearchSection } from "@/components/SearchSection";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Arama" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string }>;
}) {
  const { q, brand } = await searchParams;
  const term = q?.trim() ?? "";
  const brandTerm = brand?.trim() ?? "";

  let products: Prisma.ProductGetPayload<{ include: { category: true } }>[] = [];
  let heading = "";

  if (brandTerm) {
    heading = `Marka: ${brandTerm}`;
    products = await prisma.product.findMany({
      where: { isActive: true, brand: { equals: brandTerm, mode: "insensitive" } },
      include: { category: true },
      orderBy: [{ stock: "desc" }, { order: "asc" }],
      take: 60,
    });
  } else if (term.length >= 2) {
    heading = `"${term}" için sonuçlar`;
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { brand: { contains: term, mode: "insensitive" } },
          { sku: { contains: term, mode: "insensitive" } },
        ],
      },
      include: { category: true },
      orderBy: [{ stock: "desc" }, { order: "asc" }],
      take: 60,
    });
  }

  const searched = brandTerm !== "" || term.length >= 2;

  return (
    <div>
      <SearchSection />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {!searched ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search size={40} className="text-green-200" />
            <p className="text-ink/60">Aramak istediğiniz ürünü yukarıdaki kutuya yazın.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-baseline justify-between gap-3">
              <h1 className="text-2xl font-extrabold text-ink">{heading}</h1>
              <span className="text-sm text-ink/50">{products.length} ürün</span>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <Search size={40} className="text-green-200" />
                <p className="text-ink/60">Sonuç bulunamadı. Farklı bir kelime deneyin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={toProductDTO(p)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
