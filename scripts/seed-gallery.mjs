// Seed thư viện ảnh mẫu vào DB nếu bảng đang trống.
// Chạy 1 lần trên VPS sau khi `prisma db push`:  node scripts/seed-gallery.mjs
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";

const db = new Database(new URL("../prisma/dev.db", import.meta.url).pathname);

const count = db.prepare("SELECT COUNT(*) AS c FROM GalleryImage").get().c;
if (count > 0) {
  console.log(`Bảng đã có ${count} ảnh — bỏ qua seed.`);
  process.exit(0);
}

// Đọc danh sách mặc định trực tiếp từ src/lib/gallery.ts để khỏi lặp thủ công.
const ts = readFileSync(new URL("../src/lib/gallery.ts", import.meta.url), "utf8");
const items = [...ts.matchAll(/\{\s*src:\s*"([^"]+)",\s*caption:\s*"([^"]+)"\s*\}/g)].map((m) => ({
  src: m[1],
  caption: m[2],
}));

const insert = db.prepare("INSERT INTO GalleryImage (id, src, caption, sort) VALUES (?, ?, ?, ?)");
const tx = db.transaction((rows) => {
  rows.forEach((it, i) => insert.run("g" + randomUUID(), it.src, it.caption, i));
});
tx(items);

console.log(`Đã seed ${items.length} ảnh mẫu vào thư viện.`);
