import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import OpenAI from "openai";

/**
 * Vẽ ảnh đại diện bài viết bằng OpenAI.
 *
 * Lưu ý: DALL-E 3 đã bị gỡ khỏi API. Model ảnh hiện tại là họ `gpt-image-*`,
 * trả về **base64** (`b64_json`) chứ không phải URL như DALL-E, và chỉ nhận
 * các size 1024x1024 / 1536x1024 / 1024x1536 / auto.
 */
const MODEL = "gpt-image-2";
const SIZE = "1536x1024"; // ngang, chuẩn banner/OG
// Ảnh gốc OpenAI trả về ~1.4MB — nén như ảnh upload (xem api/upload) để trang nhẹ.
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

export function buildThumbnailPrompt(title: string, category?: string) {
  return `Professional logistics shipping banner for article: "${title}"${
    category ? ` (Category: ${category})` : ""
  }. Style: Modern, clean, cargo airplane, delivery truck, shipping containers, teal green and white color scheme. Vibrant colors, 4k quality. NO text or letters on image.`;
}

/** Vẽ ảnh rồi lưu vào public/uploads, trả về đường dẫn dạng /uploads/... */
export async function generateThumbnail(title: string, category?: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Chưa cấu hình OPENAI_API_KEY trên máy chủ");

  const openai = new OpenAI({ apiKey });

  const res = await openai.images.generate({
    model: MODEL,
    prompt: buildThumbnailPrompt(title, category),
    n: 1,
    size: SIZE,
    output_format: "webp",
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI không trả về ảnh");

  const compressed = await sharp(Buffer.from(b64, "base64"))
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `ai-thumbnail-${Date.now()}.webp`;
  await writeFile(join(uploadsDir, filename), compressed);

  return `/uploads/${filename}`;
}
