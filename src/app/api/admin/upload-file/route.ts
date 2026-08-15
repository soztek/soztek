import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

// Blob token'ı önekli gelebiliyor (soztek_READ_WRITE_TOKEN); @vercel/blob
// BLOB_READ_WRITE_TOKEN bekliyor. Yoksa önekliyi ona ata.
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  const key = Object.keys(process.env).find(
    (k) => k.toUpperCase().endsWith("_READ_WRITE_TOKEN") && process.env[k]
  );
  if (key) process.env.BLOB_READ_WRITE_TOKEN = process.env[key];
}

// Büyük dosyalar için client-side doğrudan Blob'a yükleme (4.5MB serverless
// gövde sınırını aşar). Sürücü/kurulum dosyaları için 500MB'a kadar.
export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isAuthed())) throw new Error("Yetkisiz");
        return {
          addRandomSuffix: true,
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
        };
      },
      onUploadCompleted: async () => {
        // gerekirse burada loglanabilir
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Yükleme hatası" },
      { status: 400 }
    );
  }
}
