// Nạp bài viết mẫu chất lượng (chuẩn AEO/GEO) vào DB LOCAL qua API.
// Chạy: node content/load-articles.mjs   (cần dev server localhost:3000 đang chạy)
const SITE = process.env.SITE_URL || "http://localhost:3000";
const KEY = process.env.SITE_API_KEY || "mt-logs-dev-key-doi-truoc-khi-deploy";

const articles = [
  {
    title: "Gửi hàng đi Mỹ mất bao lâu? Thời gian, thủ tục & lưu ý 2026",
    slug: "gui-hang-di-my-mat-bao-lau",
    category: "Gửi hàng đi Mỹ",
    coverImage: "/images/plane.jpg",
    excerpt:
      "Gửi hàng đi Mỹ thường mất 3–7 ngày tùy bang và loại dịch vụ. Minh Thiện Logistics lấy hàng tận nơi trong 24h và lo trọn thủ tục khai báo FDA.",
    tags: "gửi hàng đi Mỹ, thời gian gửi hàng đi Mỹ, thủ tục FDA, vận chuyển đi Mỹ",
    metaTitle: "Gửi hàng đi Mỹ mất bao lâu? Thời gian & thủ tục 2026",
    metaDescription:
      "Gửi hàng đi Mỹ mất 3–7 ngày tùy bang. Xem thời gian từng tuyến, thủ tục FDA và cách tiết kiệm cước. Liên hệ Minh Thiện 0589.77.89.89 để báo giá.",
    content: `<p><strong>Gửi hàng đi Mỹ thường mất 3–7 ngày làm việc</strong> tùy bang đến và loại dịch vụ (chuyển phát nhanh hay tiết kiệm). Với tuyến của Minh Thiện Logistics, nhân viên lấy hàng tận nơi trong vòng 24 giờ, sau đó hàng được khai báo và bay đi Mỹ ngay chuyến gần nhất.</p>
<h2>Gửi hàng đi Mỹ mất bao nhiêu ngày theo từng bang?</h2>
<p>Thời gian phụ thuộc vào khoảng cách từ sân bay nhập tới địa chỉ người nhận. Dưới đây là mốc tham khảo:</p>
<table><tr><th>Khu vực</th><th>Thời gian dự kiến</th></tr>
<tr><td>California, Texas, Washington</td><td>3–5 ngày</td></tr>
<tr><td>New York, Florida, Chicago</td><td>4–6 ngày</td></tr>
<tr><td>Các bang vùng sâu</td><td>5–7 ngày</td></tr></table>
<h2>Gửi được những mặt hàng gì đi Mỹ?</h2>
<p>Phần lớn hàng cá nhân và kinh doanh đều gửi được nếu khai báo đúng:</p>
<ul><li>Thực phẩm khô, bánh kẹo, cà phê, trà đóng gói công nghiệp</li><li>Thuốc, thực phẩm chức năng (có giới hạn số lượng)</li><li>Quần áo, đồ gia dụng, quà tặng</li><li>Hàng mẫu, hàng thương mại</li></ul>
<h2>Thủ tục khai báo FDA có phức tạp không?</h2>
<p>Thực phẩm và mỹ phẩm vào Mỹ cần khai báo <strong>FDA</strong>. Minh Thiện Logistics hỗ trợ chuẩn bị thông tin và khai báo giúp bạn, nên thủ tục diễn ra nhanh và hàng ít bị giữ tại hải quan.</p>
<h2>Làm sao để gửi hàng đi Mỹ tiết kiệm?</h2>
<p>Hãy gom đơn, đóng gói gọn để giảm trọng lượng quy đổi, và chọn dịch vụ phù hợp thời gian bạn cần. Để biết chi phí chính xác cho kiện hàng của mình, vui lòng liên hệ <strong>0589.77.89.89 (Ms Min)</strong> — Minh Thiện báo giá miễn phí trong 5 phút.</p>`,
    faqs: [
      { q: "Gửi hàng đi Mỹ mất bao lâu?", a: "Thông thường 3–7 ngày làm việc tùy bang và loại dịch vụ; nhân viên lấy hàng tận nơi trong 24h." },
      { q: "Gửi thực phẩm đi Mỹ có bị giữ hải quan không?", a: "Không, nếu là thực phẩm khô đóng gói đúng chuẩn và được khai báo FDA hợp lệ. Minh Thiện hỗ trợ thủ tục này." },
      { q: "Có gửi thuốc đi Mỹ được không?", a: "Được, với số lượng dùng cá nhân hợp lý. Liên hệ 0589.77.89.89 để được tư vấn theo từng loại thuốc." },
      { q: "Cước gửi hàng đi Mỹ tính theo gì?", a: "Theo trọng lượng thực hoặc trọng lượng quy đổi (số lớn hơn). Liên hệ hotline để được báo giá chính xác." },
    ],
  },
  {
    title: "Gửi hàng đi Úc cần lưu ý gì? Hàng cấm, thời gian & thủ tục",
    slug: "gui-hang-di-uc-can-luu-y-gi",
    category: "Gửi hàng đi Úc",
    coverImage: "/images/containers.jpg",
    excerpt:
      "Gửi hàng đi Úc mất khoảng 4–8 ngày. Úc kiểm soát thực phẩm và đồ tươi rất nghiêm — cần khai báo đúng để tránh bị tiêu hủy hoặc phạt.",
    tags: "gửi hàng đi Úc, hàng cấm gửi đi Úc, vận chuyển đi Úc, gửi đồ đi Sydney",
    metaTitle: "Gửi hàng đi Úc cần lưu ý gì? Hàng cấm & thời gian 2026",
    metaDescription:
      "Gửi hàng đi Úc mất 4–8 ngày. Danh sách hàng cấm, cách khai báo và mẹo tránh bị giữ hàng. Minh Thiện 0589.77.89.89 tư vấn miễn phí.",
    content: `<p><strong>Gửi hàng đi Úc mất khoảng 4–8 ngày</strong> tùy bang (Sydney, Melbourne, Brisbane, Perth…). Điều quan trọng nhất khi gửi đi Úc là Úc kiểm soát an toàn sinh học rất chặt — khai báo sai có thể bị tiêu hủy hàng hoặc phạt, nên cần làm đúng ngay từ đầu.</p>
<h2>Gửi hàng đi Úc mất bao lâu?</h2>
<p>Hàng thường tới tay người nhận trong 4–8 ngày làm việc. Minh Thiện Logistics nhận lấy hàng tận nơi và theo dõi đơn 24/7 trong suốt hành trình.</p>
<h2>Những mặt hàng nào bị cấm hoặc hạn chế khi gửi đi Úc?</h2>
<p>Úc hạn chế nghiêm các mặt hàng có nguy cơ sinh học:</p>
<ul><li>Thịt, hải sản tươi/khô chưa qua kiểm định</li><li>Hạt giống, cây tươi, đất</li><li>Sản phẩm từ sữa, trứng</li><li>Đồ gỗ chưa xử lý</li></ul>
<p>Đồ khô đóng gói công nghiệp, quần áo, đồ dùng cá nhân thì gửi bình thường.</p>
<h2>Đặc sản Việt có gửi đi Úc được không?</h2>
<p>Nhiều loại đặc sản khô (bánh, kẹo, cà phê, hạt điều đóng gói) gửi được nếu có nhãn mác và khai báo đúng. Minh Thiện sẽ tư vấn từng mặt hàng trước khi gửi để tránh rủi ro.</p>
<h2>Làm sao để hàng không bị giữ ở hải quan Úc?</h2>
<p>Khai báo trung thực, đóng gói sạch sẽ, dán nhãn rõ ràng và tránh các mặt hàng cấm. Để được kiểm tra danh sách hàng và báo giá, liên hệ <strong>0589.77.89.89 (Ms Min)</strong>.</p>`,
    faqs: [
      { q: "Gửi hàng đi Úc mất bao lâu?", a: "Khoảng 4–8 ngày làm việc tùy bang và loại dịch vụ." },
      { q: "Gửi thực phẩm khô đi Úc được không?", a: "Được với đồ khô đóng gói công nghiệp, có nhãn mác và khai báo đúng; đồ tươi và thịt thì bị hạn chế." },
      { q: "Vì sao hàng đi Úc dễ bị giữ?", a: "Vì Úc kiểm soát an toàn sinh học nghiêm. Khai báo đúng và tránh hàng cấm sẽ giúp thông quan thuận lợi." },
    ],
  },
  {
    title: "Nhập hàng Trung Quốc tận gốc: quy trình & cách tính cước",
    slug: "nhap-hang-trung-quoc-tan-goc-quy-trinh",
    category: "Nhập hàng Trung Quốc",
    coverImage: "/images/truck.jpg",
    excerpt:
      "Nhập hàng Trung Quốc về Việt Nam thường mất 5–12 ngày tùy đường vận chuyển. Minh Thiện mua hộ, thanh toán hộ, kiểm hàng tại kho và ship tận nơi.",
    tags: "nhập hàng Trung Quốc, order Taobao, mua hộ 1688, cách tính cước nhập hàng",
    metaTitle: "Nhập hàng Trung Quốc tận gốc: quy trình & tính cước 2026",
    metaDescription:
      "Nhập hàng Trung Quốc về Việt Nam 5–12 ngày. Quy trình order, kiểm hàng và cách tính cước theo cân/khối. Minh Thiện 0589.77.89.89.",
    content: `<p><strong>Nhập hàng Trung Quốc về Việt Nam thường mất 5–12 ngày</strong> tùy hình thức vận chuyển (đường bộ, đường biển hay đường bay). Minh Thiện Logistics nhận mua hộ Taobao, 1688, Tmall — thanh toán hộ bằng nhân dân tệ, kiểm hàng tại kho Trung Quốc và giao tận nơi tại Việt Nam.</p>
<h2>Quy trình nhập hàng Trung Quốc gồm mấy bước?</h2>
<ol><li>Bạn gửi link sản phẩm hoặc danh sách cần mua</li><li>Minh Thiện báo giá: tiền hàng + phí mua hộ + cước vận chuyển</li><li>Đặt và thanh toán hộ với nhà bán</li><li>Kiểm hàng tại kho Trung Quốc</li><li>Vận chuyển về Việt Nam, giao tận địa chỉ</li></ol>
<h2>Cước nhập hàng Trung Quốc tính theo gì?</h2>
<p>Cước tính theo số lớn hơn giữa <strong>cân nặng thực</strong> và <strong>cân nặng qui đổi theo thể tích</strong>, cộng phí dịch vụ. Hàng nặng cồng kềnh nên đi đường biển để tiết kiệm.</p>
<table><tr><th>Đường vận chuyển</th><th>Thời gian</th><th>Phù hợp</th></tr>
<tr><td>Đường bay</td><td>3–5 ngày</td><td>Hàng gấp, nhẹ, giá trị cao</td></tr>
<tr><td>Đường bộ</td><td>5–8 ngày</td><td>Đa số đơn lẻ</td></tr>
<tr><td>Đường biển</td><td>10–15 ngày</td><td>Hàng nặng, số lượng lớn</td></tr></table>
<h2>Order Taobao, 1688 cho người mới có khó không?</h2>
<p>Không, vì bạn chỉ cần gửi link — Minh Thiện lo phần tiếng Trung, thanh toán và vận chuyển. Để được tư vấn và báo giá, liên hệ <strong>0589.77.89.89 (Ms Min)</strong>.</p>`,
    faqs: [
      { q: "Nhập hàng Trung Quốc mất bao lâu?", a: "Khoảng 5–12 ngày tùy đường bay, đường bộ hay đường biển." },
      { q: "Mua hộ Taobao có cần biết tiếng Trung không?", a: "Không. Bạn gửi link, Minh Thiện lo phần đặt hàng, thanh toán và vận chuyển." },
      { q: "Cước nhập hàng tính thế nào?", a: "Theo số lớn hơn giữa cân nặng thực và cân quy đổi thể tích, cộng phí dịch vụ. Liên hệ hotline để báo giá." },
    ],
  },
  {
    title: "Cách đóng gói hàng dễ vỡ gửi đi quốc tế an toàn",
    slug: "cach-dong-goi-hang-de-vo-gui-quoc-te",
    category: "Hướng dẫn",
    coverImage: "/images/warehouse.jpg",
    excerpt:
      "Hàng dễ vỡ cần lót xốp, cố định chống xê dịch và dán nhãn 'Fragile'. Đóng gói đúng cách giúp hàng đi quốc tế nguyên vẹn.",
    tags: "đóng gói hàng dễ vỡ, gửi hàng quốc tế, hướng dẫn đóng gói",
    metaTitle: "Cách đóng gói hàng dễ vỡ gửi đi quốc tế an toàn",
    metaDescription:
      "Hướng dẫn đóng gói hàng dễ vỡ gửi quốc tế: chọn thùng, lót xốp, cố định và dán nhãn. Minh Thiện 0589.77.89.89 đóng gói chuẩn quốc tế.",
    content: `<p><strong>Để gửi hàng dễ vỡ đi quốc tế an toàn, hãy bọc từng món bằng xốp hơi, chèn kín khoảng trống và dùng thùng carton cứng nhiều lớp.</strong> Mục tiêu là hàng không xê dịch và chịu được va đập trong quá trình trung chuyển.</p>
<h2>Cần chuẩn bị vật liệu gì để đóng gói hàng dễ vỡ?</h2>
<ul><li>Thùng carton 3–5 lớp, kích thước vừa với hàng</li><li>Xốp hơi (bubble wrap), mút xốp, giấy chèn</li><li>Băng keo chắc, nhãn "Hàng dễ vỡ / Fragile"</li></ul>
<h2>Các bước đóng gói đúng chuẩn</h2>
<ol><li>Bọc từng món bằng 2–3 lớp xốp hơi</li><li>Lót đáy thùng một lớp đệm dày</li><li>Đặt hàng vào giữa, chèn kín mọi khoảng trống</li><li>Dán kín thùng và dán nhãn Fragile ở các mặt</li></ol>
<h2>Những lỗi đóng gói khiến hàng dễ hỏng</h2>
<p>Thùng quá rộng để hàng xê dịch, thiếu lớp đệm, hoặc dùng thùng cũ mềm là nguyên nhân phổ biến làm vỡ hàng. Với hàng giá trị cao, nên mua thêm bảo hiểm hàng hóa.</p>
<h2>Minh Thiện có hỗ trợ đóng gói không?</h2>
<p>Có. Minh Thiện Logistics đóng gói chuẩn quốc tế cho hàng dễ vỡ và có bảo hiểm hàng hóa. Liên hệ <strong>0589.77.89.89 (Ms Min)</strong> để được hỗ trợ.</p>`,
    faqs: [
      { q: "Đóng gói hàng dễ vỡ cần gì?", a: "Thùng carton cứng, xốp hơi, vật liệu chèn và nhãn Fragile; bọc kỹ và cố định chống xê dịch." },
      { q: "Hàng dễ vỡ có được bảo hiểm không?", a: "Có, nên mua bảo hiểm hàng hóa với hàng giá trị cao. Minh Thiện hỗ trợ đóng gói chuẩn và bảo hiểm." },
    ],
  },
];

async function run() {
  for (const a of articles) {
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
