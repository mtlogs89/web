import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function POST(req: Request) {
  // Check admin session từ cookie
  const cookie = req.headers.get("cookie") || "";
  const adminSession = cookie.includes("admin_session=") || cookie.includes("auth=");

  // Cho phép: admin (có session) HOẶC có API key hợp lệ
  const key = req.headers.get("x-api-key");
  const isValidKey = process.env.ARTICLE_API_KEY && key === process.env.ARTICLE_API_KEY;

  if (!adminSession && !isValidKey) {
    return NextResponse.json({ error: "Không được phép upload" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file ảnh (field 'file')" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Định dạng không hỗ trợ: ${file.type}` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const baseName = slugify(String(form.get("name") || file.name.replace(/\.[^.]+$/, "")) || "anh");
  const filename = `${baseName || "anh"}-${Date.now()}.${EXT[file.type]}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
