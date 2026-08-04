// Site geneli SEO sabitleri
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://soztek.com.tr").replace(/\/$/, "");
export const SITE_NAME = "SÖZTEK Bilgisayar";
export const LEGAL_NAME = "SÖZTEK Bilgisayar Elek. Güv. Sis. İlet. Kır. San. ve Tic. Ltd. Şti.";

export function abs(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : "/" + path}`;
}
