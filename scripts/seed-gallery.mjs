// Seed thư viện ảnh mẫu vào DB nếu bảng đang trống.
// Chạy 1 lần trên VPS sau khi `prisma db push`:  node scripts/seed-gallery.mjs
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

// Đọc danh sách mặc định trực tiếp từ src/lib/gallery.ts để khỏi lặp thủ công.
const ts = readFileSync(new URL("../src/lib/gallery.ts", import.meta.url), "utf8");
const items = [...ts.matchAll(/\{\s*src:\s*"([^"]+)",\s*caption:\s*"([^"]+)"\s*\}/g)].map((m) => ({
  src: m[1],
  caption: m[2],
}));

const count = await prisma.galleryImage.count();
if (count > 0) {
  console.log(`Bảng đã có ${count} ảnh — bỏ qua seed.`);
} else {
  await prisma.galleryImage.createMany({
    data: items.map((it, i) => ({ src: it.src, caption: it.caption, sort: i })),
  });
  console.log(`Đã seed ${items.length} ảnh mẫu vào thư viện.`);
}

await prisma.$disconnect();
