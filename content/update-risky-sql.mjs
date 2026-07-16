import Database from "better-sqlite3";

const db = new Database("/Users/vince/Desktop/minhthien-web/prisma/dev.db");

const disclaimer = `

⚠️ **Lưu ý:** Hàng 'cho vô mồm' (thuốc, yến, thực phẩm) có rủi cao — dễ bị giữ hải quan, xét nghiệm, từ chối. Đền 100% nhưng khó thông quan, chi phí xử lý thêm. Chỉ gửi nếu khai báo FDA đúng + hàng sạch hoàn toàn.`;

const riskySlugs = [
  "gui-thuoc-tay-di-my-fda",
  "gui-yen-sao-di-my-fda-2026",
  "gui-nuoc-mam-di-my-fda",
  "gui-banh-keo-di-my-fda",
  "gui-my-pham-di-my-fda-chuan",
  "gui-sam-han-nhan-sam-di-my-fda",
  "gui-nong-san-viet-nam-di-my",
];

console.log(`\n📝 Cập nhật ${riskySlugs.length} bài hàng rủi cao...\n`);

const stmt = db.prepare(`UPDATE Article SET content = content || ? WHERE slug = ?`);

let count = 0;
for (const slug of riskySlugs) {
  const res = stmt.run(disclaimer, slug);
  if (res.changes > 0) {
    console.log(`✅ ${slug}`);
    count++;
  } else {
    console.log(`⏭️ ${slug} - không tìm thấy`);
  }
}

console.log(`\n✨ Cập nhật ${count}/${riskySlugs.length} bài xong!\n`);

db.close();
