// Tách bài trụ cột Nhật/Hàn thành 2 bài riêng. Chạy: node content/load-nhat-han.mjs
const SITE = process.env.SITE_URL || "http://localhost:3000";
const KEY = process.env.SITE_API_KEY || "mt-logs-dev-key-doi-truoc-khi-deploy";
const fig = (src, cap) => `<figure><img src="${src}" alt="${cap}" /><figcaption>${cap}</figcaption></figure>`;

const pillars = [
  {
    title: "Gửi hàng đi Nhật Bản 2026: cho du học sinh & người thân",
    slug: "gui-hang-di-nhat-tong-quan",
    category: "Gửi hàng đi Nhật Bản",
    coverImage: "/images/delivery.jpg",
    excerpt: "Gửi hàng đi Nhật Bản (Tokyo, Osaka, Nagoya, Fukuoka) trong 3–6 ngày. Phù hợp gửi đồ ăn, thuốc, đồ dùng cho du học sinh, người lao động.",
    tags: "gửi hàng đi Nhật, gửi hàng đi Nhật Bản, gửi đồ đi Tokyo, gửi đồ cho du học sinh Nhật",
    metaTitle: "Gửi hàng đi Nhật Bản 2026: du học sinh & người thân",
    metaDescription: "Gửi hàng đi Nhật Bản 3–6 ngày tới Tokyo, Osaka, Nagoya. Gửi đồ ăn, thuốc, đồ dùng cho du học sinh. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Minh Thiện Logistics gửi hàng đi Nhật Bản — Tokyo, Osaka, Nagoya, Fukuoka… — trong khoảng 3–6 ngày.</strong> Dịch vụ rất phù hợp để gửi đồ ăn, thuốc và đồ dùng cá nhân cho du học sinh, người lao động và việt kiều tại Nhật.</p>
${fig("/images/real/banh-keo-dac-san.jpg", "Bánh kẹo, đặc sản Việt được đóng gói gửi sang Nhật cho người thân.")}
<h2>Gửi hàng đi Nhật Bản mất bao lâu?</h2>
<p>Thông thường 3–6 ngày làm việc tùy loại dịch vụ. Minh Thiện lấy hàng tận nơi và theo dõi đơn 24/7.</p>
<h2>Gửi được mặt hàng gì đi Nhật?</h2>
<ul><li>Đồ ăn, thực phẩm khô</li><li>Thuốc, đồ dùng cá nhân</li><li>Quà tặng</li><li>Hàng kinh doanh nhỏ</li></ul>
<h2>Gửi đồ cho du học sinh ở Nhật cần lưu ý gì?</h2>
<p>Nên đóng gói gọn, ghi rõ thực phẩm và tránh đồ tươi. Minh Thiện tư vấn mặt hàng phù hợp với quy định Nhật. Xem dịch vụ <a href="/dich-vu/gui-hang-di-nhat">Gửi hàng đi Nhật Bản</a>.</p>
<h2>Báo giá gửi hàng đi Nhật</h2>
<p>Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được báo giá nhanh, miễn phí.</p>`,
    faqs: [
      { q: "Gửi hàng đi Nhật Bản mất bao lâu?", a: "Khoảng 3–6 ngày tùy loại dịch vụ." },
      { q: "Gửi đồ ăn cho du học sinh ở Nhật được không?", a: "Được với đồ khô đóng gói kỹ; nên tránh đồ tươi và khai báo rõ ràng." },
    ],
  },
  {
    title: "Gửi hàng đi Hàn Quốc 2026: cho du học sinh & người thân",
    slug: "gui-hang-di-han-tong-quan",
    category: "Gửi hàng đi Hàn Quốc",
    coverImage: "/images/plane.jpg",
    excerpt: "Gửi hàng đi Hàn Quốc (Seoul, Busan, Incheon, Daegu) trong 3–6 ngày. Phù hợp gửi đồ ăn, thuốc, quà cho du học sinh, người lao động.",
    tags: "gửi hàng đi Hàn, gửi hàng đi Hàn Quốc, gửi đồ đi Seoul, gửi đồ cho du học sinh Hàn",
    metaTitle: "Gửi hàng đi Hàn Quốc 2026: du học sinh & người thân",
    metaDescription: "Gửi hàng đi Hàn Quốc 3–6 ngày tới Seoul, Busan, Incheon. Gửi đồ ăn, thuốc, quà cho du học sinh. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Minh Thiện Logistics gửi hàng đi Hàn Quốc — Seoul, Busan, Incheon, Daegu… — trong khoảng 3–6 ngày.</strong> Dịch vụ phù hợp để gửi đồ ăn, thuốc và quà cho du học sinh, người lao động và việt kiều tại Hàn.</p>
${fig("/images/real/qua-tang-dong-goi.jpg", "Quà và đặc sản Việt được đóng gói chắc chắn gửi sang Hàn Quốc.")}
<h2>Gửi hàng đi Hàn Quốc mất bao lâu?</h2>
<p>Thông thường 3–6 ngày làm việc tùy loại dịch vụ. Minh Thiện lấy hàng tận nơi và theo dõi đơn 24/7.</p>
<h2>Gửi được mặt hàng gì đi Hàn?</h2>
<ul><li>Đồ ăn, thực phẩm khô</li><li>Thuốc, đồ dùng cá nhân</li><li>Quà tặng</li><li>Hàng kinh doanh nhỏ</li></ul>
<h2>Gửi đồ cho du học sinh ở Hàn cần lưu ý gì?</h2>
<p>Nên đóng gói gọn, ghi rõ thực phẩm và tránh đồ tươi. Minh Thiện tư vấn mặt hàng phù hợp với quy định Hàn Quốc. Xem dịch vụ <a href="/dich-vu/gui-hang-di-han">Gửi hàng đi Hàn Quốc</a>.</p>
<h2>Báo giá gửi hàng đi Hàn</h2>
<p>Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được báo giá nhanh, miễn phí.</p>`,
    faqs: [
      { q: "Gửi hàng đi Hàn Quốc mất bao lâu?", a: "Khoảng 3–6 ngày tùy loại dịch vụ." },
      { q: "Gửi đồ ăn cho du học sinh ở Hàn được không?", a: "Được với đồ khô đóng gói kỹ; nên tránh đồ tươi và khai báo rõ ràng." },
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
