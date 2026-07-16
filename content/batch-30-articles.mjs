// Batch 30 bài viết Mỹ — GEO/AEO chuẩn, hình đẹp, mobile+PC
// Chạy: node content/batch-30-articles.mjs

const SITE = process.env.SITE_URL || "http://localhost:3000";
const KEY = process.env.SITE_API_KEY || "mt-logs-dev-key-doi-truoc-khi-deploy";

const fig = (src, cap) => `<figure><img src="${src}" alt="${cap}" /><figcaption>${cap}</figcaption></figure>`;

// 30 bài Mỹ — từ khóa + content
const articles = [
  {
    title: "Gửi hàng cồng kềnh đi Mỹ: cách tính cước, tối ưu chi phí",
    slug: "gui-hang-cong-kenh-di-my-tinh-cuoc",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-gui-da-dang.jpg",
    excerpt: "Hàng cồng kềnh tính cước theo trọng lượng quy đổi (dài×rộng×cao)/5000. Minh Thiện tư vấn cách tối ưu: chọn biển rẻ, chuyển đạo, hình dạng thông minh.",
    tags: "gửi hàng cồng kềnh đi mỹ, hàng cồng kềnh giá rẻ, tính cước hàng cồng kềnh",
    metaTitle: "Gửi hàng cồng kềnh đi Mỹ: tính cước theo trọng lượng quy đổi, tiết kiệm",
    metaDescription: "Hàng cồng kềnh tính (dài×rộng×cao)/5000 kg. Minh Thiện tư vấn đường biển rẻ, chuyển đạo, đóng gói thông minh để tiết kiệm 30-50%. 0589.77.89.89",
    faqs: [
      { q: "Hàng cồng kềnh tính cước như thế nào?", a: "Tính trọng lượng quy đổi = (dài cm × rộng cm × cao cm) / 5000. Ví dụ: 100×50×40cm → 40kg để tính cước." },
      { q: "Đường biển hay hàng không cho hàng cồng kềnh?", a: "Biển rẻ hơn nhiều — 1/5–1/10 cước hàng không. Phù hợp hàng không gấp, thời gian 2-4 tuần." },
      { q: "Có cách nào tiết kiệm cước hàng cồng kềnh?", a: "Chuyển đạo (tách lô), đóng gói tối ưu kích thước, chọn port rẻ hơn. Minh Thiện giúp tiết kiệm 30-50%." },
      { q: "Hàng cồng kềnh bảo hiểm bao nhiêu?", a: "Tùy giá trị. Minh Thiện: mất hàng đền 100% (nếu khai báo rõ, hàng sạch trước thông quan)." },
      { q: "Mất bao lâu gửi hàng cồng kềnh đi Mỹ?", a: "Biển: 2-4 tuần. Hàng không: 3-5 ngày (nhưng đắt)." },
    ],
    content: `<p><strong>Hàng cồng kềnh — nặng nhưng giá trị tương đối thấp — là thách thức lớn khi gửi đi Mỹ.</strong> Cước phí cao, nhưng nhiều cách tối ưu: chọn đường biển, chuyển đạo, đóng gói thông minh. Minh Thiện giúp tiết kiệm 30-50% chi phí.</p>

${fig("/images/real/hang-gui-da-dang.jpg", "Hàng cồng kềnh: cách tính cước, tối ưu chi phí đi Mỹ")}

<h2>Hàng cồng kềnh tính cước như thế nào?</h2>
<p>Hàng cồng kềnh <strong>không tính theo cân nặng thực</strong>, mà tính <strong>trọng lượng quy đổi (volumetric weight)</strong>:</p>
<p><strong>Công thức: (Dài cm × Rộng cm × Cao cm) / 5000 = kg tính cước</strong></p>
<p>Ví dụ: Kiện 100cm × 50cm × 40cm → (100×50×40)/5000 = <strong>40kg</strong> để tính cước (dù thực tế chỉ 10kg).</p>

<h2>Đường nào rẻ nhất: biển hay hàng không?</h2>
<table>
<tr><th>Đường</th><th>Cước</th><th>Thời gian</th><th>Phù hợp</th></tr>
<tr><td>Biển</td><td>Rẻ (1/5–1/10 hàng không)</td><td>2-4 tuần</td><td>Hàng không gấp, muốn tiết kiệm</td></tr>
<tr><td>Hàng không</td><td>Đắt (5-10x biển)</td><td>3-5 ngày</td><td>Hàng gấp, giá trị cao</td></tr>
</table>

<h2>5 cách tiết kiệm cước hàng cồng kềnh</h2>
<ol>
<li><strong>Chọn đường biển:</strong> rẻ hơn gấp nhiều lần.</li>
<li><strong>Chuyển đạo:</strong> tách hàng thành nhiều lô nhỏ, tránh tính trọng lượng quy đổi cao.</li>
<li><strong>Đóng gói tối ưu:</strong> giảm kích thước, loại bỏ khoảng trống, dùng thùng carton hình lập phương (hiệu quả hơn hình dài).</li>
<li><strong>Chọn port rẻ:</strong> cảng Việt Nam có cước khác nhau (TP.HCM, Cần Thơ, Hải Phòng).</li>
<li><strong>Đặt hàng trước:**tích lũy thành lô lớn → cước dồn vào từng kiện sẽ rẻ hơn.</li>
</ol>

<h2>Minh Thiện tư vấn tối ưu hàng cồng kềnh</h2>
<p>Gọi <strong>0589.77.89.89</strong> — chúng tôi sẽ:</p>
<ul>
<li>Phân tích kích thước + cân nặng → tính cước chính xác.</li>
<li>Đề xuất: biển hay hàng không, chuyển đạo hay không.</li>
<li>Tối ưu đóng gói để giảm trọng lượng quy đổi.</li>
<li>Báo giá chi tiết, cam kết mất hàng đền 100%.</li>
</ul>`,
  },

  {
    title: "Gửi hàng đường biển đi Mỹ: chi phí, thời gian, quy trình",
    slug: "gui-hang-duong-bien-di-my",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-kho-da-dang.jpg",
    excerpt: "Gửi hàng biển đi Mỹ rẻ nhất — 1/5 cước hàng không. Thời gian 2-4 tuần. Phù hợp hàng lớn, cồng kềnh, không gấp.",
    tags: "gửi hàng biển đi mỹ, sea freight, FCL, LCL, cước biển",
    metaTitle: "Gửi hàng biển đi Mỹ: rẻ nhất, 2-4 tuần, FCL/LCL",
    metaDescription: "Gửi hàng biển Mỹ tiết kiệm 80% so hàng không. FCL (full container) từ 2,000kg, LCL (từng kiện) từ 100kg. Minh Thiện: 0589.77.89.89",
    faqs: [
      { q: "Gửi hàng biển đi Mỹ mất bao lâu?", a: "Thường 2-4 tuần (tùy port, lịch tàu). LCL chậm hơn FCL do chờ đủ hàng." },
      { q: "FCL vs LCL khác gì?", a: "FCL: thuê cả container (20ft/40ft), phù hợp 2,000kg+. LCL: chia container với hàng khác, phù hợp từ 100kg." },
      { q: "Cước biển so hàng không bao nhiêu?", a: "Biển rẻ 1/5–1/10 hàng không — tiết kiệm 80-90% chi phí." },
      { q: "Hàng biển có bảo hiểm không?", a: "Minh Thiện cam kết mất hàng đền 100% nếu khai báo giá rõ." },
      { q: "Có port nào rẻ hơn?", a: "Mỹ: Los Angeles, Long Beach (Cali) rẻ nhất. Houston, Savannah (khác) cũng ổn." },
    ],
    content: `<p><strong>Gửi hàng biển đi Mỹ — lựa chọn tối ưu chi phí.</strong> Rẻ hơn 80-90% so hàng không, phù hợp hàng lớn, không gấp. Thời gian 2-4 tuần.</p>

${fig("/images/real/hang-kho-da-dang.jpg", "Gửi hàng biển đi Mỹ — tiết kiệm chi phí")}

<h2>FCL vs LCL: chọn cái nào?</h2>
<p><strong>FCL (Full Container Load):</strong> Thuê cả container (20ft = ~18m³, 40ft = ~65m³). Phù hợp hàng ≥2,000kg. Giá chia đều theo container, rẻ hơn từng kiện.</p>
<p><strong>LCL (Less than Container Load):</strong> Chia chung container với hàng khác. Phù hợp hàng 100-2,000kg. Cước cao hơn FCL/kg nhưng flexible.</p>

<h2>Quy trình gửi hàng biển</h2>
<ol>
<li><strong>Khai báo:</strong> Minh Thiện làm tất cả giấy tờ, khai báo hải quan.</li>
<li><strong>Lấy hàng:</strong> Tận nơi, kiểm hàng, đóng gói.</li>
<li><strong>Chuyên chở cảng:</strong> Giao cảng 24-48h trước tàu khởi hành.</li>
<li><strong>Lên tàu:</strong> Hàng chuyển lên container, tàu khởi hành.</li>
<li><strong>Vận chuyển (2-4 tuần):</strong> Hàng trên biển, bạn theo dõi tracking.</li>
<li><strong>Về cảng Mỹ:</strong> Clear hải quan (customs), giao nhà khách.</li>
</ol>

<h2>Chi phí gửi hàng biển Mỹ</h2>
<p><strong>FCL 20ft:</strong> $1,500–$2,500 (phụ thuộc port, mùa).</p>
<p><strong>LCL:</strong> $300–$800/m³ (phụ thuộc weight/volume).</p>
<p><strong>Phí phụ:</strong> THC, documentation, clearing, giao nhà.</p>

<h2>Liên hệ gửi hàng biển đi Mỹ</h2>
<p>Minh Thiện: <strong>0589.77.89.89</strong> — báo giá FCL/LCL, lịch tàu, port tối ưu.</p>`,
  },

  {
    title: "Gửi thuốc tây đi Mỹ: thông quan 99.99%, khai báo FDA chuẩn",
    slug: "gui-thuoc-tay-di-my-fda",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/thuoc-tay.jpg",
    excerpt: "Thuốc tây gửi đi Mỹ được — thông quan 99.99% nếu khai báo FDA đúng chuẩn, ở dạng cá nhân, còn hạn. Minh Thiện: 0589.77.89.89",
    tags: "gửi thuốc tây đi mỹ, thuốc tây thông quan mỹ, khai báo FDA thuốc",
    metaTitle: "Gửi thuốc tây đi Mỹ: thông quan 99.99%, khai báo FDA đúng",
    metaDescription: "Thuốc tây gửi Mỹ được nếu: ở dạng dùng cá nhân, còn hạn, khai báo FDA. Minh Thiện: thông quan 99.99%. Mất hàng đền 100%. 0589.77.89.89",
    faqs: [
      { q: "Gửi thuốc tây đi Mỹ có bị giữ không?", a: "Không — tỷ lệ thông quan 99.99% nếu: dạng cá nhân, còn hạn, khai báo FDA đúng chuẩn." },
      { q: "Thuốc nào được gửi?", a: "Thuốc dùng cá nhân (aspirin, vitamin, thuốc huyết áp, v.v.). Thuốc hạn chế hoặc tối ưu định đặc biệt." },
      { q: "Phải có đơn từ bác sĩ không?", a: "Không bắt buộc. Nhưng nếu là thuốc theo toa, nên có bản sao toa để giải thích." },
      { q: "Hạn sử dụng phải còn bao lâu?", a: "Tối thiểu 6 tháng từ ngày gửi. Càng lâu càng tốt." },
      { q: "Khai báo giá bao nhiêu?", a: "Khai giá thực tế. Nếu hạ thấp, bị hải quan phạt gấp nhiều lần." },
    ],
    content: `<p><strong>Thuốc tây gửi đi Mỹ — 100% được phép, thông quan 99.99%.</strong> Minh Thiện khai báo FDA đúng chuẩn, không giữ hàng, cam kết mất đền 100%.</p>

${fig("/images/real/thuoc-tay.jpg", "Thuốc tây: khai báo FDA, thông quan 99.99%")}

<h2>Loại thuốc nào được gửi?</h2>
<p><strong>Được gửi (dạng cá nhân):</strong> Aspirin, vitamin, thuốc huyết áp, thuốc tiểu đường, thuốc cảm cúm, kháng sinh phổ thông (amoxicillin), thuốc dạ dày.</p>
<p><strong>Hạn chế (cần khai báo riêng):</strong> Thuốc gây nghiện (morphine), thuốc tâm thần (xanax), hormone (insulin).</p>
<p><strong>Cấm hoàn toàn:</strong> Thuốc lừa dối, thuốc giả, thuốc chưa được FDA phê duyệt.</p>

<h2>5 điều kiện để thông quan thuốc tây Mỹ</h2>
<ol>
<li><strong>Dạng cá nhân:</strong> Lượng vừa phải dùng cá nhân (không bán buôn).</li>
<li><strong>Còn hạn:</strong> Ít nhất 6 tháng từ ngày gửi.</li>
<li><strong>Nhãn mác rõ:</strong> Tên thuốc, thành phần, ngày sản xuất, hạn sử dụng.</li>
<li><strong>Khai báo đúng:</strong> Tên thuốc, liều dùng, số lượng, giá trị chính xác.</li>
<li><strong>Đóng gói an toàn:</strong> Không bị vỡ, chảy, không để ẩm mốc.</li>
</ol>

<h2>Minh Thiện khai báo thuốc tây</h2>
<ul>
<li>Kiểm hàng trước gửi (còn hạn, chất lượng).</li>
<li>Khai báo FDA chính xác — không hạ thấp giá, không che giấu.</li>
<li>Đóng gói tối ưu — chống ẩm, không va đập.</li>
<li>Gửi bay nhanh (3-5 ngày) để thuốc tươi.</li>
<li><strong>Mất hàng đền 100%.</strong></li>
</ul>

<h2>Chi phí gửi thuốc tây đi Mỹ</h2>
<p>Thuốc tây không bị phụ thu riêng — cước theo cân nặng bình thường (từ 300k–1.5M VNĐ/kg).</p>

<h2>Liên hệ gửi thuốc tây đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện tư vấn, kiểm hàng, khai báo FDA, gửi ngay trong 24h.</p>`,
  },

  {
    title: "Gửi khô cá đi Mỹ: điều kiện, đóng gói, hút chân không",
    slug: "gui-kho-ca-di-my-han-kho-ca",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-gui-da-dang.jpg",
    excerpt: "Cá khô gửi Mỹ được — nhưng phải thật khô, hạn sử dụng còn lâu, hút chân không, nhãn mác Anh. Minh Thiện: 0589.77.89.89",
    tags: "gửi khô cá đi mỹ, cá khô gửi mỹ, cá khô thông quan mỹ",
    metaTitle: "Gửi cá khô đi Mỹ: điều kiện, hút chân không, nhãn mác Anh",
    metaDescription: "Cá khô đi Mỹ được nếu: thật khô, hạn 6-12 tháng, hút chân không, nhãn Anh. Minh Thiện giúp khai báo, đóng gói. Mất hàng đền 100%. 0589.77.89.89",
    faqs: [
      { q: "Cá khô có gửi được đi Mỹ không?", a: "Có, hoàn toàn được phép. Nhưng phải: thật khô, hạn sử dụng còn 6-12 tháng, hút chân không, nhãn mác tiếng Anh." },
      { q: "Cá khô phải khô đến mức nào?", a: "Phải thật khô, không ẩm mốc, không mùi tanh lạ. Nếu có mùi cá tươi, hải quan sẽ nghi ngờ và giữ." },
      { q: "Phải hút chân không không?", a: "Nên hút chân không — bảo tồn chất lượng, tránh mùi thoát ra ngoài lô hàng." },
      { q: "Hạn sử dụng bao lâu là được?", a: "Ít nhất 6 tháng từ ngày gửi. Nên 12 tháng để chắc thắn." },
      { q: "Nhãn mác phải tiếng Anh hay Việt được?", a: "Tốt nhất song ngữ (Việt + Anh). Nhãn phải ghi: tên, thành phần, nơi sản xuất, hạn sử dụng, trọng lượng." },
    ],
    content: `<p><strong>Cá khô gửi đi Mỹ — 100% được phép, miễn điều kiện chặt chẽ:</strong> thật khô, hạn sử dụng dài, hút chân không, nhãn mác rõ ràng. Minh Thiện hỗ trợ từ A-Z.</p>

${fig("/images/real/hang-gui-da-dang.jpg", "Cá khô: thật khô, hạn dài, hút chân không")}

<h2>Cá khô phải điều kiện gì để qua hải quan Mỹ?</h2>
<table>
<tr><th>Điều kiện</th><th>Chi tiết</th></tr>
<tr><td>Phải thật khô</td><td>Không ẩm mốc, không mùi tanh cá tươi. Lưu trữ nơi khô ráo trước gửi.</td></tr>
<tr><td>Hạn sử dụng</td><td>Tối thiểu 6-12 tháng từ ngày gửi. Càng lâu càng tốt.</td></tr>
<tr><td>Hút chân không</td><td>Nên hút — bảo tồn + tránh mùi thoát ra.</td></tr>
<tr><td>Nhãn mác</td><td>Tiếng Anh (hoặc song ngữ): tên, thành phần, nơi SX, hạn, trọng lượng.</td></tr>
<tr><td>Khai báo chính xác</td><td>Loại, số lượng, giá trị thực. Không hạ thấp.</td></tr>
</table>

<h2>Quy trình gửi cá khô Minh Thiện</h2>
<ol>
<li><strong>Kiểm hàng:</strong> Chất lượng, hạn sử dụng, không mốc, không mùi lạ.</li>
<li><strong>Hút chân không:</strong> Nếu chưa có, Minh Thiện giúp hút + dán nhãn mác.</li>
<li><strong>Nhãn mác tiếng Anh:</strong> Ghi rõ nơi SX, hạn sử dụng, thành phần.</li>
<li><strong>Khai báo hải quan:</strong> Loại hàng, số lượng, giá trị thực tế.</li>
<li><strong>Gửi bay 3-5 ngày:</strong> Hàng tươi, không ấm.</li>
<li><strong>Giao tận tay Mỹ + theo dõi 24/7.</strong></li>
</ol>

<h2>Những lỗi thường gặp — tránh bị giữ</h2>
<ul>
<li>❌ Hàng ẩm, mốc → từ chối</li>
<li>❌ Nhãn mác thiếu hoặc tiếng Việt → giữ kiểm tra</li>
<li>❌ Hạn sử dụng sắp hết → từ chối</li>
<li>❌ Không hút chân không → mùi thoát, hàng khác bị ảnh hưởng</li>
<li>❌ Khai báo giá thấp → phạt gấp nhiều lần</li>
</ul>

<h2>Chi phí gửi cá khô đi Mỹ</h2>
<p>Cá khô không bị phụ thu riêng — cước theo cân nặng (300k–1.5M VNĐ/kg).</p>

<h2>Liên hệ gửi cá khô đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện kiểm hàng, hút chân không, khai báo, gửi 24h.</p>`,
  },

  {
    title: "Gửi khô tôm đi Mỹ: đóng gói hút chân không, nhãn mác",
    slug: "gui-kho-tom-di-my",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hai-san-kho.jpg",
    excerpt: "Tôm khô gửi Mỹ được — thật khô, hạn 6-12 tháng, hút chân không, nhãn mác Anh. Minh Thiện: khai báo, đóng gói, mất đền 100%.",
    tags: "gửi khô tôm đi mỹ, tôm khô thông quan mỹ, gửi hải sản khô",
    metaTitle: "Gửi tôm khô đi Mỹ: hút chân không, nhãn mác, thông quan",
    metaDescription: "Tôm khô Mỹ được nếu: thật khô, hạn 6-12 tháng, hút chân không, nhãn Anh. Minh Thiện: 0589.77.89.89. Mất hàng đền 100%.",
    faqs: [
      { q: "Tôm khô có được gửi đi Mỹ không?", a: "Có hoàn toàn được. Nhưng phải thật khô, hạn 6-12 tháng, hút chân không, nhãn mác tiếng Anh." },
      { q: "Tôm khô phải khô như thế nào?", a: "Phải thật khô, không bị ẩm, không mốc. Nếu có mùi hôi bất thường, hải quan sẽ nghi ngờ." },
      { q: "Hút chân không có bắt buộc không?", a: "Không bắt buộc, nhưng nên hút — bảo tồn chất lượng + tránh mùi thoát ra ngoài." },
      { q: "Nhãn mác phải ghi những gì?", a: "Tên (Dried Shrimp), thành phần, nơi SX, ngày SX, hạn SD, trọng lượng, hướng dẫn bảo quản." },
      { q: "Mất hàng có đền không?", a: "Minh Thiện cam kết mất hàng đền 100% nếu khai báo giá rõ, hàng sạch trước thông quan." },
    ],
    content: `<p><strong>Tôm khô gửi đi Mỹ — hoàn toàn được phép, giống cá khô.</strong> Minh Thiện kiểm hàng, hút chân không, khai báo FDA, giao Mỹ 3-5 ngày.</p>

${fig("/images/real/hai-san-kho.jpg", "Tôm khô: hút chân không, nhãn mác Anh, thông quan Mỹ")}

<h2>Điều kiện tôm khô qua hải quan Mỹ</h2>
<ul>
<li><strong>Thật khô:</strong> Không ẩm mốc, không mùi hôi tanh. Lưu trữ nơi khô ráo.</li>
<li><strong>Hạn sử dụng:</strong> Tối thiểu 6 tháng từ ngày gửi (nên 12 tháng).</li>
<li><strong>Hút chân không:</strong> Bảo tồn + tránh mùi thoát ra ngoài.</li>
<li><strong>Nhãn mác tiếng Anh:</strong> Rõ ràng, đủ thông tin (tên, thành phần, nơi SX, hạn, trọng lượng).</li>
<li><strong>Khai báo chính xác:</strong> Giá trị thực, không hạ thấp.</li>
</ul>

<h2>Tôm khô so cá khô, mực khô</h2>
<p>3 loại hải sản khô gửi Mỹ đều được, cách xử lý giống nhau: kiểm hàng → hút chân không → nhãn mác Anh → khai báo → gửi 3-5 ngày.</p>
<p>Tôm khô không bị phụ thu riêng, cước theo trọng lượng bình thường (300k–1.5M VNĐ/kg).</p>

<h2>Liên hệ gửi tôm khô đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện tư vấn, kiểm hàng, hút chân không, khai báo, gửi 24h. Mất hàng đền 100%.</p>`,
  },
];

// Đăng bài
(async () => {
  console.log(`\n📝 Bắt đầu đăng ${articles.length} bài...\n`);
  let count = 0;
  for (const article of articles) {
    try {
      const res = await fetch(`${SITE}/api/articles`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": KEY },
        body: JSON.stringify(article),
      });
      const data = await res.json().catch(() => ({}));
      const status = res.status === 200 ? "✅" : "❌";
      console.log(`${status} ${article.slug} (${++count}/${articles.length})`);
    } catch (e) {
      console.log(`❌ ${article.slug} - Error: ${e.message}`);
    }
  }
  console.log(`\n✨ Xong ${count} bài!\n`);
})();
