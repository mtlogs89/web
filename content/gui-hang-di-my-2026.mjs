/**
 * Nội dung trang dịch vụ "Gửi hàng đi Mỹ" — chuẩn SEO 2026 + AEO (FAQ JSON-LD).
 * Nạp vào DB: node content/gui-hang-di-my-2026.mjs
 * Sau khi nạp, sửa nội dung tại /admin/bai-viet (tìm bài "Gửi hàng đi Mỹ").
 */
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const SLUG = "gui-hang-di-my-huong-dan-toan-tap";

const PHONE = "0589.77.89.89";

/** Ảnh: dùng ảnh THẬT sẵn có. Chỗ nào cần ảnh ChatGPT sẽ thay sau (giữ nguyên cấu trúc <figure>). */
const img = (src, caption) =>
  `<figure><img src="${src}" alt="${caption}" loading="lazy" /><figcaption>${caption}</figcaption></figure>`;

const content = `
<p><strong>Trả lời nhanh:</strong> Minh Thiện Logistics nhận gửi hàng đi Mỹ trọn gói từ Việt Nam — lấy hàng tận nơi, đóng gói chuẩn quốc tế, làm thủ tục hải quan và giao tận địa chỉ người nhận trên toàn nước Mỹ. Hàng đi theo hai tốc độ: <strong>chuyển nhanh khoảng 3–5 ngày</strong> và <strong>tiết kiệm khoảng 8–12 ngày</strong>. Chúng tôi nhận cả những mặt hàng khó mà nhiều nơi từ chối như thực phẩm khô, đặc sản, thuốc và yến sào. Gọi <strong>${PHONE}</strong> (Ms Min) để được báo giá miễn phí trong 5 phút.</p>

${img("/images/real/hang-gui-da-dang.jpg", "Hàng thật khách gửi đi Mỹ mỗi ngày tại Minh Thiện Logistics")}

<h2>Gửi hàng đi Mỹ mất bao lâu?</h2>
<p>Tùy dịch vụ bạn chọn, hàng thường tới tay người nhận tại Mỹ trong khoảng <strong>3–12 ngày</strong>:</p>
<table>
  <thead>
    <tr><th>Dịch vụ</th><th>Thời gian dự kiến</th><th>Phù hợp với</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Chuyển nhanh</strong></td><td>Khoảng 3–5 ngày</td><td>Hàng gấp, thuốc, quà tặng có hạn, mẫu hàng cho đối tác</td></tr>
    <tr><td><strong>Tiết kiệm</strong></td><td>Khoảng 8–12 ngày</td><td>Hàng nặng, hàng kinh doanh, đồ dùng cá nhân không gấp</td></tr>
  </tbody>
</table>
<p>Đây là thời gian vận chuyển dự kiến, tính từ lúc kiện hàng rời kho. Ba yếu tố có thể làm thay đổi thời gian thực tế:</p>
<ul>
  <li><strong>Địa chỉ giao:</strong> các thành phố lớn như California, Texas, New York, Florida thường nhanh hơn vùng xa, vùng nông thôn.</li>
  <li><strong>Lịch bay:</strong> mùa cao điểm (Noel, Tết, Black Friday) hàng dồn nhiều, chuyến bay kín chỗ.</li>
  <li><strong>Kiểm tra hải quan:</strong> hàng thực phẩm, thuốc, mỹ phẩm có thể bị giữ lại để kiểm tra — đây là lý do lớn nhất khiến hàng chậm.</li>
</ul>
<p>Kinh nghiệm thực tế: nếu bạn cần hàng đến đúng dịp (sinh nhật, giỗ chạp, Tết), hãy gửi sớm hơn dự kiến ít nhất một tuần và ưu tiên dịch vụ chuyển nhanh.</p>

<h2>Minh Thiện nhận gửi những mặt hàng nào đi Mỹ?</h2>
<p>Chúng tôi nhận hầu hết các loại hàng dân dụng và hàng kinh doanh, bao gồm nhiều mặt hàng khó mà các đơn vị khác thường từ chối:</p>
<ul>
  <li><strong>Thực phẩm khô, đặc sản:</strong> khô bò, khô gà, mực khô, cá khô, bánh kẹo, cà phê, hạt điều, tiêu, các loại gia vị.</li>
  <li><strong>Yến sào:</strong> yến thô, yến tinh chế, yến chưng sẵn đóng lọ.</li>
  <li><strong>Thuốc và thực phẩm chức năng:</strong> thuốc tây, thuốc bổ, vitamin, đông dược.</li>
  <li><strong>Quà tặng và đồ cá nhân:</strong> quần áo, giày dép, mỹ phẩm, đồ lưu niệm, đồ thờ cúng.</li>
  <li><strong>Hàng kinh doanh:</strong> mẫu hàng, hàng bán online, phụ kiện, thiết bị.</li>
  <li><strong>Hàng cồng kềnh, giá trị cao:</strong> chúng tôi từng gửi thành công cả đàn piano đi quốc tế.</li>
</ul>

${img("/images/real/thuc-pham-kho-dac-san.jpg", "Thực phẩm khô, đặc sản Việt Nam được đóng gói chuẩn trước khi gửi đi Mỹ")}

<h3>Hàng nào cần hỏi trước khi gửi?</h3>
<p>Một số mặt hàng cần kiểm tra riêng trước khi tiếp nhận, vì quy định của hải quan Mỹ và của hãng bay khá chặt:</p>
<ul>
  <li>Hàng có <strong>pin, sạc dự phòng</strong> (quy định an toàn hàng không).</li>
  <li><strong>Chất lỏng</strong>, nước mắm, nước hoa, hàng dễ cháy nổ.</li>
  <li>Thực phẩm có <strong>nguồn gốc động vật</strong>: thịt tươi, xúc xích, trứng, sữa.</li>
  <li>Hàng <strong>không nhãn mác</strong>, không rõ thành phần, không hạn sử dụng.</li>
  <li>Hàng có <strong>thương hiệu nhái</strong> — tuyệt đối không nhận.</li>
</ul>
<p>Bạn chỉ cần chụp ảnh món hàng gửi qua Zalo <strong>${PHONE}</strong>, chúng tôi kiểm tra và trả lời được hay không trong vài phút — miễn phí, không ràng buộc.</p>

<h2>“Hàng sạch” là gì? Vì sao chỉ hàng sạch mới được đền 100%?</h2>
<p><strong>Trả lời ngắn: “hàng sạch” là hàng không đưa vào miệng.</strong> Nghĩa là những món không phải thực phẩm, không phải thuốc, không ăn uống được — ví dụ máy móc, quần áo, giày dép, thiết bị công nghiệp, đồ gia dụng, phụ kiện.</p>
<p>Nhóm hàng này <strong>đi rất thoải mái</strong> và được <strong>cam kết đền 100% giá trị nếu thất lạc</strong>, với điều kiện bạn khai báo giá trị rõ ràng ngay từ đầu và hàng sạch hoàn toàn trước khi thông quan.</p>
<p>Lý do rất đơn giản: hàng không ăn uống được thì <strong>không liên quan đến FDA</strong> (Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ). Không dính FDA thì rủi ro bị giữ, bị xét nghiệm, bị tiêu hủy gần như bằng không — nên chúng tôi tự tin cam kết đền đủ.</p>

<h2>Gửi thực phẩm, thuốc đi Mỹ có rủi ro gì?</h2>
<p>Ngược lại với hàng sạch, <strong>mọi thứ “cho vô mồm” đều là hàng rủi ro cao</strong> vì phải chịu sự quản lý của FDA. Nhóm này gồm: thực phẩm khô, đặc sản, yến sào, thuốc tây, thực phẩm chức năng, gia vị.</p>

${img("/images/real/thuoc-tay.jpg", "Thuốc tây, thực phẩm chức năng — nhóm hàng rủi ro cao vì chịu quản lý của FDA")}

<p>Chúng tôi <strong>vẫn nhận gửi</strong> nhóm hàng này — đó là thế mạnh của Minh Thiện. Nhưng bạn cần hiểu rõ ba điều trước khi gửi:</p>
<ul>
  <li><strong>Dễ bị giữ để kiểm tra:</strong> hải quan Mỹ có quyền mở kiện, lấy mẫu xét nghiệm, khiến hàng chậm thêm nhiều ngày.</li>
  <li><strong>Có thể bị từ chối nhập:</strong> nếu sai khai báo, sai nhãn, hoặc mặt hàng thuộc diện cấm.</li>
  <li><strong>Chi phí xử lý phát sinh:</strong> khi hàng bị giữ, có thể phát sinh phí lưu kho, phí xử lý.</li>
</ul>
<p><strong>Lưu ý quan trọng:</strong> hàng “cho vô mồm” chỉ nên gửi khi khai báo FDA đúng và hàng sạch hoàn toàn (đúng nhãn, đúng thành phần, còn hạn, đóng gói thương mại). Chính sách đền 100% áp dụng cho hàng sạch — với nhóm hàng FDA, chúng tôi sẽ tư vấn cụ thể mức bảo hiểm và rủi ro cho từng lô trước khi bạn quyết định gửi.</p>

<h3>Làm sao tăng khả năng thực phẩm qua được hải quan Mỹ?</h3>
<ul>
  <li>Ưu tiên hàng <strong>đóng gói thương mại</strong>, có nhãn in sẵn, mã vạch, hạn sử dụng rõ.</li>
  <li><strong>Ghi thành phần bằng tiếng Anh</strong> nếu có thể.</li>
  <li>Tránh hàng tự làm, hàng đóng gói thủ công, hàng không nhãn.</li>
  <li>Không gửi số lượng quá lớn một lần — dễ bị coi là hàng thương mại và bị áp thủ tục nhập khẩu.</li>
  <li>Khai báo trung thực, <strong>không khai thiếu giá trị</strong> để né thuế.</li>
</ul>

<h2>Cước gửi hàng đi Mỹ được tính như thế nào?</h2>
<p><strong>Trả lời ngắn:</strong> cước tính theo <strong>số lớn hơn</strong> giữa trọng lượng thực tế và trọng lượng qui đổi từ kích thước kiện.</p>
<p>Công thức trọng lượng quy đổi (còn gọi là trọng lượng thể tích):</p>
<p><strong>Trọng lượng quy đổi (kg) = Dài × Rộng × Cao (cm) ÷ 5000</strong></p>
<p>Ví dụ dễ hiểu: một thùng quần áo nhẹ nhưng cồng kềnh, cân thực tế 4 kg, kích thước 50 × 40 × 30 cm. Trọng lượng quy đổi = (50 × 40 × 30) ÷ 5000 = 12 kg. Vì 12 kg lớn hơn 4 kg, cước sẽ tính theo <strong>12 kg</strong>.</p>
<p>Ngoài trọng lượng, giá còn phụ thuộc:</p>
<ul>
  <li><strong>Loại hàng:</strong> hàng thường, hay hàng đặc thù như thuốc, mỹ phẩm, yến (có phụ thu riêng).</li>
  <li><strong>Dịch vụ:</strong> chuyển nhanh hay tiết kiệm.</li>
  <li><strong>Địa chỉ giao:</strong> thành phố lớn hay vùng xa.</li>
</ul>
<p>Vì mỗi lô hàng mỗi khác, chúng tôi không niêm yết một mức giá chung. Bạn dùng <a href="/#bao-gia">công cụ tính cước trên trang chủ</a> để xem giá tham khảo ngay, hoặc gọi <strong>${PHONE}</strong> để nhận báo giá chính xác trong 5 phút.</p>

${img("/images/real/can-kien-hang.jpg", "Cân và đo kích thước từng kiện để tính cước minh bạch — khách xem trực tiếp")}

<h3>Mẹo tiết kiệm cước gửi hàng đi Mỹ</h3>
<ul>
  <li><strong>Gom nhiều món vào một kiện</strong> thay vì gửi lẻ nhiều lần.</li>
  <li><strong>Bỏ bớt bao bì thừa</strong>: hộp giấy, xốp rỗng làm phồng kích thước và đội trọng lượng quy đổi.</li>
  <li><strong>Nén quần áo, chăn màn</strong> bằng túi hút chân không.</li>
  <li>Chọn <strong>dịch vụ tiết kiệm</strong> nếu không gấp.</li>
  <li>Hỏi trước khi đóng thùng — chúng tôi tư vấn cách xếp để giảm kích thước.</li>
</ul>

<h2>Gửi hàng đi Mỹ cần giấy tờ gì?</h2>
<p>Với hàng cá nhân, quà tặng thông thường, thủ tục rất đơn giản:</p>
<ul>
  <li><strong>Thông tin người gửi:</strong> họ tên, số điện thoại, địa chỉ.</li>
  <li><strong>Thông tin người nhận tại Mỹ:</strong> họ tên, số điện thoại, địa chỉ đầy đủ kèm <strong>ZIP code</strong>.</li>
  <li><strong>Bản kê khai hàng hóa:</strong> liệt kê món gì, bao nhiêu, trị giá bao nhiêu.</li>
</ul>
<p>Với hàng kinh doanh, hàng số lượng lớn hoặc hàng thuộc diện FDA, có thể cần thêm hóa đơn thương mại, giấy chứng nhận xuất xứ hoặc khai báo FDA. Nhân viên Minh Thiện sẽ hướng dẫn và hỗ trợ chuẩn bị đầy đủ — bạn không phải tự mày mò.</p>

<h2>Đóng gói hàng đi Mỹ thế nào cho đúng?</h2>
<p>Hàng đi Mỹ phải qua nhiều chặng: xe tải, băng chuyền sân bay, khoang máy bay, kho trung chuyển, xe giao nội địa Mỹ. Đóng gói sai là hàng vỡ, ướt, hoặc bị giữ.</p>
<p>Nguyên tắc đóng gói chuẩn:</p>
<ul>
  <li><strong>Thùng carton cứng nhiều lớp</strong>, không dùng lại thùng đã mềm, móp.</li>
  <li><strong>Chèn kín khoảng trống</strong> bằng xốp, giấy, mút — lắc thùng không nghe tiếng động là đạt.</li>
  <li><strong>Hàng dễ vỡ</strong>: bọc từng món riêng bằng xốp nổ, đặt ở giữa, cách thành thùng ít nhất 5 cm.</li>
  <li><strong>Thực phẩm</strong>: hút chân không hoặc bọc kín nhiều lớp để không rò mùi, không hút ẩm.</li>
  <li><strong>Dán băng keo chữ H</strong> ở cả nắp trên và đáy thùng.</li>
  <li><strong>Ghi rõ thông tin</strong> người nhận trên mặt thùng, dán thêm bên trong phòng khi nhãn ngoài bong.</li>
</ul>
<p>Nếu bạn không chắc, cứ mang hàng tới — Minh Thiện <strong>đóng gói lại miễn phí theo chuẩn quốc tế</strong> trước khi hàng lên đường.</p>

${img("/images/real/dong-goi-giao-kien.jpg", "Nhân viên Minh Thiện đóng gói lại kiện hàng theo chuẩn quốc tế trước khi xuất đi")}

<h2>Quy trình gửi hàng đi Mỹ tại Minh Thiện gồm mấy bước?</h2>
<p>Năm bước, và bạn hầu như không phải làm gì ngoài bước đầu tiên:</p>
<ol>
  <li><strong>Liên hệ và báo giá:</strong> gọi hoặc nhắn Zalo <strong>${PHONE}</strong>, mô tả món hàng. Chúng tôi báo giá miễn phí trong 5 phút.</li>
  <li><strong>Lấy hàng tận nơi:</strong> nhân viên tới tận nhà nhận hàng, thường trong vòng 24 giờ.</li>
  <li><strong>Cân, kiểm tra và đóng gói:</strong> cân trước mặt bạn, tư vấn cách đóng gói, đóng lại chuẩn quốc tế.</li>
  <li><strong>Làm thủ tục và xuất hàng:</strong> chúng tôi lo khai báo, hải quan và đưa hàng lên chuyến bay gần nhất.</li>
  <li><strong>Giao tận tay và theo dõi:</strong> bạn nhận mã vận đơn để tra cứu hành trình cho tới khi người nhận ký nhận tại Mỹ.</li>
</ol>

<h2>Làm sao theo dõi kiện hàng đang đi Mỹ?</h2>
<p>Sau khi đơn được xử lý, bạn nhận một <strong>mã vận đơn dạng MT-xxxxxxx</strong>. Nhập mã đó vào <a href="/tra-cuu">trang tra cứu đơn hàng</a> trên website là xem được toàn bộ hành trình: đã tiếp nhận, đã xuất kho, đang bay, đang giao, đã giao.</p>
<p>Nếu người nhận đưa bạn mã của hãng chuyển phát tại Mỹ (dạng <strong>1Z…</strong> của UPS chẳng hạn), bạn cũng nhập ngay vào trang tra cứu đó — hệ thống sẽ dẫn thẳng sang trang theo dõi của hãng.</p>
<p>Ngoài ra, bộ phận chăm sóc khách hàng chủ động báo cho bạn khi hàng có cập nhật bất thường, không để bạn phải hỏi.</p>

<h2>Gửi hàng đi Mỹ ở đâu uy tín?</h2>
<p>Minh Thiện Logistics hoạt động từ <strong>2018</strong>, chuyển phát đi hơn <strong>200 quốc gia</strong>, với hai điểm nhận hàng:</p>
<ul>
  <li><strong>Trụ sở TP. Hồ Chí Minh:</strong> 5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất — Hotline <strong>${PHONE}</strong> (Ms Min).</li>
  <li><strong>Chi nhánh Nha Trang:</strong> 45 Nguyễn Xiển, P. Bắc Nha Trang, Khánh Hòa — Hotline <strong>0964.369.789</strong>.</li>
</ul>
<p>Ngoài hai khu vực trên, chúng tôi vẫn nhận hàng toàn quốc qua dịch vụ lấy hàng tận nơi.</p>
<p>Ba lý do khách chọn Minh Thiện để gửi hàng đi Mỹ:</p>
<ul>
  <li><strong>Nhận cả hàng khó:</strong> thực phẩm khô, thuốc, yến sào — những thứ nhiều nơi lắc đầu, chúng tôi vẫn tư vấn cách gửi được.</li>
  <li><strong>Minh bạch:</strong> cân đo trước mặt khách, báo giá rõ trước khi gửi, không phát sinh bất ngờ.</li>
  <li><strong>Cam kết rõ ràng:</strong> hàng sạch mất là đền 100% giá trị đã khai báo — không vòng vo.</li>
</ul>

${img("/images/real/thung-hang-san-sang.jpg", "Những kiện hàng đã sẵn sàng rời kho Minh Thiện để lên chuyến bay đi Mỹ")}

<h2>Bắt đầu gửi hàng đi Mỹ ngay hôm nay</h2>
<p>Chỉ cần một cuộc gọi hoặc một tin nhắn Zalo tới <strong>${PHONE}</strong> (Ms Min) là xong — chúng tôi báo giá trong 5 phút, tới tận nhà lấy hàng trong 24 giờ, và lo trọn phần còn lại cho tới khi người thân bạn ở Mỹ nhận được hàng tận tay.</p>
`.trim();

