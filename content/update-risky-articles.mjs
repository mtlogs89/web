// Update các bài hàng "rủi cao" (cho vô mồm) — thêm disclaimer
import Database from "better-sqlite3";

const db = new Database("/Users/vince/Desktop/minhthien-web/.next/server/app/prisma/dev.db");

const riskyKeywords = ["thuốc", "yến", "nước mắm", "bánh kẹo", "mỹ phẩm", "sâm", "nông sản", "cà phê", "cacao"];

const articles = db.prepare(`SELECT id, slug, excerpt FROM articles`).all();

const riskySlugs = articles.filter(a => riskyKeywords.some(k => a.slug.includes(k))).map(a => a.slug);

console.log(`📝 Found ${riskySlugs.length} risky articles:`);
riskySlugs.forEach(slug => console.log(`  - ${slug}`));

console.log(`\n⚠️ Cần update thêm disclaimer:\n"Đền 100% nhưng hàng 'cho vô mồm' có rủi cao — dễ bị giữ hải quan, xét nghiệm, từ chối. Chi phí xử lý thêm."\n`);

db.close();
