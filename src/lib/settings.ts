import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

/**
 * Site ayarlarını getirir; yoksa varsayılan tek satırı oluşturur.
 * İstekler arası önbelleklenir (DB yükü / Neon compute için); panelde ayar
 * kaydedilince admin-actions updateTag("settings") ile anında yenilenir.
 * Not: Önbellekten Decimal alanlar string döner, her zaman toNumber() ile kullan.
 */
export const getSettings = unstable_cache(async () => {
  let settings = await prisma.setting.findUnique({ where: { id: "main" } });
  if (!settings) {
    settings = await prisma.setting.create({ data: { id: "main" } });
  }
  return settings;
}, ["settings-main"], { tags: ["settings"], revalidate: 60 * 60 * 6 });

export type Settings = Awaited<ReturnType<typeof getSettings>>;