const faqs = [
  {
    q: "Gửi hàng đi Mỹ mất bao lâu?",
    a: "Dịch vụ chuyển nhanh dự kiến khoảng 3–5 ngày, dịch vụ tiết kiệm khoảng 8–12 ngày. Thời gian thực tế thay đổi theo địa chỉ giao tại Mỹ, lịch bay và quá trình kiểm tra hải quan. Hàng thực phẩm và thuốc có thể chậm hơn do bị kiểm tra.",
  },
  {
    q: "Minh Thiện có gửi được thực phẩm và thuốc đi Mỹ không?",
    a: "Có. Minh Thiện nhận gửi thực phẩm khô, đặc sản, yến sào, thuốc và thực phẩm chức năng đi Mỹ. Tuy nhiên đây là nhóm hàng rủi ro cao vì chịu quản lý của FDA, dễ bị giữ để kiểm tra. Hàng cần đóng gói thương mại, có nhãn, còn hạn và khai báo đúng.",
  },
  {
    q: "Hàng sạch là gì và vì sao được đền 100%?",
    a: "Hàng sạch là hàng không đưa vào miệng — máy móc, quần áo, giày dép, thiết bị, đồ gia dụng. Nhóm này không liên quan đến FDA nên rủi ro bị giữ gần như bằng không, vì vậy Minh Thiện cam kết đền 100% giá trị nếu thất lạc, với điều kiện khách khai báo giá trị rõ ràng và hàng sạch hoàn toàn trước thông quan.",
  },
  {
    q: "Cước gửi hàng đi Mỹ tính thế nào?",
    a: "Cước tính theo số lớn hơn giữa trọng lượng thực tế và trọng lượng quy đổi. Trọng lượng quy đổi = Dài × Rộng × Cao (cm) ÷ 5000. Ngoài ra giá còn phụ thuộc loại hàng, dịch vụ nhanh hay tiết kiệm, và địa chỉ giao tại Mỹ.",
  },
  {
    q: "Gửi hàng đi Mỹ cần giấy tờ gì?",
    a: "Với hàng cá nhân và quà tặng chỉ cần thông tin người gửi, thông tin người nhận tại Mỹ kèm ZIP code, và bản kê khai hàng hóa. Hàng kinh doanh hoặc hàng thuộc diện FDA có thể cần thêm hóa đơn thương mại và khai báo FDA — nhân viên sẽ hướng dẫn chuẩn bị.",
  },
  {
    q: "Có nhận hàng tận nhà và đóng gói giúp không?",
    a: "Có. Minh Thiện lấy hàng tận nơi, thường trong vòng 24 giờ sau khi bạn đặt. Hàng được cân và kiểm tra trước mặt khách, đồng thời đóng gói lại theo chuẩn quốc tế miễn phí trước khi vận chuyển.",
  },
  {
    q: "Làm sao theo dõi kiện hàng đi Mỹ?",
    a: "Bạn nhận mã vận đơn dạng MT-xxxxxxx và nhập vào trang tra cứu trên website minhthienlogs.com để xem hành trình. Nếu có mã của hãng chuyển phát tại Mỹ như UPS (dạng 1Z…), bạn cũng nhập vào trang tra cứu để xem trạng thái từ hãng.",
  },
  {
    q: "Mặt hàng nào cần hỏi trước khi gửi đi Mỹ?",
    a: "Hàng có pin hoặc sạc dự phòng, chất lỏng, nước mắm, nước hoa, hàng dễ cháy nổ, thực phẩm có nguồn gốc động vật như thịt tươi và sữa, hàng không nhãn mác. Hàng nhái thương hiệu thì không nhận. Bạn chụp ảnh gửi Zalo 0589.77.89.89 để được kiểm tra miễn phí.",
  },
];

