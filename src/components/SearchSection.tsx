import { prisma } from "@/lib/prisma";
import { SearchBar } from "./SearchBar";

export async function SearchSection() {
  const [brandsRaw, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true },
    }),
  ]);
  const brands = brandsRaw.map((b) => b.brand).filter((b): b is string => Boolean(b));

  return (
    <section className="border-b border-green-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-ink/50">
          Aradığınız ürünü hemen bulun
        </h2>
        <SearchBar brands={brands} categories={categories} />
      </div>
    </section>
  );
}
