import { cn } from "@/lib/utils";

/**
 * SÖZTEK Bilgisayar resmi logosu (public/logo.png — 819×251, beyaz zemin).
 * Beyaz zeminli olduğu için header'da (beyaz) doğrudan, footer'da (koyu)
 * beyaz kutu içinde kullanılır.
 */
export function Logo({ className }: { variant?: "dark" | "light"; className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.png"
      alt="SÖZTEK Bilgisayar"
      width={819}
      height={251}
      className={cn("h-10 w-auto sm:h-12", className)}
    />
  );
}
