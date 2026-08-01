import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Canlı arama önerileri (min 3 karakter). Ad, marka ve ürün kodunda arar.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 8,
    orderBy: [{ stock: "desc" }, { order: "asc" }],
    select: {
      name: true,
      slug: true,
      price: true,
      compareAt: true,
      imageUrl: true,
      brand: true,
      stock: true,
      category: { select: { emoji: true } },
    },
  });

  return NextResponse.json({
    products: products.map((p) => ({
      name: p.name,
      slug: p.slug,
      price: toNumber(p.price),
      compareAt: p.compareAt ? toNumber(p.compareAt) : null,
      imageUrl: p.imageUrl,
      brand: p.brand,
      stock: p.stock,
      emoji: p.category?.emoji ?? null,
    })),
  });
}
