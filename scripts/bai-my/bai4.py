# -*- coding: utf-8 -*-
HL = "0589.77.89.89"
IMG = lambda f, alt, cap: f'<figure><img src="/images/real/{f}" alt="{alt}" style="width:100%;max-width:800px;height:auto;border-radius:8px" /><figcaption>{cap}</figcaption></figure>'

BAI4 = dict(
    slug="cuoc-gui-hang-di-my-tinh-the-nao",
    title="Cước Gửi Hàng Đi Mỹ Tính Thế Nào? Cân Quy Đổi, Phụ Thu Và Bao Thuế",
    content=f"""<p>Hai người cùng mang "một thùng" ra gửi đi Mỹ mà trả tiền khác hẳn nhau là chuyện bình thường, và không phải ai bị tính đắt hơn cũng là bị chặt chém. Cước không tính theo thùng, mà theo <strong>số ký tính cước</strong> — một con số do cả cân nặng lẫn kích thước quyết định. Hiểu cách tính này thường giúp tiết kiệm nhiều hơn là đi săn chỗ rẻ.</p>

<h2>Cân thực và cân quy đổi: lấy cái lớn hơn</h2>
<p>Máy bay bị giới hạn cả sức nâng lẫn chỗ chứa. Một thùng bông gòn không nặng, nhưng nó chiếm chỗ của hàng khác. Vì vậy hãng bay tính theo <strong>mức cao hơn</strong> giữa hai con số:</p>
<ul>
<li><strong>Cân thực:</strong> cân lên được bao nhiêu ký.</li>
<li><strong>Cân quy đổi:</strong> lấy <code>Dài × Rộng × Cao</code> (tính bằng cm) rồi <strong>chia 5000</strong>.</li>
</ul>
<p>Ví dụ dễ hình dung nhất: một thùng chăn gối 60 × 40 × 50 cm, cân lên đúng 6kg. Cân quy đổi là 60 × 40 × 50 ÷ 5000 = <strong>24kg</strong>. Cước tính theo 24kg. Không ai tính sai cả — thùng đó thật sự chiếm chỗ của 24kg hàng khác.</p>

<h2>Năm ví dụ cho quen tay</h2>
<table><thead><tr><th>Kiện hàng</th><th>Kích thước</th><th>Cân thực</th><th>Cân quy đổi</th><th>Tính theo</th></tr></thead><tbody>
<tr><td>Thùng đồ khô, đặc sản</td><td>40 × 30 × 30 cm</td><td>12kg</td><td>7,2kg</td><td><strong>12kg</strong> — cân thực</td></tr>
<tr><td>Thùng chăn gối</td><td>60 × 40 × 50 cm</td><td>6kg</td><td>24kg</td><td><strong>24kg</strong> — quy đổi</td></tr>
<tr><td>Thùng quần áo đã nén</td><td>50 × 40 × 30 cm</td><td>11kg</td><td>12kg</td><td><strong>12kg</strong> — quy đổi</td></tr>
<tr><td>Thùng bánh phồng, snack</td><td>50 × 40 × 40 cm</td><td>4kg</td><td>16kg</td><td><strong>16kg</strong> — quy đổi</td></tr>
<tr><td>Thùng sách vở</td><td>35 × 25 × 25 cm</td><td>15kg</td><td>4,4kg</td><td><strong>15kg</strong> — cân thực</td></tr>
</tbody></table>
<p>Quy luật rút ra: <strong>hàng đặc và nặng thì tính theo cân thực, hàng xốp và cồng kềnh thì tính theo kích thước</strong>. Biết mình thuộc nhóm nào là biết nên nén lại hay nên gom thêm cho đầy thùng.</p>

<h2>Một ca thật: máy móc phải đóng gỗ</h2>
<p>Tháng 9 vừa rồi có khách gửi một máy phân tích vật chất đi Mỹ. Máy không quá nặng, nhưng thiết bị đo thì bắt buộc đóng kiện gỗ để chống va đập — và kiện gỗ làm kích thước phình lên đáng kể, thành 55 × 55 × 46 cm. Tính ra cân quy đổi gần 28kg, cao hơn cân thực khá nhiều.</p>
<p>Bài học không phải là "đừng đóng gỗ" — thiết bị đo mà không đóng gỗ thì hỏng còn tốn hơn. Bài học là <strong>với hàng đặc biệt, phải hỏi giá dựa trên kích thước sau khi đóng gói, chứ không phải cân nặng lúc còn trên bàn</strong>. Máy móc, thiết bị, đồ dễ vỡ, hàng cần kê lót đều rơi vào nhóm này.</p>

{IMG("can-kien-hang.jpg", "Cân và đo kích thước kiện hàng trước khi gửi đi Mỹ", "Với hàng đặc biệt, kích thước sau khi đóng gói mới là con số tính cước")}

<h2>Nhóm hàng hay bị tính theo kích thước</h2>
<ul>
<li>Chăn, gối, mền, thú nhồi bông.</li>
<li>Bánh phồng tôm, snack, mì ly — nhẹ mà chiếm chỗ ghê gớm.</li>
<li>Đồ nhựa gia dụng, rổ rá, hộp đựng.</li>
<li>Quần áo dày chưa nén, áo khoác mùa đông.</li>
<li>Hộp quà nhiều lớp giấy gói và hộp lồng hộp.</li>
<li>Hàng phải đóng kiện gỗ: máy móc, thiết bị, đồ dễ vỡ.</li>
</ul>

<h2>"Bao thuế" nghĩa là gì và vì sao nó đổi hẳn phép so sánh</h2>
<p>Hàng vào Mỹ có thể phát sinh thuế và phí ở đầu nhập. Có hai cách xử lý, và chúng dẫn tới hai con số cuối cùng rất khác nhau:</p>
<ul>
<li><strong>Không bao thuế:</strong> bạn trả cước ở Việt Nam, người nhận bên Mỹ làm việc với hải quan và đóng khoản phát sinh khi hàng tới. Khoản này không biết trước được, và người phải xoay là người nhà bạn.</li>
<li><strong>Bao thuế trọn gói:</strong> khoản đó đã nằm trong cước bạn trả ở Việt Nam. Người nhận chỉ việc ký nhận hàng.</li>
</ul>
<p>Minh Thiện Logistics áp dụng bao thuế đầu nhập Mỹ cho hàng thông thường. Một vài mặt hàng đặc thù — nước hoa, bột pha trà sữa — <strong>không bao đầu nhập</strong>, và điều này được nói trước khi nhận hàng. Chi tiết từng nhóm xem tại <a href="/hang-gui-duoc/my">bảng 41 nhóm mặt hàng gửi đi Mỹ</a>.</p>
<p>Vì vậy, so cước theo từng ký giữa một nơi bao thuế và một nơi không bao là so hai thứ khác nhau.</p>

<h2>Các loại phụ thu và lý do có chúng</h2>
<p>Ngoài cước theo ký, một số nhóm hàng có phụ thu riêng. Không phải vẽ ra cho có — mỗi khoản gắn với một việc phải làm thêm:</p>
<ul>
<li><strong>Hàng lỏng đóng chai</strong> — nước mắm, mắm, gia vị, nước sốt: phải bọc chống rò và đóng thùng riêng. Một chai rò có thể làm hỏng cả lô hàng đi chung.</li>
<li><strong>Hàng rủi ro ở đầu nhập</strong> — giò chả, thịt khô, sữa trứng, thuốc, thực phẩm chức năng: cần khai báo thêm và có khả năng phát sinh xử lý bên Mỹ.</li>
<li><strong>Hàng giá trị cao hoặc cần xử lý riêng</strong> — nước hoa, đồng hồ, thiết bị điện tử, amply: liên quan tới khai giá trị, đóng gói chống va đập và mức đền bù.</li>
<li><strong>Hàng đông lạnh:</strong> phải giữ nhiệt suốt hành trình nên chỉ đi được dịch vụ nhanh.</li>
<li><strong>Hàng phải đóng kiện gỗ:</strong> máy móc, thiết bị đo.</li>
<li><strong>Mùa cao điểm</strong> trước Giáng sinh và Tết: chỗ trên máy bay khan hiếm.</li>
</ul>
<p>Mức của từng nhóm ghi trong bảng mặt hàng, hoặc gọi {HL} để được báo đúng món của bạn.</p>

{IMG("hang-kho-da-dang.jpg", "Hàng khô gom chung một thùng gửi đi Mỹ", "Gom nhiều món vào một thùng thường lợi hơn chia ra nhiều thùng nhỏ")}

<h2>Đi nhanh hay đi tiết kiệm</h2>
<p>Cùng một kiện, chọn dịch vụ khác nhau thì cước khác nhau. Cách chọn khá đơn giản:</p>
<ul>
<li><strong>Đi nhanh</strong> khi hàng có hạn sử dụng ngắn, đồ dễ hút ẩm, hàng đông lạnh, hoặc cần kịp một dịp cụ thể.</li>
<li><strong>Đi tiết kiệm</strong> khi là đồ khô để dành, quần áo, đồ dùng, sách vở — chậm vài ngày không ảnh hưởng gì.</li>
</ul>
<p>Số chính thức tuyến Mỹ: <strong>đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc</strong>, vùng sâu vùng xa tuỳ postcode cộng thêm 2–3 ngày. Có chuyến cả tuần, <strong>chốt hàng lúc 10 giờ sáng ngày hôm trước</strong>. Cả hai mốc đều tính bằng ngày làm việc và tính từ khi hàng rời Việt Nam — nên giao hàng chiều thứ Sáu thì đừng tính thứ Bảy Chủ nhật vào.</p>

<h2>Vì sao hai người gửi cùng số ký mà trả khác nhau</h2>
<ol>
<li><strong>Kích thước thùng khác nhau.</strong> Người đóng gọn tính theo cân thực, người đóng phồng bị tính theo quy đổi.</li>
<li><strong>Loại hàng khác nhau.</strong> Có nhóm kèm phụ thu, có nhóm không.</li>
<li><strong>Dịch vụ khác nhau.</strong> Đi nhanh và đi tiết kiệm không cùng giá.</li>
<li><strong>Địa chỉ nhận khác nhau.</strong> Vùng xa ngoài thành phố lớn cộng thêm cả thời gian lẫn chi phí.</li>
<li><strong>Bao thuế hay không.</strong> Khác biệt lớn nhất, và hay bị bỏ quên nhất khi so giá.</li>
</ol>

<h2>Thùng không vuông vức thì đo thế nào</h2>
<p>Đo theo chiều dài nhất của mỗi cạnh, tính cả phần nhô ra như tay cầm hay chân đế. Kiện tròn hoặc hình dạng lạ thì đo theo khối hộp nhỏ nhất bao được nó — vì trên máy bay nó cũng chiếm đúng chừng đó chỗ. Vali, thùng xốp, két nhựa đều tính theo cách này. Không chắc thì chụp ảnh kèm thước và gửi qua Zalo {HL} để được đo giúp.</p>

<h2>Đường bay và đường biển</h2>
<table><thead><tr><th></th><th>Đường bay</th><th>Đường biển</th></tr></thead><tbody>
<tr><td>Thời gian</td><td>Tính bằng ngày</td><td>Tính bằng tuần tới tháng</td></tr>
<tr><td>Hợp với</td><td>Hàng lẻ, đồ ăn, quà, hàng gấp</td><td>Khối lượng lớn, đồ đạc nhà cửa, hàng không gấp</td></tr>
<tr><td>Chi phí cố định hai đầu</td><td>Thấp</td><td>Cao — hàng ít thì không lợi</td></tr>
<tr><td>Thực phẩm</td><td>Đi được, tuỳ nhóm</td><td>Hạn chế nhiều hơn vì thời gian dài</td></tr>
</tbody></table>
<p>Chi tiết xem bài <a href="/tin-tuc/gui-hang-duong-bien-di-my">gửi hàng đường biển đi Mỹ</a>.</p>

<h2>Bốn cách giảm cước</h2>
<ol>
<li><strong>Nén gọn thùng.</strong> Bỏ hộp giấy thừa, hút chân không quần áo và chăn gối. Đây là cách giảm nhiều nhất với hàng cồng kềnh — có khi cắt được nửa số ký tính cước.</li>
<li><strong>Gom một thùng thay vì nhiều thùng nhỏ.</strong> Kiện càng nặng thì đơn giá mỗi ký càng giảm, mà mỗi thùng lại có phần chi phí cố định riêng.</li>
<li><strong>Chọn đi tiết kiệm nếu không gấp.</strong></li>
<li><strong>Tránh nhóm có phụ thu khi có lựa chọn.</strong> Ví dụ gia vị dạng bột thay cho dạng chai lỏng.</li>
</ol>

<h2>Những khoản hay bị quên khi so giá</h2>
<ol>
<li><strong>Thuế đầu nhập Mỹ</strong> — nơi bao trọn gói và nơi không bao cho ra hai con số cuối cùng rất khác nhau.</li>
<li><strong>Phí đóng gói</strong> — có nơi tính, có nơi làm miễn phí.</li>
<li><strong>Phí lấy hàng tận nơi.</strong></li>
<li><strong>Phụ thu theo nhóm hàng.</strong></li>
<li><strong>Phí giao vùng xa.</strong></li>
</ol>
<p>Khi hỏi giá ở bất kỳ đâu, hãy hỏi <strong>"tổng cộng tôi phải trả bao nhiêu, và người nhận có phải trả gì nữa không"</strong> thay vì chỉ hỏi giá một ký. Đó là câu hỏi phân biệt một báo giá thật với một con số mồi.</p>

<h2>Xem cước kiện hàng của bạn</h2>
<p>Nhập số ký vào công cụ dưới đây để có mức ước tính ngay, hoặc gửi ảnh kiện hàng kèm số đo qua Zalo {HL} để được báo giá chính xác kèm phụ thu nếu có.</p>
<p>[[tinh-cuoc]]</p>

<h2>Liên hệ</h2>
<p><strong>Hotline / Zalo: {HL}</strong> (Ms Min) — làm việc T2–CN 8:00–21:00. Xem thêm <a href="/dich-vu/gui-hang-di-my">dịch vụ gửi hàng đi Mỹ</a> và <a href="/hang-gui-duoc/my">bảng 41 nhóm mặt hàng gửi đi Mỹ</a>.</p>""",
)
