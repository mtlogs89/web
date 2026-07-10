import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

const articles = [
  {
    slug: "cach-gui-thuc-pham-kho-di-my-khong-bi-giu-hai-quan",
    title: "Cách gửi thực phẩm khô đi Mỹ không bị giữ hải quan",
    excerpt:
      "Danh sách mặt hàng được phép, cách khai báo FDA và đóng gói đúng chuẩn để hàng thông quan nhanh.",
    coverImage: "/images/warehouse.jpg",
    category: "Gửi hàng đi Mỹ",
    tags: "gửi hàng đi Mỹ,thực phẩm khô,FDA,hải quan",
    content: `<h2>Gửi thực phẩm khô đi Mỹ cần lưu ý gì?</h2><p>Khi gửi thực phẩm khô đi Mỹ, hàng phải tuân thủ quy định của <strong>FDA</strong>. Đóng gói kín, ghi nhãn rõ ràng và khai báo trung thực giúp hàng thông quan nhanh.</p><h2>Những mặt hàng được phép gửi</h2><ul><li>Bánh kẹo, cà phê, trà đóng gói công nghiệp</li><li>Đồ khô như nấm, măng, miến (đã sấy, đóng gói)</li><li>Gia vị, hạt khô có nhãn mác</li></ul><h2>Đóng gói đúng chuẩn</h2><p>Hút chân không, bọc chống ẩm, ghi thành phần bằng tiếng Anh. Liên hệ Minh Thiện Logistics 0589.77.89.89 để được tư vấn miễn phí.</p>`,
    faqJson: JSON.stringify([
      { q: "Gửi thực phẩm khô đi Mỹ có bị đánh thuế không?", a: "Tùy giá trị lô hàng; Minh Thiện sẽ tư vấn cách khai báo hợp lệ để tối ưu chi phí." },
      { q: "Thời gian gửi thực phẩm đi Mỹ bao lâu?", a: "Thông thường 5–7 ngày tùy bang và dịch vụ." },
    ]),
  },
  {
    slug: "kinh-nghiem-order-taobao-1688-cho-nguoi-moi",
    title: "Kinh nghiệm order Taobao, 1688 cho người mới bắt đầu",
    excerpt:
      "Từ tìm nguồn, kiểm hàng đến tính cước về Việt Nam — hướng dẫn từng bước cho người mới.",
    coverImage: "/images/containers.jpg",
    category: "Nhập hàng Trung Quốc",
    tags: "nhập hàng Trung Quốc,Taobao,1688,mua hộ",
    content: `<h2>Order Taobao, 1688 bắt đầu từ đâu?</h2><p>Người mới nên dùng dịch vụ mua hộ để được thanh toán hộ bằng nhân dân tệ và gom hàng về kho. Minh Thiện hỗ trợ trọn gói.</p><h2>Các bước order</h2><ol><li>Tìm sản phẩm, gửi link cho Minh Thiện</li><li>Báo giá gồm tiền hàng + phí mua hộ + cước vận chuyển</li><li>Kiểm hàng tại kho Trung Quốc</li><li>Ship về Việt Nam, giao tận nơi</li></ol>`,
    faqJson: JSON.stringify([
      { q: "Mua hộ Taobao mất phí bao nhiêu?", a: "Phí mua hộ tính theo % giá trị đơn; liên hệ 0589.77.89.89 để báo giá chính xác." },
    ]),
  },
  {
    slug: "bang-can-nang-cach-tinh-cuoc-van-chuyen-quoc-te",
    title: "Bảng cân nặng & cách tính cước vận chuyển quốc tế",
    excerpt:
      "Hiểu rõ trọng lượng thực và trọng lượng quy đổi để tối ưu chi phí gửi hàng quốc tế.",
    coverImage: "/images/truck.jpg",
    category: "Kiến thức",
    tags: "tính cước,trọng lượng quy đổi,vận chuyển quốc tế",
    content: `<h2>Trọng lượng tính cước là gì?</h2><p>Cước quốc tế tính theo số lớn hơn giữa <strong>trọng lượng thực</strong> và <strong>trọng lượng quy đổi</strong> (Dài×Rộng×Cao/5000).</p><h2>Ví dụ</h2><p>Một kiện 40×30×20cm nặng 3kg sẽ có trọng lượng quy đổi = 40×30×20/5000 = 4.8kg, nên tính cước theo 4.8kg.</p>`,
    faqJson: JSON.stringify([
      { q: "Trọng lượng quy đổi tính thế nào?", a: "Dài × Rộng × Cao (cm) chia 5000, ra số kg quy đổi." },
    ]),
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "minhthien@2026";
  await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: { username, password: await bcrypt.hash(password, 10), name: "Quản trị viên" },
  });

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: { coverImage: a.coverImage },
      create: a,
    });
  }

  const code = "MT2026DEMO01";
  const order = await prisma.order.upsert({
    where: { trackingCode: code },
    update: {},
    create: {
      trackingCode: code,
      senderName: "Nguyễn Văn A",
      receiverName: "Tran B (California)",
      destination: "Mỹ (California)",
      weight: 5.2,
      status: "Đang vận chuyển",
    },
  });
  const count = await prisma.orderEvent.count({ where: { orderId: order.id } });
  if (count === 0) {
    await prisma.orderEvent.createMany({
      data: [
        { orderId: order.id, status: "Đã tiếp nhận", location: "TP.HCM", note: "Lấy hàng tận nơi" },
        { orderId: order.id, status: "Đã xuất kho", location: "Kho TSN" },
        { orderId: order.id, status: "Đang vận chuyển", location: "Sân bay quốc tế" },
      ],
    });
  }

  console.log("✅ Seed xong: admin, 3 bài viết, 1 đơn demo (mã MT2026DEMO01)");
}

main().finally(() => process.exit(0));