const now = new Date().toISOString();
const db = new Database(new URL("../prisma/dev.db", import.meta.url).pathname);

const existing = db.prepare("SELECT id FROM Article WHERE slug = ?").get(SLUG);

const data = {
  slug: SLUG,
  title: "Gửi hàng đi Mỹ: thời gian, cước, thủ tục và cách đóng gói (hướng dẫn 2026)",
  excerpt:
    "Hướng dẫn đầy đủ cách gửi hàng đi Mỹ từ Việt Nam: thời gian 3–12 ngày theo dịch vụ, cách tính cước, giấy tờ cần chuẩn bị, cách đóng gói và những mặt hàng nhận gửi — kể cả hàng khó như thực phẩm khô, thuốc, yến sào.",
  content,
  coverImage: "/images/real/hang-gui-da-dang.jpg",
  category: "Mỹ",
  tags: "gửi hàng đi Mỹ,vận chuyển đi Mỹ,gửi thực phẩm đi Mỹ,gửi thuốc đi Mỹ,cước gửi hàng đi Mỹ",
  metaTitle: "Gửi hàng đi Mỹ 2026: thời gian, cước phí, thủ tục & đóng gói | Minh Thiện",
  metaDescription:
    "Gửi hàng đi Mỹ trọn gói: nhanh 3–5 ngày, tiết kiệm 8–12 ngày. Nhận cả hàng khó (thực phẩm khô, thuốc, yến). Lấy hàng tận nơi, đền 100% hàng sạch. Báo giá 5 phút: 0589.77.89.89.",
  faqJson: JSON.stringify(faqs),
  published: 1,
};

if (existing) {
  db.prepare(
    `UPDATE Article SET title=@title, excerpt=@excerpt, content=@content, coverImage=@coverImage,
     category=@category, tags=@tags, metaTitle=@metaTitle, metaDescription=@metaDescription,
     faqJson=@faqJson, published=@published, updatedAt=@updatedAt WHERE slug=@slug`
  ).run({ ...data, updatedAt: now });
  console.log("Đã CẬP NHẬT bài:", SLUG);
} else {
  db.prepare(
    `INSERT INTO Article (id, slug, title, excerpt, content, coverImage, category, tags,
     metaTitle, metaDescription, faqJson, published, views, publishedAt, createdAt, updatedAt)
     VALUES (@id, @slug, @title, @excerpt, @content, @coverImage, @category, @tags,
     @metaTitle, @metaDescription, @faqJson, @published, 0, @now, @now, @now)`
  ).run({ ...data, id: "a" + randomUUID(), now, updatedAt: now });
  console.log("Đã TẠO bài mới:", SLUG);
}

const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
console.log("Số chữ (không tính thẻ HTML):", words);
console.log("Số câu hỏi FAQ (AEO JSON-LD):", faqs.length);
