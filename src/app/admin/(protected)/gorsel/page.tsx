import { ImageLinkTool } from "@/components/admin/ImageLinkTool";

export const dynamic = "force-dynamic";

export default function AdminImageLink() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink">Görsel Linki</h1>
      <p className="mt-1 text-sm text-ink/60">
        Bir görseli yükleyip herkese açık bir <b>URL</b> elde edin. Bu adresi logo/görsel URL alanı isteyen
        başka panellere yapıştırabilirsiniz.
      </p>
      <div className="mt-6">
        <ImageLinkTool />
      </div>
    </div>
  );
}
