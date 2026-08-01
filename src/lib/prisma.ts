import { PrismaClient } from "@prisma/client";

/**
 * DATABASE_URL çözümleme:
 * Vercel'in Neon entegrasyonu değişkenleri bir ön ek ile üretebiliyor
 * (ör. database_POSTGRES_PRISMA_URL, database_DATABASE_URL). Uygulama düz
 * `DATABASE_URL` beklediğinden, yoksa Neon'un ürettiği eşdeğer değişkeni
 * bulup ona atıyoruz. Prisma, client oluşturulurken env'i okuduğu için
 * bu atama new PrismaClient()'tan ÖNCE yapılmalı.
 */
if (!process.env.DATABASE_URL) {
  const env = process.env;
  const pick = (test: (k: string) => boolean) =>
    Object.keys(env).find((k) => test(k) && !!env[k]);

  const key =
    pick((k) => k.endsWith("POSTGRES_PRISMA_URL")) || // pgbouncer'lı, Prisma için ideal (pooled)
    pick((k) => k.endsWith("DATABASE_URL")) ||
    pick((k) => k.endsWith("POSTGRES_URL")) ||
    pick((k) => k.endsWith("POSTGRES_URL_NON_POOLING"));

  if (key) process.env.DATABASE_URL = env[key];
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
