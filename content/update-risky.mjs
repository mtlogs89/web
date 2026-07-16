import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const disclaimer = "\n\n⚠️ **Lưu ý:** Hàng 'cho vô mồm' (thuốc, yến, thực phẩm) có rủi cao — dễ bị giữ hải quan, xét nghiệm, từ chối. Đền 100% nhưng khó thông quan, chi phí xử lý thêm. Chỉ gửi nếu khai báo FDA đúng + hàng sạch hoàn toàn.";

const riskySlugs = [
  "gui-thuoc-tay-di-my-fda",
  "gui-yen-sao-di-my-fda-2026",
  "gui-nuoc-mam-di-my-fda",
  "gui-banh-keo-di-my-fda",
  "gui-my-pham-di-my-fda-chuan",
  "gui-sam-han-nhan-sam-di-my-fda",
  "gui-nong-san-viet-nam-di-my",
];

(async () => {
  console.log(`\n📝 Cập nhật ${riskySlugs.length} bài hàng "rủi cao"...\n`);

  for (const slug of riskySlugs) {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      console.log(`❌ ${slug} - không tìm thấy`);
      continue;
    }

    const updated = await prisma.article.update({
      where: { slug },
      data: {
        content: article.content + disclaimer,
      },
    });

    console.log(`✅ ${slug}`);
  }

  console.log(`\n✨ Xong! Tất cả bài hàng rủi cao đã thêm disclaimer.\n`);
  await prisma.$disconnect();
})();
