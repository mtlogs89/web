import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
// Bản OpenAI SDK đang cài khai báo index.d.mts nhưng không đóng gói file đó. Entry .js vẫn
// là API chính thức và TypeScript tìm được index.d.ts đi kèm, nên build không bị kẹt type-check.
import OpenAI from "openai/index.js";

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

// Mỗi bài một "cảnh" khác nhau (chọn theo tiêu đề) để ảnh không na ná nhau.
const SCENES = [
  "close-up of hands packing the item into a cardboard box on a wooden packing table, bubble wrap and tape nearby",
  "the item neatly laid out on a clean table next to a sealed cardboard shipping box and a small parcel scale",
  "a courier handing over a sealed parcel at a doorway, the box slightly open showing the item wrapped in paper",
  "overhead flat-lay of the item with packing materials: kraft paper, bubble wrap, tape, a customs form, a marker pen",
  "small warehouse shelf with several labelled cardboard boxes, one box open showing the item inside, soft window light",
  "a person weighing a packed box on a digital scale, the item visible beside it, shallow depth of field",
];

function pickScene(title: string) {
  let h = 0;
  for (const ch of title) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return SCENES[h % SCENES.length];
}

export function buildThumbnailPrompt(title: string, category?: string) {
  return `Realistic documentary photograph for an article titled: "${title}"${
    category ? ` (topic: ${category})` : ""
  }. Show the specific item or product the title is about (infer it from the title). Scene: ${pickScene(
    title,
  )}. Natural lighting, authentic candid look, slightly imperfect like a real phone/camera photo, muted natural colors. Do NOT draw airplanes, trucks, ships, containers, globes, maps or flags. Do not make it look like an illustration or 3D render. NO text, letters, logos or watermarks.`;
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
