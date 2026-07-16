// Bài trụ cột đợt 2 — Úc, Canada, Châu Âu, Nhật/Hàn, Nhập hàng, Kiến thức.
// Chạy: node content/load-pillars-2.mjs
const SITE = process.env.SITE_URL || "http://localhost:3000";
const KEY = process.env.SITE_API_KEY || "mt-logs-dev-key-doi-truoc-khi-deploy";

const fig = (src, cap) => `<figure><img src="${src}" alt="${cap}" /><figcaption>${cap}</figcaption></figure>`;

const pillars = [
  {
    title: "Gửi hàng đi Úc 2026: thời gian, hàng cấm & thủ tục A–Z",
    slug: "gui-hang-di-uc-tong-quan",
    category: "Gửi hàng đi Úc",
    coverImage: "/images/cargo-port.jpg",
    excerpt: "Gửi hàng đi Úc với Minh Thiện: 4–8 ngày tới Sydney, Melbourne, Brisbane, Perth. Hỗ trợ thủ tục an toàn sinh học để hàng không bị giữ.",
    tags: "gửi hàng đi Úc, gửi đồ đi Úc, hàng cấm đi Úc, vận chuyển đi Úc",
    metaTitle: "Gửi hàng đi Úc 2026: thời gian, hàng cấm & thủ tục",
    metaDescription: "Gửi hàng đi Úc 4–8 ngày. Danh sách hàng cấm, cách khai báo an toàn sinh học và mẹo tránh bị giữ hàng. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Minh Thiện Logistics gửi hàng đi Úc tới Sydney, Melbourne, Brisbane, Perth… trong khoảng 4–8 ngày, lấy hàng tận nơi và hỗ trợ thủ tục an toàn sinh học.</strong> Vì Úc kiểm soát hàng hóa nhập cảnh rất nghiêm, bài viết này giúp bạn gửi đúng cách ngay từ đầu.</p>
${fig("/images/real/hai-san-kho.jpg", "Thực phẩm khô, đặc sản được đóng gói kỹ trước khi gửi đi Úc.")}
<h2>Gửi hàng đi Úc mất bao lâu?</h2>
<p>Thông thường 4–8 ngày làm việc tùy bang và loại dịch vụ. Minh Thiện theo dõi đơn 24/7 suốt hành trình.</p>
<h2>Những mặt hàng nào bị cấm hoặc hạn chế khi gửi đi Úc?</h2>
<ul><li>Thịt, hải sản tươi/khô chưa kiểm định</li><li>Hạt giống, cây tươi, đất</li><li>Sản phẩm từ sữa, trứng</li><li>Đồ gỗ chưa xử lý</li></ul>
<p>Đồ khô đóng gói công nghiệp, quần áo, đồ dùng cá nhân thì gửi bình thường.</p>
<h2>Đặc sản Việt có gửi đi Úc được không?</h2>
<p>Nhiều loại đặc sản khô gửi được nếu có nhãn mác và khai báo đúng. Hãy hỏi Minh Thiện trước để được tư vấn từng mặt hàng. Xem thêm dịch vụ <a href="/dich-vu/gui-hang-di-uc">Gửi hàng đi Úc</a>.</p>
<h2>Làm sao để hàng không bị giữ ở hải quan Úc?</h2>
<p>Khai báo trung thực, đóng gói sạch sẽ, dán nhãn rõ ràng và tránh hàng cấm. Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được kiểm tra danh sách hàng và báo giá miễn phí.</p>`,
    faqs: [
      { q: "Gửi hàng đi Úc mất bao lâu?", a: "Khoảng 4–8 ngày làm việc tùy bang và loại dịch vụ." },
      { q: "Gửi thực phẩm khô đi Úc được không?", a: "Được với đồ khô đóng gói công nghiệp, có nhãn mác và khai báo đúng; đồ tươi và thịt bị hạn chế." },
      { q: "Vì sao hàng đi Úc dễ bị giữ?", a: "Úc kiểm soát an toàn sinh học nghiêm. Khai báo đúng và tránh hàng cấm sẽ thông quan thuận lợi." },
    ],
  },
  {
    title: "Gửi hàng đi Canada 2026: thời gian, chi phí & lưu ý hải quan",
    slug: "gui-hang-di-canada-tong-quan",
    category: "Gửi hàng đi Canada",
    coverImage: "/images/worker.jpg",
    excerpt: "Gửi hàng đi Canada tới Toronto, Vancouver, Montreal, Calgary trong 5–9 ngày. Minh Thiện lấy hàng tận nơi, theo dõi đơn 24/7.",
    tags: "gửi hàng đi Canada, gửi đồ đi Canada, vận chuyển đi Canada",
    metaTitle: "Gửi hàng đi Canada 2026: thời gian, chi phí & hải quan",
    metaDescription: "Gửi hàng đi Canada 5–9 ngày tới Toronto, Vancouver, Montreal. Mặt hàng gửi được, lưu ý hải quan. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Minh Thiện Logistics gửi hàng đi Canada tới Toronto, Vancouver, Montreal, Calgary trong khoảng 5–9 ngày</strong>, lấy hàng tận nơi và cam kết thời gian, theo dõi đơn 24/7.</p>
${fig("/images/real/kien-hang-carton.jpg", "Kiện hàng đóng thùng chắc chắn, sẵn sàng gửi đi Canada.")}
<h2>Gửi hàng đi Canada mất bao lâu?</h2>
<p>Khoảng 5–9 ngày làm việc tùy thành phố và loại dịch vụ.</p>
<h2>Gửi được mặt hàng gì đi Canada?</h2>
<ul><li>Thực phẩm khô, đặc sản đóng gói</li><li>Quà tặng, đồ dùng cá nhân</li><li>Hàng cho du học sinh</li><li>Hàng kinh doanh nhỏ</li></ul>
<h2>Lưu ý thủ tục hải quan Canada</h2>
<p>Khai báo trung thực giá trị và loại hàng; thực phẩm cần đóng gói và nhãn mác rõ ràng. Minh Thiện hỗ trợ chuẩn bị thông tin để thông quan nhanh. Xem dịch vụ <a href="/dich-vu/gui-hang-di-canada">Gửi hàng đi Canada</a>.</p>
<h2>Chi phí gửi hàng đi Canada</h2>
<p>Cước tính theo trọng lượng thực hoặc quy đổi (số lớn hơn). Vì cước thay đổi theo thị trường, vui lòng liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được báo giá chính xác và miễn phí.</p>`,
    faqs: [
      { q: "Gửi hàng đi Canada mất bao lâu?", a: "Khoảng 5–9 ngày tùy thành phố và loại dịch vụ." },
      { q: "Gửi được thực phẩm đi Canada không?", a: "Được với thực phẩm khô đóng gói đúng chuẩn và khai báo rõ ràng." },
    ],
  },
  {
    title: "Gửi hàng đi Châu Âu 2026: Anh, Pháp, Đức & toàn khối EU",
    slug: "gui-hang-di-chau-au-tong-quan",
    category: "Gửi hàng đi Châu Âu",
    coverImage: "/images/containers.jpg",
    excerpt: "Gửi hàng đi Châu Âu (Anh, Pháp, Đức, EU) trong 4–8 ngày. Giải pháp cho cả cá nhân gửi quà lẫn doanh nghiệp xuất khẩu.",
    tags: "gửi hàng đi Châu Âu, gửi hàng đi Anh, gửi hàng đi Pháp, gửi hàng đi Đức",
    metaTitle: "Gửi hàng đi Châu Âu 2026: Anh, Pháp, Đức & EU",
    metaDescription: "Gửi hàng đi Châu Âu 4–8 ngày tới Anh, Pháp, Đức và toàn EU. Cá nhân & doanh nghiệp. Minh Thiện 0589.77.89.89 tư vấn miễn phí.",
    content: `<p><strong>Minh Thiện Logistics gửi hàng đi Châu Âu — Anh, Pháp, Đức và toàn khối EU — trong khoảng 4–8 ngày.</strong> Dịch vụ phù hợp cho cả cá nhân gửi quà cho người thân lẫn doanh nghiệp xuất khẩu hàng mẫu, hàng thương mại.</p>
${fig("/images/real/hang-hoa-da-dang.jpg", "Nhiều loại hàng hóa được gom và đóng gói gửi đi Châu Âu.")}
<h2>Gửi hàng đi Châu Âu mất bao lâu?</h2>
<p>Khoảng 4–8 ngày tùy quốc gia và loại dịch vụ.</p>
<h2>Gửi được mặt hàng gì đi Châu Âu?</h2>
<ul><li>Quà tặng, đồ cá nhân</li><li>Thực phẩm khô được phép</li><li>Hàng mẫu, hàng thương mại</li><li>Tài liệu, chứng từ</li></ul>
<h2>Chứng từ khi gửi đi Châu Âu</h2>
<p>Hàng thương mại cần hóa đơn và khai báo xuất khẩu đầy đủ; Minh Thiện hỗ trợ chuẩn bị. Xem dịch vụ <a href="/dich-vu/gui-hang-di-chau-au">Gửi hàng đi Châu Âu</a>.</p>
<h2>Báo giá gửi hàng đi Châu Âu</h2>
<p>Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được tư vấn tuyến phù hợp và báo giá miễn phí.</p>`,
    faqs: [
      { q: "Gửi hàng đi Châu Âu mất bao lâu?", a: "Khoảng 4–8 ngày tùy quốc gia." },
      { q: "Doanh nghiệp xuất khẩu hàng đi EU được hỗ trợ gì?", a: "Minh Thiện hỗ trợ chứng từ, hóa đơn và khai báo xuất khẩu cho hàng thương mại." },
    ],
  },
  {
    title: "Gửi hàng đi Nhật, Hàn 2026: cho du học sinh & người thân",
    slug: "gui-hang-di-nhat-han-tong-quan",
    category: "Gửi hàng đi Nhật / Hàn",
    coverImage: "/images/delivery.jpg",
    excerpt: "Gửi hàng đi Nhật Bản, Hàn Quốc (Tokyo, Osaka, Seoul) trong 3–6 ngày. Phù hợp gửi đồ ăn, thuốc, đồ dùng cho du học sinh, người lao động.",
    tags: "gửi hàng đi Nhật, gửi hàng đi Hàn Quốc, gửi đồ cho du học sinh",
    metaTitle: "Gửi hàng đi Nhật, Hàn 2026: du học sinh & người thân",
    metaDescription: "Gửi hàng đi Nhật, Hàn 3–6 ngày tới Tokyo, Osaka, Seoul. Gửi đồ ăn, thuốc, đồ dùng cho du học sinh. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Minh Thiện Logistics gửi hàng đi Nhật Bản và Hàn Quốc — Tokyo, Osaka, Seoul, Busan… — trong khoảng 3–6 ngày.</strong> Dịch vụ rất phù hợp để gửi đồ ăn, thuốc và đồ dùng cá nhân cho du học sinh, người lao động và việt kiều.</p>
${fig("/images/real/banh-keo-dac-san.jpg", "Bánh kẹo, đặc sản Việt được đóng gói gửi cho người thân ở Nhật, Hàn.")}
<h2>Gửi hàng đi Nhật, Hàn mất bao lâu?</h2>
<p>Khoảng 3–6 ngày tùy loại dịch vụ.</p>
<h2>Gửi được mặt hàng gì?</h2>
<ul><li>Đồ ăn, thực phẩm khô</li><li>Thuốc, đồ dùng cá nhân</li><li>Quà tặng</li><li>Hàng kinh doanh nhỏ</li></ul>
<h2>Gửi đồ cho du học sinh cần lưu ý gì?</h2>
<p>Nên đóng gói gọn, ghi rõ thực phẩm và tránh đồ tươi. Minh Thiện tư vấn mặt hàng phù hợp từng nước. Xem dịch vụ <a href="/dich-vu/gui-hang-di-nhat-han">Gửi hàng đi Nhật / Hàn</a>.</p>
<h2>Báo giá</h2>
<p>Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được báo giá nhanh, miễn phí.</p>`,
    faqs: [
      { q: "Gửi hàng đi Nhật/Hàn mất bao lâu?", a: "Khoảng 3–6 ngày tùy dịch vụ." },
      { q: "Gửi đồ ăn cho du học sinh được không?", a: "Được với đồ khô đóng gói kỹ; nên tránh đồ tươi và khai báo rõ ràng." },
    ],
  },
  {
    title: "Nhập hàng & mua hộ Trung Quốc, Thái Lan, Âu–Mỹ A–Z",
    slug: "nhap-hang-mua-ho-tong-quan",
    category: "Nhập hàng Trung Quốc",
    coverImage: "/images/truck.jpg",
    excerpt: "Nhập hàng và mua hộ Taobao, 1688, Amazon: thanh toán hộ, kiểm hàng tại kho và ship tận nơi về Việt Nam trong 5–12 ngày.",
    tags: "nhập hàng Trung Quốc, mua hộ Taobao, mua hộ Amazon, nhập hàng Thái Lan",
    metaTitle: "Nhập hàng & mua hộ Trung Quốc, Thái Lan, Âu–Mỹ A–Z",
    metaDescription: "Dịch vụ nhập hàng & mua hộ Taobao, 1688, Amazon. Thanh toán hộ, kiểm hàng, ship về VN 5–12 ngày. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Minh Thiện Logistics nhận nhập hàng và mua hộ từ Trung Quốc, Thái Lan, Âu–Mỹ — thanh toán hộ, kiểm hàng tại kho và ship tận nơi về Việt Nam trong khoảng 5–12 ngày.</strong> Bạn chỉ cần gửi link sản phẩm, chúng tôi lo phần còn lại.</p>
${fig("/images/real/kien-hang-so-luong-lon.jpg", "Lô hàng nhập số lượng lớn được gom và kiểm tại kho.")}
<h2>Quy trình nhập hàng gồm mấy bước?</h2>
<ol><li>Gửi link sản phẩm cần mua</li><li>Minh Thiện báo giá: tiền hàng + phí mua hộ + cước</li><li>Đặt và thanh toán hộ</li><li>Kiểm hàng tại kho</li><li>Vận chuyển về Việt Nam, giao tận nơi</li></ol>
<h2>Nhập hàng về mất bao lâu?</h2>
<table><tr><th>Đường</th><th>Thời gian</th><th>Phù hợp</th></tr>
<tr><td>Đường bay</td><td>3–5 ngày</td><td>Hàng gấp, nhẹ</td></tr>
<tr><td>Đường bộ</td><td>5–8 ngày</td><td>Đa số đơn lẻ</td></tr>
<tr><td>Đường biển</td><td>10–15 ngày</td><td>Hàng nặng, số lượng lớn</td></tr></table>
<h2>Mua hộ Taobao, 1688, Amazon có khó không?</h2>
<p>Không — bạn gửi link, Minh Thiện lo tiếng Trung/tiếng Anh, thanh toán và vận chuyển. Xem dịch vụ <a href="/dich-vu/nhap-hang-mua-ho">Nhập hàng & mua hộ</a>.</p>
<h2>Báo giá nhập hàng</h2>
<p>Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được báo giá trọn gói.</p>`,
    faqs: [
      { q: "Nhập hàng Trung Quốc mất bao lâu?", a: "Khoảng 5–12 ngày tùy đường bay, bộ hay biển." },
      { q: "Mua hộ có cần biết tiếng Trung không?", a: "Không. Bạn gửi link, Minh Thiện lo đặt hàng, thanh toán và vận chuyển." },
    ],
  },
  {
    title: "Cẩm nang gửi hàng đi quốc tế: thủ tục, đóng gói & cước phí",
    slug: "cam-nang-gui-hang-di-quoc-te",
    category: "Kiến thức",
    coverImage: "/images/boxes.jpg",
    excerpt: "Tất tần tật trước khi gửi hàng quốc tế: mặt hàng gửi được, cách đóng gói, cách tính cước và thủ tục hải quan cơ bản.",
    tags: "gửi hàng quốc tế, cách tính cước, đóng gói, thủ tục hải quan",
    metaTitle: "Cẩm nang gửi hàng đi quốc tế: thủ tục, đóng gói & cước",
    metaDescription: "Hướng dẫn gửi hàng quốc tế từ A–Z: mặt hàng gửi được, đóng gói, cách tính cước và thủ tục. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Để gửi hàng đi quốc tế thuận lợi, bạn cần nắm 4 điều: mặt hàng được phép gửi, cách đóng gói đúng chuẩn, cách tính cước và thủ tục hải quan.</strong> Bài viết tổng hợp ngắn gọn để bạn chuẩn bị trước khi gửi.</p>
${fig("/images/real/can-hang-truoc-gui.jpg", "Cân và kiểm tra kiện hàng trước khi gửi đi quốc tế.")}
<h2>Cước vận chuyển quốc tế tính thế nào?</h2>
<p>Cước tính theo số lớn hơn giữa <strong>trọng lượng thực</strong> và <strong>trọng lượng quy đổi</strong> (Dài×Rộng×Cao/5000). Xem chi tiết: <a href="/tin-tuc/bang-can-nang-cach-tinh-cuoc-van-chuyen-quoc-te">cách tính cước</a>.</p>
<h2>Đóng gói thế nào cho an toàn?</h2>
<p>Dùng thùng cứng, lót xốp, cố định chống xê dịch, dán nhãn rõ. Hàng dễ vỡ xem <a href="/tin-tuc/cach-dong-goi-hang-de-vo-gui-quoc-te">hướng dẫn đóng gói</a>.</p>
<h2>Thủ tục hải quan cơ bản</h2>
<p>Khai báo trung thực loại hàng và giá trị; thực phẩm/mỹ phẩm có thể cần khai báo theo nước đến (vd FDA với Mỹ). Minh Thiện hỗ trợ thủ tục.</p>
<h2>Cần tư vấn?</h2>
<p>Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> — tư vấn miễn phí cho mọi tuyến gửi hàng quốc tế.</p>`,
    faqs: [
      { q: "Cước quốc tế tính theo gì?", a: "Theo số lớn hơn giữa trọng lượng thực và trọng lượng quy đổi (DxRxC/5000)." },
      { q: "Gửi hàng quốc tế cần giấy tờ gì?", a: "Khai báo loại hàng và giá trị; một số mặt hàng/nước cần khai báo thêm (vd FDA với Mỹ). Minh Thiện hỗ trợ." },
    ],
  },
];

async function run() {
  for (const a of pillars) {
    const res = await fetch(`${SITE}/api/articles`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": KEY },
      body: JSON.stringify(a),
    });
    const data = await res.json().catch(() => ({}));
    console.log(res.status, a.slug, "→", data.url || data.error || "");
  }
}
run();
