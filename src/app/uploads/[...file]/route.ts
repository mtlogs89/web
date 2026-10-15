import { readFile } from "fs/promises";
import path from "path";

// Bản `next start` chỉ phục vụ những file có trong public/ LÚC BUILD. Ảnh up qua
// /api/upload hay ảnh AI vẽ sau lần deploy gần nhất thì Next trả 404, kéo theo
// next/image (tự gọi lại /uploads/...) trả 400 → thẻ bài trên trang chủ hiện ô trống.
// Route này đọc thẳng từ đĩa cho các file đó. Khách vẫn nhận /uploads/ từ nginx
// (khối `location /uploads/`), route chỉ đỡ cho next/image và lúc chạy local.
const DIR = path.join(process.cwd(), "public", "uploads");

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ file: string[] }> }) {
  const { file } = await params;
  const full = path.join(DIR, ...file);
  const type = TYPES[path.extname(full).toLowerCase()];
  // Chặn ../ thoát ra ngoài thư mục uploads và mọi đuôi không phải ảnh.
  if (!type || !full.startsWith(DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await readFile(full);
    return new Response(data, {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=2592000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
