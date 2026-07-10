import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getAdminId } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Ảnh hiển thị trong bài không cần rộng quá 1600px; webp q82 nhìn như gốc
// nhưng nhẹ hơn ~90% so với ảnh chụp màn hình/điện thoại.
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function POST(req: Request) {
  // Cho phép: admin đã đăng nhập (cookie mt_admin hợp lệ) HOẶC có API key hợp lệ
  const adminId = await getAdminId();
  const key = req.headers.get("x-api-key");
  const isValidKey = process.env.ARTICLE_API_KEY && key === process.env.ARTICLE_API_KEY;

  if (!adminId && !isValidKey) {
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

  let buffer = Buffer.from(await file.arrayBuffer());
  const baseName = slugify(String(form.get("name") || file.name.replace(/\.[^.]+$/, "")) || "anh");
  let ext: string;

  if (file.type === "image/gif") {
    // GIF giữ nguyên để không mất animation
    ext = "gif";
  } else {
    // Nén: xoay đúng chiều (EXIF), thu về tối đa 1600px, xuất webp
    buffer = Buffer.from(
      await sharp(buffer)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
    );
    ext = "webp";
  }

  const filename = `${baseName || "anh"}-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}`, size: buffer.length });
}
