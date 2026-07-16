// Batch 25 bài còn lại — GEO/AEO chuẩn
const SITE = process.env.SITE_URL || "http://localhost:3000";
const KEY = process.env.SITE_API_KEY || "mt-logs-dev-key-doi-truoc-khi-deploy";
const fig = (src, cap) => `<figure><img src="${src}" alt="${cap}" /><figcaption>${cap}</figcaption></figure>`;

const articles = [
  {
    title: "Gửi hàng đông lạnh đi Mỹ: bảo quản, đóng gói, thời gian",
    slug: "gui-hang-dong-lanh-di-my-bao-quan",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-gui-da-dang.jpg",
    excerpt: "Hàng đông lạnh đi Mỹ được — phải giữ lạnh toàn trình (thùng giữ lạnh, gel lạnh). 3-5 ngày, không được chậm. Minh Thiện: 0589.77.89.89",
    tags: "gửi hàng đông lạnh đi mỹ, thịt đông lạnh, cá đông lạnh, bảo quản đông lạnh",
    metaTitle: "Gửi hàng đông lạnh đi Mỹ: thùng giữ lạnh, 3-5 ngày",
    metaDescription: "Đông lạnh Mỹ được nếu: thùng giữ lạnh, gel lạnh, bay 3-5 ngày không chậm. Minh Thiện: không hỏng hàng, mất đền 100%. 0589.77.89.89",
    faqs: [
      { q: "Hàng đông lạnh có gửi được đi Mỹ không?", a: "Được, nhưng khó hơn hàng khô. Phải: thùng giữ lạnh, gel lạnh, bay 3-5 ngày (không được chậm)." },
      { q: "Phải bay nhanh không?", a: "Phải. Biển chậm 2-4 tuần → hàng sẽ tan. Chỉ có cách bay 3-5 ngày." },
      { q: "Thùng giữ lạnh phải kích thước bao nhiêu?", a: "Tùy lượng hàng. Minh Thiện tư vấn: thùng carton kép + xốp dày 5-10cm + gel lạnh đủ." },
      { q: "Mất hàng do tan lạnh có đền không?", a: "Minh Thiện đền 100% nếu khai báo giá rõ, hàng sạch trước khi gửi. Nhưng phải bay nhanh." },
      { q: "Chi phí so hàng thường bao nhiêu?", a: "Hàng đông lạnh đắt hơn 20-30% vì phải bay nhanh + đóng gói đặc biệt." },
    ],
    content: `<p><strong>Hàng đông lạnh đi Mỹ — phức tạp nhất trong các dịch vụ gửi.</strong> Phải giữ lạnh toàn trình, bay 3-5 ngày không được chậm. Minh Thiện có kinh nghiệm, không hỏng hàng.</p>

${fig("/images/real/hang-gui-da-dang.jpg", "Đông lạnh: thùng giữ lạnh, gel lạnh, bay 3-5 ngày")}

<h2>Vì sao đông lạnh khó gửi đi Mỹ?</h2>
<ul>
<li><strong>Thời gian:</strong> Biển 2-4 tuần → hàng sẽ tan, biến chất. Chỉ bay nhanh (3-5 ngày) là an toàn.</li>
<li><strong>Đóng gói:</strong> Thùng giữ lạnh + gel lạnh đủ để hàng không tan trong 5 ngày.</li>
<li><strong>Chi phí:</strong> Bay nhanh đắt 5-10x biển.</li>
<li><strong>Rủi ro:</strong> Nếu hàng tan → không thể bán, khách mất tiền.</li>
</ul>

<h2>Đóng gói đông lạnh chuẩn Mỹ</h2>
<table>
<tr><th>Bước</th><th>Chi tiết</th></tr>
<tr><td>Thùng trong</td><td>Carton chắc, kích thước vừa hàng.</td></tr>
<tr><td>Lót xốp</td><td>Xốp dày 5-10cm ở đáy + xung quanh hàng.</td></tr>
<tr><td>Gel lạnh</td><td>Đủ lượng gel để hàng không tan trong 5 ngày (ước: 0.5-1kg gel/5kg hàng).</td></tr>
<tr><td>Plastic niêm kín</td><td>Bọc hàng plastik dày để hàng không bị nước lạnh dễ chảy ra ngoài.</td></tr>
<tr><td>Thùng ngoài</td><td>Carton kép chắc chắn, dán mạnh, ghi rõ "FROZEN" + "Lạnh" (label cảnh báo).</td></tr>
</table>

<h2>Quy trình gửi đông lạnh Minh Thiện</h2>
<ol>
<li><strong>Lấy hàng tươi:</strong> Tận nơi khách 2-4 giờ trước gửi (hàng phải tươi, không ấm).</li>
<li><strong>Đóng gói ngay:</strong> Thùng giữ lạnh, gel lạnh, niêm kín.</li>
<li><strong>Chuyến bay chứng thực:</strong> Gửi lên chuyến bay trong 8 giờ (không để ấm).</li>
<li><strong>Bay 3-5 ngày:</strong> Hàng bay trực tiếp, không dừng lâu ở cảng trung gian.</li>
<li><strong>Giao Mỹ tươi:</strong> Khách nhận hàng still frozen hoặc hạn 24-48h để ăn.</li>
</ol>

<h2>Loại đông lạnh có thể gửi</h2>
<ul>
<li><strong>Thịt tươi:</strong> Bò, gà, heo, vịt (một số loại phải khai báo USDA).</li>
<li><strong>Cá tươi:</strong> Cá hồi, cá tuyết, cá chép (phải còn sốt).</li>
<li><strong>Tôm, cua:</strong> Tươi hoặc ngâm nước muối lạnh.</li>
<li><strong>Trứng, sữa:</strong> Không được (hàng cấm cho không phải nước APEC).</li>
</ul>

<h2>Chi phí gửi đông lạnh đi Mỹ</h2>
<p><strong>Cước:</strong> Bay nhanh rẻ nhất 1.5M–3M VNĐ/kg (đắt hơn thường 30-50%).</p>
<p><strong>Phí đóng gói đặc biệt:</strong> Thùng giữ lạnh + gel lạnh: 200k–500k tùy lượng.</p>

<h2>Liên hệ gửi đông lạnh đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện: lấy hàng tươi, đóng gói chuẩn, bay 3-5 ngày, giao tươi Mỹ. Mất hàng đền 100%.</p>`,
  },

  {
    title: "Gửi khô cá từ Cần Thơ đi Mỹ: cách tiết kiệm, cảng gần",
    slug: "gui-kho-ca-can-tho-di-my-gia-re",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-kho-da-dang.jpg",
    excerpt: "Gửi khô cá từ Cần Thơ đi Mỹ rẻ hơn HCM — gần cảng, cước biển rẻ, lấy hàng tận vườn. Minh Thiện Cần Thơ: 0589.77.89.89",
    tags: "gửi khô cá cần thơ đi mỹ, khô cá tiền giang đông tháp, gửi khô cá rẻ",
    metaTitle: "Gửi cá khô từ Cần Thơ Tiền Giang Đồng Tháp đi Mỹ rẻ",
    metaDescription: "Cá khô Cần Thơ gửi Mỹ rẻ hơn 20-30% — gần cảng. Minh Thiện lấy tận vườn, khai báo, biển/hàng không. 0589.77.89.89",
    faqs: [
      { q: "Gửi cá khô từ Cần Thơ rẻ hơn HCM bao nhiêu?", a: "Rẻ 20-30% — gần cảng Cần Thơ, cước biển rẻ, vận chuyển nội địa rẻ." },
      { q: "Lấy hàng ở Cần Thơ có phí không?", a: "Minh Thiện lấy tận nơi tự do — không phí lấy hàng, chỉ tính cước vận chuyển + gửi." },
      { q: "Cách nào rẻ nhất: biển hay hàng không?", a: "Biển rẻ gấp 5-10x hàng không. Nên chọn biển nếu hàng không gấp." },
      { q: "Cảng Cần Thơ hay HCM để gửi cá khô?", a: "Cảng Cần Thơ rẻ hơn + gần. Nhưng cảng HCM tàu nhiều hơn, lịch tàu linh hoạt." },
      { q: "Chất lượng cá khô có khác Cần Thơ vs HCM không?", a: "Không khác — chất lượng phụ thuộc hàng, không phụ thuộc nơi gửi." },
    ],
    content: `<p><strong>Gửi cá khô từ Cần Thơ, Tiền Giang, Đồng Tháp đi Mỹ — tiết kiệm 20-30% so gửi từ HCM.</strong> Gần cảng, cước rẻ, Minh Thiện lấy tận vườn, không phí riêng.</p>

${fig("/images/real/hang-kho-da-dang.jpg", "Cá khô Cần Thơ: gần cảng, cước rẻ, chất lượng tươi")}

<h2>Tại sao gửi từ Cần Thơ rẻ hơn?</h2>
<ul>
<li><strong>Cảng gần:</strong> Cảng Cần Thơ cách Cần Thơ 10-20km, cộ vận chuyển rẻ.</li>
<li><strong>Cước cảng:</strong> Cảng Cần Thơ rẻ hơn cảng HCM (quốc tế) khoảng 20-30%.</li>
<li><strong>Lấy hàng tận vườn:</strong> Minh Thiện đi tận nơi khách — không cần chuyên chở HCM.</li>
<li><strong>Chất lượng tươi:</strong> Hàng mới, còn tươi — không qua trung gian HCM mất mát.</li>
</ul>

<h2>Các tỉnh phù hợp gửi từ Cần Thơ</h2>
<ul>
<li><strong>Cần Thơ:</strong> Cá khô, mực khô, tôm khô.</li>
<li><strong>Tiền Giang:</strong> Cá khô, hải sản khô (khoảng cách HCM 40-50km).</li>
<li><strong>Đồng Tháp:</strong> Hàng nông sản khô (khoảng cách HCM 80-100km, nhưng vẫn rẻ).</li>
<li><strong>Bến Tre, Trà Vinh:</strong> Cảng nhỏ, gửi về HCM rồi gửi đi Mỹ.</li>
</ul>

<h2>Qui trình gửi từ Cần Thơ đi Mỹ</h2>
<ol>
<li><strong>Bạn liên hệ Minh Thiện:</strong> 0589.77.89.89 (Ms Min, Zalo).</li>
<li><strong>Minh Thiện lấy tận nơi:</strong> Không phí, kiểm hàng, đóng gói.</li>
<li><strong>Chuyên chở Cần Thơ → cảng:</strong> Rẻ hơn HCM.</li>
<li><strong>Gửi biển hoặc bay:</strong> Biển rẻ (2-4 tuần), bay nhanh (3-5 ngày).</li>
<li><strong>Giao Mỹ + tracking 24/7.</strong></li>
</ol>

<h2>So sánh giá: Cần Thơ vs HCM</h2>
<table>
<tr><th>Chi phí</th><th>HCM</th><th>Cần Thơ</th><th>Tiết kiệm</th></tr>
<tr><td>Cước LCL biển</td><td>400/m³</td><td>280/m³</td><td>30% ⬇️</td></tr>
<tr><td>Lấy hàng</td><td>200k+</td><td>Tự do</td><td>200k+ ⬇️</td></tr>
<tr><td>Chuyên chở</td><td>300k+</td><td>100k+</td><td>60% ⬇️</td></tr>
</table>

<h2>Liên hệ gửi cá khô từ Cần Thơ đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện lấy tận vườn Cần Thơ, Tiền Giang, Đồng Tháp. Báo giá rẻ nhất, gửi ngay.</p>`,
  },

  {
    title: "Gửi bàn thờ đi Mỹ: kích thước lớn, đóng gói an toàn",
    slug: "gui-ban-tho-di-my-dong-goi",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-kho-da-dang.jpg",
    excerpt: "Bàn thờ gửi Mỹ được — hàng hộp nhập khẩu tự do. Nhưng cồng kềnh, dễ vỡ, phải đóng gói chuẩn. Minh Thiện: 0589.77.89.89",
    tags: "gửi bàn thờ đi mỹ, bàn thờ gụ đỏ, tượng thờ, gửi đồ thờ cúng",
    metaTitle: "Gửi bàn thờ đi Mỹ: an toàn, đóng gói kỹ, không vỡ",
    metaDescription: "Bàn thờ Mỹ được — hộp nhập khẩu tự do. Đóng gói chuẩn quốc tế: carton 5 lớp, xốp dày, gỗ chắc. Minh Thiện: mất đền 100%. 0589.77.89.89",
    faqs: [
      { q: "Gửi bàn thờ đi Mỹ được không?", a: "Được hoàn toàn — hộp nhập khẩu tự do ở Mỹ. Không bị cấm tôn giáo hay hàng cấm." },
      { q: "Bàn thờ cồng kềnh, phí bao nhiêu?", a: "Phí theo trọng lượng quy đổi = (dài×rộng×cao)/5000 cm. Ví dụ: bàn 120×60×80cm → 115kg tính cước." },
      { q: "Dễ vỡ phải làm sao?", a: "Đóng gói chuẩn: carton 5 lớp, xốp dày 10cm, gỗ chắc bên trong, không để va đập." },
      { q: "Mất hàng do vỡ có đền không?", a: "Minh Thiện cam kết mất hàng đền 100% nếu khai báo giá rõ + đóng gói chuẩn." },
      { q: "Thời gian gửi bàn thờ bao lâu?", a: "Biển: 2-4 tuần (rẻ, safe cho hàng cồng kềnh). Bay: 3-5 ngày (đắt)." },
    ],
    content: `<p><strong>Bàn thờ gửi đi Mỹ — 100% được phép, không bị cấm tôn giáo.</strong> Nhưng cồng kềnh, dễ vỡ, phải đóng gói chuẩn quốc tế. Minh Thiện chuyên xử lý.</p>

${fig("/images/real/hang-kho-da-dang.jpg", "Bàn thờ: đóng gói 5 lớp, xốp dày, carton chắc")}

<h2>Bàn thờ có cấm ở Mỹ không?</h2>
<p><strong>Không.</strong> Bàn thờ, tượng thờ, đồ thờ cúng là hộp nhập khẩu tự do ở Mỹ — không bị hạn chế tôn giáo. Hải quan Mỹ tôn trọng tự do tôn giáo.</p>

<h2>Những loại bàn thờ gửi được</h2>
<ul>
<li><strong>Bàn thờ gỗ:</strong> Gụ đỏ, hương, teak (phổ biến). Phải là gỗ thật, không fake.</li>
<li><strong>Tượng thờ:</strong> Phật, Quan Âm, Thánh Gióng, Ông Địa (bằng sứ, đá, gỗ).</li>
<li><strong>Đồ thờ phụ:</strong> Nến, nhang, chuông, trống, kệ sách thờ.</li>
<li><strong>Không được:</strong> Tượng con người thực (tranh, bức tượng những người sống).</li>
</ul>

<h2>Cách đóng gói bàn thờ chuẩn</h2>
<table>
<tr><th>Lớp</th><th>Chi tiết</th></tr>
<tr><td>Lớp 1</td><td>Bọc bàn bằng blanket hoặc vải dày — tránh va đập, khó xước.</td></tr>
<tr><td>Lớp 2</td><td>Xốp dày 10cm quanh bàn — hấp thụ sốc, xốp kín ở mọi góc.</td></tr>
<tr><td>Lớp 3</td><td>Plastic niêm kín — tránh bụi, ẩm mốc.</td></tr>
<tr><td>Lớp 4</td><td>Carton 5 lớp chắc chắn — dán mạnh, ghi rõ hướng "THIS SIDE UP".</td></tr>
<tr><td>Lớp 5</td><td>Ngoài cùng: dán cảnh báo "FRAGILE" + giãn cách, không để hàng nặng trên trên.</td></tr>
</table>

<h2>Kích thước & cước bàn thờ</h2>
<p><strong>Bàn thờ nhỏ:</strong> 60×40×80cm → ~30kg tính cước.</p>
<p><strong>Bàn thờ trung:</strong> 100×50×100cm → ~60kg tính cước.</p>
<p><strong>Bàn thờ lớn:</strong> 150×60×120cm → ~120kg tính cước.</p>
<p><strong>Cước:</strong> Biển từ 1M–3M VNĐ (tùy kích thước, cảng). Bay từ 2M–5M VNĐ.</p>

<h2>Quy trình gửi bàn thờ Minh Thiện</h2>
<ol>
<li><strong>Kiểm hàng:</strong> Chất lượng gỗ, không bị nứt, không mốc, không mục.</li>
<li><strong>Đóng gói 5 lớp:</strong> Chuẩn quốc tế, xốp dày 10cm, carton 5 lớp.</li>
<li><strong>Khai báo hải quan:</strong> Loại gỗ, nơi SX, giá trị (không hạ thấp).</li>
<li><strong>Chọn biển (rẻ, safe):**2-4 tuần đến Mỹ.</li>
<li><strong>Giao tận tay + tracking 24/7.</strong></li>
</ol>

<h2>Liên hệ gửi bàn thờ đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện chuyên gửi bàn thờ, tượng thờ, đồ phong thủy. Đóng gói chuẩn, không vỡ. Mất hàng đền 100%.</p>`,
  },

  {
    title: "Gửi hàng đi Mỹ từ Hồ Chí Minh: nhanh, rẻ, lấy tận nơi",
    slug: "gui-hang-di-my-tu-ho-chi-minh-tphcm",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-gui-da-dang.jpg",
    excerpt: "Gửi từ TP.HCM — cảng quốc tế lớn, cước rẻ, tàu bay nhiều, lịch linh hoạt. Minh Thiện lấy tận nơi HCM, Bình Dương, Đồng Nai.",
    tags: "gửi hàng đi mỹ tp hcm, gửi từ hồ chí minh, cảng saigon port",
    metaTitle: "Gửi hàng đi Mỹ từ TP.HCM: cảng lớn, cước rẻ, lịch tàu nhiều",
    metaDescription: "Gửi HCM đi Mỹ — cảng quốc tế Tân Cảng (Saigon Port), tàu nhiều, cước rẻ. Minh Thiện lấy tận nơi, 24h sẵn sàng. 0589.77.89.89",
    faqs: [
      { q: "Gửi từ TP.HCM có lợi ích gì?", a: "Cảng quốc tế Tân Cảng lớn nhất VN — tàu nhiều, lịch linh hoạt, cước rẻ, infrastructure tốt." },
      { q: "Cảng HCM vs cảng khác (cần thơ, hải phòng)?", a: "HCM: cảng lớn, cước trung bình, tàu nhiều. Cần Thơ: rẻ hơn 20-30%, tàu ít. Hải Phòng: tàu nhiều, cực Bắc." },
      { q: "Lấy hàng ở Bình Dương, Đồng Nai phí bao nhiêu?", a: "Minh Thiện lấy tận nơi — chuyên chở Bình Dương, Đồng Nai, Long An miễn phí hoặc phí nhẹ." },
      { q: "Thời gian chuyên chở HCM đến cảng bao lâu?", a: "HCM nội: 2-4 giờ. Bình Dương: 4-6 giờ. Đồng Nai: 6-8 giờ. Tất cả sẵn sàng gửi ngày hôm sau." },
      { q: "Cước gửi HCM vs cảng khác bao nhiêu?", a: "HCM: trung bình 300-1.5M VNĐ/kg. Cần Thơ: -30% so HCM. Hải Phòng: +10% so HCM." },
    ],
    content: `<p><strong>Gửi hàng từ TP.HCM đi Mỹ — lợi thế lớn về cảng, cước, lịch tàu bay.</strong> Cảng Tân Cảng (Saigon Port) lớn nhất VN, tàu bay Mỹ liên tục. Minh Thiện lấy tận nơi HCM, Bình Dương, Đồng Nai.</p>

${fig("/images/real/hang-gui-da-dang.jpg", "Cảng Tân Cảng HCM: lớn, cước rẻ, lịch tàu linh hoạt")}

<h2>Tại sao nên gửi từ TP.HCM?</h2>
<ul>
<li><strong>Cảng lớn nhất VN:</strong> Tân Cảng (Saigon Port) — 4 bến chuyên dụng container, infrastructure hiện đại.</li>
<li><strong>Tàu Mỹ liên tục:</strong> Cải thiện 30-40 chuyến/tháng đến LA, Long Beach, Houston.</li>
<li><strong>Cước rẻ:</strong> Cạnh tranh cao giữa các shipping line → giá tốt.</li>
<li><strong>Lịch linh hoạt:</strong> Nhiều lựa chọn thời gian (FCL hàng ngày, LCL 2-3 lần/tuần).</li>
<li><strong>Thủ tục nhanh:</strong> Customs HCM hiệu quả, thường xuyên check hàng → ít bất ngờ.</li>
</ul>

<h2>Cách lấy hàng ở Bình Dương, Đồng Nai, Long An</h2>
<p>Minh Thiện có team chuyên chở:</p>
<ul>
<li><strong>Bình Dương:</strong> Lấy tất cả huyện (Thủ Dầu Một, Thuận An, Dĩ An, Bến Cát) — 200-300k/lượt.</li>
<li><strong>Đồng Nai:</strong> Biên Hòa, Trị An, Long Khánh — 300-400k/lượt (nhưng miễn phí nếu hàng từ 100kg+).</li>
<li><strong>Long An:</strong> Tân An, Mỹ Tho kế cận — 150-250k/lượt.</li>
</ul>

<h2>Quy trình gửi từ HCM</h2>
<ol>
<li><strong>Bạn liên hệ Minh Thiện:</strong> 0589.77.89.89 (Ms Min, Zalo/Viber).</li>
<li><strong>Minh Thiện lấy hàng:</strong> Tận nơi HCM hoặc chuyên chở từ Bình Dương/Đồng Nai.</li>
<li><strong>Kiểm hàng + đóng gói:</strong> Tại kho Minh Thiện, Tân Sơn Nhất, TP.HCM.</li>
<li><strong>Khai báo hải quan + lên cảng:</strong> 24-48h sau khi nhận hàng.</li>
<li><strong>Chuyên chở cảng Tân Cảng:</strong> Giao trong vòng 24 giờ trước tàu khởi hành.</li>
<li><strong>Tàu bay Mỹ 3-5 ngày (nhanh) hoặc 2-4 tuần (biển).</strong></li>
</ol>

<h2>Cảng HCM so cảng khác</h2>
<table>
<tr><th>Cảng</th><th>Khoảng cách HCM</th><th>Cước/m³</th><th>Tàu/tuần</th></tr>
<tr><td>HCM (Tân Cảng)</td><td>0km</td><td>400</td><td>30-40</td></tr>
<tr><td>Cần Thơ</td><td>170km</td><td>280 (-30%)</td><td>8-10</td></tr>
<tr><td>Hải Phòng</td><td>1,800km</td><td>440 (+10%)</td><td>25-30</td></tr>
</table>

<h2>Liên hệ gửi hàng từ HCM đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện: lấy tận nơi HCM, Bình Dương, Đồng Nai, Long An. Báo giá chính xác, gửi 24h. Mất hàng đền 100%.</p>`,
  },

  {
    title: "Gửi hàng gụ đỏ, hương đi Mỹ: gỗ quý, thủ tục export",
    slug: "gui-go-gu-do-huong-di-my-thutuc-export",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/real/hang-gui-da-dang.jpg",
    excerpt: "Gụ đỏ, hương gửi Mỹ cần giấy phép export gỗ quý VN. Minh Thiện lo toàn bộ thủ tục, không bị tạm giữ. 0589.77.89.89",
    tags: "gửi gụ đỏ đi mỹ, gửi gỗ hương đi mỹ, gỗ quý CITES, giấy phép export gỗ",
    metaTitle: "Gửi gụ đỏ hương đi Mỹ: giấy phép export, CITES, thủ tục",
    metaDescription: "Gụ đỏ, hương gửi Mỹ cần: giấy phép export gỗ quý (Ministry of Agriculture), CITES (bảo vệ động thực vật). Minh Thiện: 0589.77.89.89",
    faqs: [
      { q: "Gười đỏ, hương có được gửi đi Mỹ không?", a: "Được — nhưng cần giấy phép export gỗ quý từ Sở NN&PTNT VN, và tuân thủ CITES (bảo vệ động thực vật hoang dã)." },
      { q: "CITES là gì?", a: "CITES = Convention on International Trade in Endangered Species — hiệp ước bảo vệ động thực vật quý hiếm. Gụ đỏ, hương nằm trong danh sách CITES II (bị hạn chế)." },
      { q: "Phải có giấy gì để export?", a: "Giấy phép export gỗ quý từ Sở NN&PTNT, chứng chỉ CITES từ Cục Bảo vệ KVSDĐ (nếu cần), hóa đơn, COO." },
      { q: "Mất bao lâu để xin giấy phép?", a: "5-10 ngày làm việc (Minh Thiện lo toàn bộ). Nhanh hơn nếu hàng nhỏ, vật liệu rõ ràng." },
      { q: "Nếu không có giấy phép sẽ sao?", a: "Hàng sẽ bị hải quan giữ lại, không thể thông quan. Có thể bị phạt, tịch thu hàng. Luôn cần giấy phép đầy đủ." },
    ],
    content: `<p><strong>Gỗ gụ đỏ, gỗ hương gửi đi Mỹ — được phép, nhưng cần giấy phép export gỗ quý VN + tuân thủ CITES.</strong> Minh Thiện lo toàn bộ thủ tục, không bị tạm giữ hàng.</p>

${fig("/images/real/hang-gui-da-dang.jpg", "Gụ đỏ, hương: giấy phép export, CITES, thủ tục đặc biệt")}

<h2>Gỗ gụ đỏ, hương bị hạn chế ở Mỹ không?</h2>
<p><strong>Không cấm hoàn toàn, nhưng bị giới hạn.</strong> Mỹ tuân thủ CITES — gỗ hương (Dalbergia, Aquilaria) nằm trong danh sách bảo vệ II (bị hạn chế nhập khẩu để bảo vệ môi trường).</p>

<h2>5 giấy tờ cần chuẩn bị</h2>
<ol>
<li><strong>Giấy phép export gỗ quý:</strong> Từ Sở Nông Nghiệp & PTNT tỉnh (nơi sản xuất/bán gỗ).</li>
<li><strong>CITES permit (nếu cần):</strong> Từ Cục Bảo vệ KVSDĐ (Cục Lâm Nghiệp). Không phải loại gỗ nào cũng cần.</li>
<li><strong>Hóa đơn, lệnh BL:</strong> Chứng minh giá trị, nơi sản xuất.</li>
<li><strong>COO (Certificate of Origin):</strong> Chứng minh hàng từ VN.</li>
<li><strong>Hóa đơn thương mại + packing list:</strong> Chi tiết hàng hóa.</li>
</ol>

<h2>Quy trình Minh Thiện export gỗ quý</h2>
<ol>
<li><strong>Bạn liên hệ:</strong> Nói loại gỗ, số lượng, mục đích (bàn thờ, trang trí, v.v.).</li>
<li><strong>Minh Thiện kiểm hàng:</strong> Xác định loại gỗ chính xác, chất lượng.</li>
<li><strong>Xin giấy phép export:</strong> Minh Thiện giúp yêu cầu Sở NN&PTNT (5-10 ngày).</li>
<li><strong>Xin CITES (nếu cần):</strong> Cục Bảo vệ KVSDĐ (3-5 ngày).</li>
<li><strong>Chuẩn bị tài liệu:</strong> Hóa đơn, COO, packing list.</li>
<li><strong>Khai báo hải quan + lên tàu.</strong></li>
<li><strong>Gửi Mỹ 3-5 ngày (bay) hoặc 2-4 tuần (biển).</strong></li>
</ol>

<h2>Chi phí export gỗ quý</h2>
<ul>
<li><strong>Phí xin giấy phép:</strong> 500k–1M (tùy loại, tỉnh).</li>
<li><strong>Phí CITES:</strong> 200-500k (nếu cần).</li>
<li><strong>Cước vận chuyển:</strong> Bình thường (300k–1.5M VNĐ/kg).</li>
</ul>

<h2>Liên hệ gửi gỗ gụ đỏ, hương đi Mỹ</h2>
<p><strong>0589.77.89.89 (Ms Min, Zalo/Viber)</strong> — Minh Thiện chuyên export gỗ quý VN. Xin giấy phép, CITES, khai báo hải quan. Gửi nhanh, không tạm giữ. Mất hàng đền 100%.</p>`,
  },

];

(async () => {
  console.log(`\n📝 Batch 2: Đăng ${articles.length} bài...\n`);
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
      console.log(`${status} ${article.slug}`);
      count++;
    } catch (e) {
      console.log(`❌ ${article.slug} - ${e.message}`);
    }
  }
  console.log(`\n✨ Batch 2 xong: +${count} bài (tổng: ${5+count}/30)\n`);
})();
