// Bài viết tay: Gửi cá khô, mực khô đi Mỹ - điều kiện + đóng gói
const SITE = process.env.SITE_URL || "http://localhost:3000";
const KEY = process.env.SITE_API_KEY || "mt-logs-dev-key-doi-truoc-khi-deploy";
const fig = (src, cap) => `<figure><img src="${src}" alt="${cap}" /><figcaption>${cap}</figcaption></figure>`;

const article = {
  title: "Gửi cá khô, mực khô đi Mỹ: điều kiện + cách đóng gói an toàn",
  slug: "gui-ca-kho-muc-kho-di-my",
  category: "Gửi hàng đi Mỹ",
  coverImage: "/images/real/hai-san-kho.jpg",
  excerpt:
    "Cá khô, mực khô, tôm khô được phép gửi đi Mỹ nhưng phải đáp ứng điều kiện khắt khe: không mốc mốc, không mùi tanh, hạn sử dụng còn lâu, hút chân không, nhãn mác đầy đủ. Minh Thiện hỗ trợ từ A đến Z.",
  tags: "gửi cá khô đi mỹ, gửi mực khô đi mỹ, gửi tôm khô đi mỹ, gửi hải sản khô đi mỹ, hút chân không",
  metaTitle: "Gửi cá khô mực khô đi Mỹ: điều kiện + cách đóng gói an toàn",
  metaDescription:
    "Cá khô, mực khô, tôm khô gửi đi Mỹ được — nhưng phải khô hoàn toàn, hút chân không, nhãn mác rõ, hạn sử dụng còn lâu. Hướng dẫn từ A-Z của Minh Thiện. 0589.77.89.89",
  faqs: [
    { q: "Gửi cá khô, mực khô đi Mỹ được không?", a: "Được hoàn toàn. Cá khô, mực khô, tôm khô được chính phủ Mỹ cho phép gửi vào mà không bị giới hạn số lượng, miễn điều kiện đáp ứng tiêu chuẩn." },
    { q: "Hải sản khô phải khô như thế nào mới qua được?", a: "Phải thật khô, không bị ẩm mốc, không mùi tanh của cá tươi. Nếu có mùi hôi lạ, hải quan sẽ nghi ngờ và giữ hàng kiểm tra. Phải lưu trữ nơi khô ráo trước khi gửi." },
    { q: "Hạn sử dụng phải còn bao lâu?", a: "Nên còn ít nhất 6-12 tháng từ ngày gửi. Nếu hạn sắp hết hoặc đã quá, hải quan có thể từ chối nhập khẩu vì lý do vệ sinh an toàn thực phẩm." },
    { q: "Phải hút chân không không?", a: "Nên hút chân không. Ngoài việc giữ chất lượng sản phẩm, hút chân không cũng giúp tránh mùi thoát ra ngoài lô hàng, gây ảnh hưởng tới các hàng khác." },
    { q: "Nhãn mác tiếng Anh hay tiếng Việt?", a: "Tốt nhất là song ngữ (Việt + Anh) hoặc tiếng Anh. Nhãn mác phải ghi: tên sản phẩm, thành phần, nơi sản xuất, ngày sản xuất, hạn sử dụng, trọng lượng, hướng dẫn bảo quản, số điện thoại liên hệ." },
  ],
  content: `<p><strong>Cá khô, mực khô, tôm khô — hải sản khô được cho phép gửi đi Mỹ mà không bị cấm.</strong> Tuy nhiên, những điều kiện khắt khe chứng thực sản phẩm là loại thực phẩm đã qua xử lý và bảo quản đúng cách. Minh Thiện hỗ trợ quy trình từ A đến Z: kiểm hàng, đóng gói, khai báo hải quan, đến khi giao tận tay ở Mỹ.</p>

${fig("/images/real/hai-san-kho.jpg", "Hải sản khô: cá khô, mực khô, tôm khô được gửi đi Mỹ nếu đáp ứng điều kiện kỹ lưỡng.")}

<h2>Cá khô, mực khô được phép gửi đi Mỹ — nhưng phải điều kiện</h2>
<p>Điểm tốt là Mỹ không cấm hải sản khô; điểm khó là tiêu chí kiểm tra rất kỹ:</p>
<ul>
<li><strong>Phải thật khô:</strong> không ẩm mốc, không mốc mắn, không mùi tanh hoặc hôi bất thường của cá tươi chưa xử lý.</li>
<li><strong>Hạn sử dụng còn lâu:</strong> ít nhất 6–12 tháng từ ngày gửi. Hàng sắp hết hạn hoặc quá hạn sẽ bị từ chối.</li>
<li><strong>Nhãn mác đầy đủ:</strong> tiếng Anh (hoặc song ngữ Anh–Việt), ghi rõ nơi sản xuất, thành phần, hạn sử dụng, trọng lượng.</li>
<li><strong>Đóng gói kỹ lưỡng:</strong> túi hút chân không + thùng carton chắc chắn, không để mùi thoát ra.</li>
<li><strong>Chứng nhận vệ sinh an toàn thực phẩm:</strong> nên có giấy chứng nhận từ nhà máy/xưởng sản xuất.</li>
</ul>

<h2>Vì sao hải sản khô khắt khe khi gửi đi Mỹ?</h2>
<p>Mỹ kiểm soát thực phẩm rất chặt để bảo vệ sức khỏe người tiêu dùng. Hải sản khô dễ bị:</p>
<ul>
<li><strong>Mốc, nấm:</strong> nếu bảo quản trong môi trường ẩm, hàng dễ mốc → bị từ chối.</li>
<li><strong>Nhiễm khuẩn (Salmonella, Listeria):</strong> hàng khô vẫn có thể chứa khuẩn nếu quá trình xử lý không sạch.</li>
<li><strong>Mùi lạ:</strong> nếu lưu kho trong môi trường có mùi (xăng, hóa chất), hàng sẽ "hôi lạ" và bị giữ.</li>
</ul>

<h2>Cách đóng gói cá khô, mực khô để vượt qua hải quan Mỹ</h2>

<h3>📦 Bước 1: Kiểm hàng & chọn sản phẩm</h3>
<ul>
<li>Chỉ lựa chọn cá/mực khô **thật khô**, không có vết mốc, nấm, hoặc màu lạ.</li>
<li>Hạn sử dụng phải **còn ít nhất 6–12 tháng**.</li>
<li>Nếu có mùi tanh lạnh (mùi cá tươi), hàng không phù hợp gửi.</li>
</ul>

<h3>📦 Bước 2: Hút chân không</h3>
<ul>
<li>Dùng máy hút chân không bao gói từng gói nhỏ (nếu từng túi riêng) hoặc gói lớn.</li>
<li>Mục đích: bảo tồn chất lượng + ngăn mùi thoát ra ngoài.</li>
<li>Sau khi hút, dán nhãn mác rõ ràng (tiếng Anh).</li>
</ul>

<h3>📦 Bước 3: Nhãn mác (Label) — yêu cầu bắt buộc</h3>
<p>Mỗi gói hàng hoặc thùng carton chính phải có nhãn mác in tiếng Anh ghi đủ:</p>
<ul>
<li><strong>Tên sản phẩm:</strong> "Dried Fish", "Dried Squid", "Dried Shrimp"</li>
<li><strong>Thành phần chính:</strong> "100% Squid" hoặc "Fish + Salt"</li>
<li><strong>Nơi sản xuất:</strong> "Made in Vietnam" + địa chỉ xưởng</li>
<li><strong>Ngày sản xuất & Hạn sử dụng:</strong> "Manufactured: 05/2026 | Best Before: 05/2027"</li>
<li><strong>Trọng lượng ròng:</strong> "Net Weight: 500g"</li>
<li><strong>Hướng dẫn bảo quản:</strong> "Store in cool, dry place" (lưu trữ nơi mát, khô ráo)</li>
<li><strong>Số điện thoại liên hệ:</strong> Xưởng sản xuất hoặc Minh Thiện (0589.77.89.89)</li>
</ul>

<h3>📦 Bước 4: Đóng gói thùng carton chính</h3>
<ul>
<li>Dùng thùng carton **chắc chắn, không cũ nát**. Hàng khô nặng → thùng phải chịu áp lực.</li>
<li>Đặt các túi hút chân không vào thùng, xếp dây để tránh rơi vỡ.</li>
<li>Dán nhãn mác chính (bao gồm kích thước, trọng lượng, thành phần tóm tắt) ở trên thùng.</li>
<li>Nếu lô hàng lớn (nhiều thùng), dán nhãn **trên cùng + bên hông** của thùng để hải quan dễ nhìn.</li>
</ul>

<h3>📦 Bước 5: Khai báo hải quan chính xác</h3>
<ul>
<li>Loại hàng: "Seafood, Dried" hoặc "Dried Fish / Dried Squid"</li>
<li>Trọng lượng: Ghi rõ kg</li>
<li>Giá trị: Khai báo **giá trị thực** (không hạ thấp để né thuế — bị phạt gấp nhiều lần).</li>
<li>Xuất xứ: Vietnam</li>
<li>Mục đích: Personal use / Commercial sale (nếu bán lại ở Mỹ)</li>
</ul>

<h2>Những sai lầm phổ biến khiến hải sản khô bị giữ</h2>
<table>
<tr><th>Sai lầm</th><th>Hậu quả</th><th>Cách tránh</th></tr>
<tr><td>Hàng ẩm / mốc</td><td>Bị từ chối / tiêu hủy</td><td>Kiểm kỹ chất lượng trước gửi</td></tr>
<tr><td>Nhãn mác thiếu / tiếng Việt</td><td>Bị giữ kiểm tra, chậm thông quan</td><td>Nhãn mác đầy đủ, tiếng Anh rõ</td></tr>
<tr><td>Hạn sử dụng sắp hết</td><td>Bị từ chối</td><td>Hàng phải còn 6–12 tháng</td></tr>
<tr><td>Không hút chân không</td><td>Mùi thoát ra, hàng khác bị ảnh hưởng</td><td>Hút chân không tất cả</td></tr>
<tr><td>Khai báo giá thấp</td><td>Bị phạt gấp 2–10 lần giá trị</td><td>Khai báo giá trị thực tế</td></tr>
</table>

<h2>Minh Thiện hỗ trợ từ A đến Z</h2>
<p>Khi bạn gửi hải sản khô qua Minh Thiện, chúng tôi:</p>
<ul>
<li>📋 <strong>Kiểm hàng:</strong> đánh giá chất lượng, hạn sử dụng, mùi — chỉ nhận hàng đảm bảo tiêu chuẩn.</li>
<li>📦 <strong>Hỗ trợ đóng gói:</strong> nếu cần hút chân không, ghi nhãn mác → chúng tôi lo.</li>
<li>📝 <strong>Khai báo hải quan:</strong> làm đầy đủ, chính xác để tránh bị giữ.</li>
<li>✈️ <strong>Vận chuyển:</strong> gửi bay nhanh (3–5 ngày) hoặc chậm (8–12 ngày) tùy nhu cầu.</li>
<li>🎁 <strong>Giao tận tay:</strong> bạn theo dõi 24/7, nhân viên hỗ trợ tận tâm.</li>
<li>💯 <strong>Bảo hiểm:</strong> mất hàng đền 100% giá trị khai báo.</li>
</ul>

<h2>Thời gian & chi phí gửi hải sản khô đi Mỹ</h2>
<ul>
<li><strong>Thời gian:</strong> Bay nhanh 3–5 ngày, bay chậm 8–12 ngày.</li>
<li><strong>Cước:</strong> Thay đổi theo trọng lượng và loại hàng — hài sản khô không bị phụ thu riêng.</li>
<li><strong>Phí phụ:</strong> Khai báo hải quan, bảo hiểm (tuỳ chọn), đóng gói nếu phức tạp.</li>
</ul>

<h2>Liên hệ gửi hải sản khô đi Mỹ</h2>
<p>Muốn gửi cá khô, mực khô, tôm khô đi Mỹ một cách an toàn, nhanh chóng? <strong>Gọi Minh Thiện Logistics ngay — 0589.77.89.89 (Ms Min, Zalo/Viber).</strong></p>
<p>Chúng tôi sẽ:</p>
<ul>
<li>Tư vấn miễn phí về tiêu chuẩn hàng hóa.</li>
<li>Kiểm hàng trực tại kho bạn hoặc kho Minh Thiện.</li>
<li>Hỗ trợ đóng gói, hút chân không, ghi nhãn mác nếu cần.</li>
<li>Báo giá chính xác trong 5 phút.</li>
<li>Gửi hàng bay đi Mỹ trong 24 giờ.</li>
</ul>`,
};

const res = await fetch(`${SITE}/api/articles`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": KEY },
  body: JSON.stringify(article),
});
const data = await res.json().catch(() => ({}));
console.log(res.status, article.slug, "→", data.url || data.error || "");
