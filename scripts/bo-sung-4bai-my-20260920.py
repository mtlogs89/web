#!/usr/bin/env python3
"""
20/09/2026 — viết thêm cho 4 bài nhóm "chọn công ty gửi hàng đi Mỹ".
Bản đầu chỉ 600–930 chữ, mỏng hơn trung vị của web (1.896 chữ) và mỏng hơn hẳn
bài đối thủ đang đứng đầu (Lê Gia 3.900 chữ). Bài này chèn thêm các mục có nội
dung thật, KHÔNG viết dài cho đủ số.

Giữ nguyên luật chủ chốt: KHÔNG ghi con số giá nào.

Dùng: python3 scripts/bo-sung-4bai-my-20260920.py <dev.db> [--ghi]
"""
import html, re, sqlite3, sys

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
HL = "0589.77.89.89"
IMG = lambda f, alt, cap: f'<figure><img src="/images/real/{f}" alt="{alt}" style="width:100%;max-width:800px;height:auto;border-radius:8px" /><figcaption>{cap}</figcaption></figure>'

THEM = {}

# ─────────────────────────────── Bài 1 ───────────────────────────────
THEM["so-sanh-cac-cach-gui-hang-di-my-tu-viet-nam"] = ("<h2>Muốn biết cước kiện hàng của mình?</h2>", f"""<h2>Gửi món này thì nên chọn ai?</h2>
<p>Bảng trên so theo tiêu chí chung. Nhưng lúc quyết định thì người ta không nghĩ theo tiêu chí, người ta nghĩ theo món hàng đang nằm trước mặt. Bảng dưới đi thẳng vào đó.</p>
<table><thead><tr><th>Món bạn gửi</th><th>Nên chọn</th><th>Lý do</th></tr></thead><tbody>
<tr><td>Giấy tờ, hồ sơ du học, hợp đồng</td><td>Hãng chuyển phát quốc tế</td><td>Cần đúng hẹn tuyệt đối, theo dõi từng mốc, có ký nhận</td></tr>
<tr><td>Đồ khô, đặc sản, bánh kẹo</td><td>Đại lý chuyên tuyến</td><td>Quen khai báo nhóm thực phẩm, đóng gói hút chân không sẵn</td></tr>
<tr><td>Giò chả, thịt khô, sữa trứng</td><td>Đại lý chuyên tuyến, hỏi kỹ trước</td><td>Nhóm rủi ro cao — cần nơi nói thẳng khả năng bị giữ thay vì hứa suông</td></tr>
<tr><td>Thuốc tây, thuốc nam, thực phẩm chức năng</td><td>Đại lý chuyên tuyến</td><td>Cần tư vấn cách khai và số lượng hợp lý</td></tr>
<tr><td>Mỹ phẩm, nước hoa</td><td>Đại lý chuyên tuyến</td><td>Hàng lỏng, dễ vỡ, có nơi không bao đầu nhập — phải hỏi rõ</td></tr>
<tr><td>Điện thoại, laptop, đồ có pin</td><td>Hỏi trước ở mọi nơi</td><td>Pin là hàng nguy hiểm khi bay, quy định chặt</td></tr>
<tr><td>Hàng mẫu, hàng kinh doanh lô nhỏ</td><td>Hãng quốc tế hoặc đại lý</td><td>Tuỳ bạn cần chứng từ chuẩn hay cần cước mềm</td></tr>
<tr><td>Hàng nặng, cồng kềnh, không gấp</td><td>Đường biển</td><td>Xem bài <a href="/tin-tuc/gui-hang-duong-bien-di-my">gửi hàng đường biển đi Mỹ</a></td></tr>
</tbody></table>
{IMG("thuoc-tay.jpg", "Thuốc tây đóng gói gửi đi Mỹ", "Thuốc và thực phẩm chức năng là nhóm cần hỏi kỹ trước khi gửi")}
<h2>Năm sai lầm hay gặp khi chọn đơn vị</h2>
<ol>
<li><strong>Chỉ so giá trên mỗi ký.</strong> Con số bạn thực trả gồm cước, thuế đầu nhập, phí đóng gói, phí lấy hàng và phụ thu nếu có. Nơi báo cước thấp mà không bao thuế thường đắt hơn khi cộng đủ.</li>
<li><strong>Không hỏi về cân quy đổi.</strong> Thùng nhẹ mà to bị tính theo kích thước. Nhiều người chỉ biết điều này lúc nhận hoá đơn.</li>
<li><strong>Hỏi chung chung "có nhận đồ ăn không".</strong> Phải hỏi đích danh món mình gửi. "Đồ ăn" gồm cả bánh tráng lẫn giò chả — hai nhóm rủi ro khác hẳn nhau.</li>
<li><strong>Tin lời hứa "đi chắc chắn 100%".</strong> Không ai bảo đảm được hải quan Mỹ, kể cả hãng lớn. Nơi nói thẳng rủi ro là nơi đáng tin hơn nơi hứa suông.</li>
<li><strong>Không có gì bằng chứng về số ký.</strong> Yêu cầu cân trước mặt hoặc gửi ảnh cân, ảnh kiện hàng. Đây là nguồn tranh cãi phổ biến nhất.</li>
</ol>
<h2>Kiểm tra một đơn vị có đàng hoàng hay không</h2>
<ul>
<li><strong>Có địa chỉ kho thật, xem được trên bản đồ.</strong> Chỉ có số điện thoại và trang mạng xã hội thì nên cẩn thận.</li>
<li><strong>Có công bố danh sách mặt hàng nhận và không nhận.</strong> Nơi nào cũng nói "gì cũng gửi được" là dấu hiệu xấu.</li>
<li><strong>Có biên nhận ghi rõ số ký, loại hàng, cước và điều khoản đền bù.</strong> Nhận hàng mà không có giấy tờ gì thì lúc mất hàng không dựa vào đâu.</li>
<li><strong>Có mã theo dõi tra được.</strong> Không phải kiểu "để anh hỏi bên kho rồi báo lại".</li>
<li><strong>Nói được quy trình khi hàng bị giữ.</strong> Xem mục dưới.</li>
</ul>
<h2>Hàng bị hải quan Mỹ giữ thì làm gì?</h2>
<p>Chuyện này có thật và không hiếm với thực phẩm. Quy trình thường gặp:</p>
<ol>
<li><strong>Nhận thông báo.</strong> Hải quan hoặc FDA gửi thông báo về lô hàng, nêu lý do giữ.</li>
<li><strong>Bổ sung thông tin.</strong> Thường là khai báo thành phần, mục đích sử dụng, giấy tờ kèm. Đơn vị vận chuyển làm bước này giúp bạn nếu họ nhận trách nhiệm đó.</li>
<li><strong>Ba khả năng:</strong> hàng được thả tiếp, hàng bị trả về, hoặc hàng bị tiêu huỷ. Nhóm thực phẩm tươi và thịt hay rơi vào khả năng thứ ba.</li>
<li><strong>Chi phí phát sinh.</strong> Hỏi trước bên nào chịu, vì lưu kho và trả hàng đều tốn tiền.</li>
</ol>
<p>Cách giảm rủi ro: khai thật, đóng gói còn nguyên nhãn mác, không nhét hàng cấm chung thùng, và tách riêng nhóm rủi ro cao ra khỏi kiện đồ thường.</p>
<h2>Giấy tờ và thông tin cần chuẩn bị</h2>
<ul>
<li>Tên, địa chỉ đầy đủ và <strong>số điện thoại người nhận ở Mỹ</strong> — thiếu số điện thoại là hàng dễ nằm kho.</li>
<li>Danh sách hàng trong thùng, càng cụ thể càng tốt. "Thực phẩm khô" kém hơn "bánh tráng 2kg, cà phê 1kg, tôm khô 0,5kg".</li>
<li>Với hàng kinh doanh: hoá đơn thương mại, giá trị khai báo, mã hàng nếu có.</li>
<li>Số điện thoại người gửi để bên vận chuyển liên hệ khi phát sinh.</li>
</ul>
<h2>Lịch bay và giờ chốt hàng</h2>
<p>Thời gian vận chuyển tính từ khi hàng <em>rời Việt Nam</em>, không phải từ lúc bạn giao hàng. Hàng chốt sau giờ cut-off sẽ đi chuyến hôm sau, nên gửi gấp thì nên hỏi giờ chốt trong ngày trước khi mang hàng tới. Cuối tuần và ngày lễ hai đầu đều không tính vào ngày làm việc.</p>
<h2>Muốn biết cước kiện hàng của mình?</h2>""")

# ─────────────────────────────── Bài 2 ───────────────────────────────
THEM["gui-hang-di-my-qua-buu-dien-hang-quoc-te-hay-dai-ly-chuyen-tuyen"] = ("<h2>Cước bao nhiêu?</h2>", f"""<h2>Ba tình huống thường gặp</h2>
<h3>Mẹ gửi thùng đồ ăn cho con du học</h3>
<p>Thùng này thường có mì gói, bánh tráng, ruốc, cà phê, thuốc cảm, có khi thêm quần áo. Đặc điểm: nhiều món lặt vặt, tổng cân trung bình, không gấp lắm nhưng muốn chắc chắn tới nơi. <strong>Chọn đại lý chuyên tuyến</strong> — họ gom kiện, đóng gói hộ, hút chân không đồ khô và biết món nào nên bỏ ra. Gửi qua hãng quốc tế thì cước đội lên nhiều mà thực phẩm lại bị hạn chế.</p>
<h3>Công ty gửi hàng mẫu cho đối tác Mỹ</h3>
<p>Đặc điểm: nhẹ, gấp, cần chứng từ để đối tác làm thủ tục. <strong>Chọn hãng chuyển phát quốc tế</strong> — chứng từ chuẩn, theo dõi từng mốc, giao đúng hẹn. Đây là trường hợp trả thêm tiền là xứng đáng.</p>
<h3>Gia đình gửi quà Tết cho người thân</h3>
<p>Đặc điểm: nhiều thùng, nặng, có bánh mứt và đồ dễ vỡ, gửi trước Tết nên đụng mùa cao điểm. <strong>Chọn đại lý chuyên tuyến và gửi sớm</strong> — cước mềm hơn với kiện nặng, có bao thuế thì người nhà bên đó không phải lo gì. Gửi sát Tết dễ kẹt chuyến.</p>
{IMG("banh-keo-dac-san.jpg", "Bánh kẹo đặc sản đóng thùng gửi đi Mỹ dịp Tết", "Quà Tết nên gửi sớm 3–4 tuần để tránh mùa cao điểm")}
<h2>Giấy tờ và thông tin cần có</h2>
<ul>
<li>Địa chỉ người nhận đủ số nhà, đường, thành phố, viết tắt bang, ZIP 5 số.</li>
<li><strong>Số điện thoại người nhận kiểu Mỹ</strong> — bắt buộc, bên giao gọi trước khi tới.</li>
<li>Danh sách hàng trong thùng, ghi cụ thể từng món thay vì ghi chung.</li>
<li>Hàng kinh doanh thì thêm hoá đơn thương mại và giá trị khai báo.</li>
</ul>
<h2>Gửi quà gia đình khác gửi hàng kinh doanh chỗ nào?</h2>
<p>Hai loại này đi hai đường khác nhau ngay từ khâu khai báo. Quà gia đình khai theo dạng hàng cá nhân, giá trị thấp, không nhằm bán lại. Hàng kinh doanh cần hoá đơn, giá trị khai đúng và có thể phải nộp thuế theo diện thương mại. Khai sai loại là nguồn gốc của phần lớn rắc rối ở đầu nhập — khai quà cho lô hàng bán lại thì rủi ro bị giữ và phạt cao hơn nhiều so với khoản thuế lẽ ra phải đóng.</p>
<h2>Đóng gói: ba điều quyết định hàng có tới nơi nguyên vẹn</h2>
<ol>
<li><strong>Hút chân không đồ khô và đồ có mùi.</strong> Mắm, khô, ruốc nên bọc hai lớp và để riêng, tránh ám sang quần áo.</li>
<li><strong>Chèn kín khoảng trống.</strong> Thùng còn chỗ trống là hàng xê dịch và móp trong quá trình trung chuyển.</li>
<li><strong>Giữ nguyên nhãn mác.</strong> Hàng còn nhãn, còn hạn sử dụng rõ ràng thì qua hải quan nhẹ nhàng hơn nhiều so với hàng sang chiết vào hộp không tên.</li>
</ol>
<h2>Câu hỏi nên hỏi trước khi chốt</h2>
<ol>
<li><strong>Tổng cộng tôi trả bao nhiêu, người nhận có phải trả gì nữa không?</strong> Đây là câu quan trọng nhất và là chỗ khác nhau lớn nhất giữa ba hình thức.</li>
<li><strong>Món này bên mình có nhận không?</strong> Hỏi đích danh, đừng hỏi "đồ ăn có gửi được không".</li>
<li><strong>Tính theo cân thực hay cân quy đổi?</strong></li>
<li><strong>Bao lâu tới, tính từ lúc nào?</strong> Từ lúc giao hàng hay từ lúc hàng rời Việt Nam.</li>
<li><strong>Có mã theo dõi không, tra ở đâu?</strong></li>
<li><strong>Hàng bị giữ thì ai xử lý?</strong></li>
<li><strong>Mất hàng đền thế nào?</strong></li>
</ol>
<h2>Những hiểu lầm thường gặp</h2>
<ul>
<li><strong>"Hãng lớn thì chắc chắn không bị giữ."</strong> Không đúng. Hải quan Mỹ xét theo mặt hàng và hồ sơ khai báo, không xét theo tên hãng vận chuyển.</li>
<li><strong>"Gửi bưu điện lúc nào cũng rẻ nhất."</strong> Đúng với bưu phẩm nhẹ. Với thùng nặng thì đại lý gom hàng thường mềm hơn, chưa kể còn bao thuế.</li>
<li><strong>"Đại lý tư nhân thì không có tracking."</strong> Đơn vị làm ăn đàng hoàng đều có mã theo dõi tới khi người nhận ký nhận. Không có mã là dấu hiệu nên tránh.</li>
<li><strong>"Cứ khai giá trị thấp cho đỡ thuế."</strong> Khai sai giá trị là rủi ro bị giữ và bị phạt, thường đắt hơn nhiều so với khoản thuế lẽ ra phải đóng.</li>
</ul>
<h2>Cước bao nhiêu?</h2>""")

# ─────────────────────────────── Bài 3 ───────────────────────────────
THEM["gui-do-cho-du-hoc-sinh-va-viet-kieu-o-my"] = ("<h2>Cước bao nhiêu?</h2>", f"""<h2>Đóng gói từng nhóm hàng</h2>
<h3>Đồ khô và đặc sản</h3>
<p>Hút chân không từng gói nhỏ thay vì một túi to — vừa gọn vừa dễ chia cho người nhận. Giữ nguyên bao bì gốc có nhãn và hạn sử dụng; hàng sang chiết vào hộp không tên là nhóm hay bị hỏi nhất ở đầu nhập.</p>
<h3>Đồ có mùi mạnh</h3>
<p>Mắm, khô, ruốc, sầu riêng sấy nên bọc hai lớp và đóng riêng một góc thùng, kê giấy quanh. Không để chung ngăn với quần áo hay chăn màn.</p>
<h3>Chai lọ và đồ dễ vỡ</h3>
<p>Ưu tiên chai nhựa thay chai thuỷ tinh khi có lựa chọn. Bọc từng chai bằng xốp nổ, buộc miệng chai bằng màng bọc trước khi vặn nắp để chống rò, rồi đặt đứng ở giữa thùng, chèn quần áo xung quanh.</p>
<h3>Thuốc men</h3>
<p>Để nguyên vỉ, nguyên hộp, kèm toa nếu có. Gửi số lượng vừa đủ dùng cho một người thay vì gửi lô lớn — lô lớn dễ bị coi là hàng kinh doanh.</p>
{IMG("muc-ca-kho.jpg", "Mực khô cá khô hút chân không gửi đi Mỹ", "Đồ khô nên hút chân không từng gói nhỏ, giữ nguyên nhãn mác")}
<h2>Gửi gì theo từng mùa</h2>
<ul>
<li><strong>Đầu năm học (tháng 8–9):</strong> đồ khô để dành, mì, ruốc, gia vị nấu ăn, thuốc cảm sốt thông thường, chăn mỏng.</li>
<li><strong>Mùa lạnh (tháng 11–2):</strong> quần áo ấm, chăn — nhóm này nhẹ mà cồng kềnh nên nén thật gọn, hút chân không quần áo giúp giảm cước đáng kể.</li>
<li><strong>Giáng sinh:</strong> bánh kẹo, cà phê, trà, đồ lưu niệm. Gửi trước 2–3 tuần.</li>
<li><strong>Tết:</strong> bánh mứt, kẹo dừa, bánh pía, trà, đồ trang trí. Gửi trước 3–4 tuần.</li>
</ul>
<h2>Lưu ý riêng cho du học sinh</h2>
<ul>
<li><strong>Ký túc xá có giờ nhận hàng.</strong> Nhiều trường chỉ nhận trong giờ hành chính và giữ ở phòng bưu phẩm — nên báo trước cho con.</li>
<li><strong>Ghi tên đúng như trên giấy tờ trường cấp.</strong> Tên gọi ở nhà không khớp tên trong hệ thống là hàng bị trả.</li>
<li><strong>Nghỉ hè và nghỉ lễ dài</strong> thì ký túc xá có thể đóng cửa — đừng gửi vào các mốc này.</li>
<li><strong>Đổi chỗ ở giữa kỳ</strong> là chuyện thường; xác nhận lại địa chỉ ngay trước khi gửi.</li>
</ul>
<h2>Vì sao hàng hay bị giữ, và tránh thế nào</h2>
<p>Thực phẩm vào Mỹ chịu quản lý của FDA. Mấy lý do hay gặp nhất khiến kiện hàng bị hỏi tới:</p>
<ol>
<li><strong>Sản phẩm từ thịt</strong> — nhóm bị siết chặt nhất, kể cả đã nấu chín và hút chân không.</li>
<li><strong>Hàng không nhãn mác</strong>, không rõ thành phần và hạn dùng.</li>
<li><strong>Số lượng lớn một mặt hàng</strong>, trông như hàng bán lại chứ không phải quà.</li>
<li><strong>Khai chung chung.</strong> Ghi "thực phẩm" cho cả thùng thì hải quan phải mở ra xem.</li>
</ol>
<p>Cách tránh: khai đúng và chi tiết từng món, giữ nguyên nhãn, chia nhỏ số lượng, và tách nhóm rủi ro cao ra khỏi thùng đồ thường để nếu có bị giữ thì chỉ mất phần đó.</p>
<h2>Bảng kiểm trước khi đóng thùng</h2>
<ol>
<li>Đã tra món mình gửi trong <a href="/hang-gui-duoc/my">bảng mặt hàng đi Mỹ</a> chưa?</li>
<li>Đồ có mùi đã bọc riêng chưa?</li>
<li>Chai lọ đã chống rò và chèn kín chưa?</li>
<li>Đã ghi danh sách từng món trong thùng chưa?</li>
<li>Địa chỉ có đủ ZIP và số điện thoại người nhận chưa?</li>
<li>Thùng còn chỗ trống không — chèn thêm cho chặt.</li>
<li>Đã chụp ảnh hàng trước khi đóng chưa? Có gì tranh cãi còn có cái mà đối chiếu.</li>
</ol>
<h2>Gợi ý danh sách đồ gửi cho con du học</h2>
<p>Danh sách dưới đây gom từ những thùng hàng thực tế đi Mỹ, toàn nhóm nhận gửi bình thường:</p>
<ul>
<li><strong>Đồ ăn liền:</strong> mì gói, phở gói, cháo gói, bún khô, miến.</li>
<li><strong>Gia vị nấu ăn:</strong> hạt nêm, bột canh, tiêu, ớt bột, gia vị dạng bột — ưu tiên dạng bột thay dạng chai lỏng để khỏi phụ thu.</li>
<li><strong>Đồ ăn vặt quê:</strong> bánh tráng, kẹo dừa, mứt, hạt điều, hạt sen, ô mai.</li>
<li><strong>Đồ khô để dành:</strong> tôm khô, cá khô, mực khô, nấm khô.</li>
<li><strong>Đồ uống:</strong> cà phê, trà.</li>
<li><strong>Đồ dùng:</strong> quần áo, chăn mỏng, đồ dùng học tập, sách vở.</li>
</ul>
<p>Nhóm nên hỏi trước vì có phụ thu hoặc rủi ro: ruốc thịt, chà bông, khô bò, lạp xưởng, sữa, thuốc tây. Nhóm không nhận: rau củ trái cây tươi, pin rời và sạc dự phòng, rượu bia, thuốc lá.</p>
<h2>Gửi bao lâu một lần cho hợp lý</h2>
<p>Gom một thùng lớn gửi vài tháng một lần thường lợi hơn gửi nhiều thùng nhỏ liên tục, vì kiện càng nặng thì đơn giá mỗi ký càng giảm, mà mỗi lần gửi đều có phần chi phí cố định. Nhiều gia đình chọn nhịp: một thùng đầu năm học, một thùng trước Giáng sinh, một thùng trước Tết.</p>
<h2>Người nhận cần chuẩn bị gì</h2>
<ul>
<li><strong>Để ý điện thoại</strong> trong ngày dự kiến giao — bên giao hàng gọi trước khi tới.</li>
<li><strong>Chung cư có phòng nhận bưu phẩm</strong> thì hỏi trước giờ mở cửa.</li>
<li><strong>Nếu hàng bị giữ</strong>, báo ngay cho người gửi ở Việt Nam để bên vận chuyển vào xử lý, đừng tự trả lời thông báo khi chưa rõ.</li>
<li><strong>Kiểm hàng khi nhận</strong>, chụp ảnh thùng nếu thấy móp hay rách trước khi mở.</li>
</ul>
<h2>Cước bao nhiêu?</h2>""")

# ─────────────────────────────── Bài 4 ───────────────────────────────
THEM["cuoc-gui-hang-di-my-tinh-the-nao"] = ("<h2>Bốn cách giảm cước</h2>", f"""<h2>Thêm vài ví dụ cho quen cách tính</h2>
<table><thead><tr><th>Kiện hàng</th><th>Kích thước</th><th>Cân thực</th><th>Cân quy đổi</th><th>Tính theo</th></tr></thead><tbody>
<tr><td>Thùng đồ khô, đặc sản</td><td>40 × 30 × 30 cm</td><td>12kg</td><td>7,2kg</td><td><strong>12kg</strong> (cân thực)</td></tr>
<tr><td>Thùng chăn gối</td><td>60 × 40 × 50 cm</td><td>6kg</td><td>24kg</td><td><strong>24kg</strong> (quy đổi)</td></tr>
<tr><td>Thùng quần áo nén</td><td>50 × 40 × 30 cm</td><td>11kg</td><td>12kg</td><td><strong>12kg</strong> (quy đổi)</td></tr>
<tr><td>Thùng bánh phồng, snack</td><td>50 × 40 × 40 cm</td><td>4kg</td><td>16kg</td><td><strong>16kg</strong> (quy đổi)</td></tr>
<tr><td>Thùng sách vở</td><td>35 × 25 × 25 cm</td><td>15kg</td><td>4,4kg</td><td><strong>15kg</strong> (cân thực)</td></tr>
</tbody></table>
<p>Nhìn bảng sẽ thấy quy luật: <strong>hàng đặc và nặng thì tính theo cân thực, hàng xốp và cồng kềnh thì tính theo kích thước</strong>. Biết mình thuộc nhóm nào là biết nên nén hay nên gom.</p>
<h2>Nhóm hàng hay bị tính theo kích thước</h2>
<ul>
<li>Chăn, gối, mền, thú nhồi bông.</li>
<li>Bánh phồng tôm, snack, mì ly, bim bim — nhẹ mà chiếm chỗ.</li>
<li>Đồ nhựa gia dụng, rổ rá, hộp đựng.</li>
<li>Quần áo dày chưa nén, áo khoác mùa đông.</li>
<li>Hộp quà có nhiều giấy gói và hộp lồng hộp.</li>
</ul>
{IMG("kien-hang-so-luong-lon.jpg", "Nhiều kiện hàng chuẩn bị gửi đi Mỹ", "Gom nhiều món vào một thùng thường lợi hơn chia nhiều thùng nhỏ")}
<h2>Các loại phụ thu và vì sao có</h2>
<ul>
<li><strong>Phụ thu hàng lỏng:</strong> chai lọ cần bọc chống rò và đóng thùng riêng, nếu rò thì hỏng cả lô nên phải xử lý kỹ.</li>
<li><strong>Phụ thu hàng rủi ro đầu nhập:</strong> nhóm thịt, sữa, thuốc — cần khai báo thêm và có khả năng phát sinh xử lý ở đầu Mỹ.</li>
<li><strong>Phụ thu hàng giá trị cao:</strong> đồng hồ, nước hoa, thiết bị — liên quan tới khai giá trị và mức đền bù.</li>
<li><strong>Phụ thu hàng đông lạnh:</strong> phải giữ nhiệt suốt hành trình, chỉ đi được dịch vụ nhanh.</li>
<li><strong>Phụ thu mùa cao điểm:</strong> trước Giáng sinh và Tết, chỗ trên máy bay khan hiếm.</li>
</ul>
<p>Mức phụ thu từng nhóm ghi trong <a href="/hang-gui-duoc/my">bảng mặt hàng đi Mỹ</a>, hoặc gọi {HL} để được báo đúng món của bạn.</p>
<h2>Đường bay và đường biển khác nhau thế nào</h2>
<table><thead><tr><th></th><th>Đường bay</th><th>Đường biển</th></tr></thead><tbody>
<tr><td>Thời gian</td><td>Ngày</td><td>Tuần tới tháng</td></tr>
<tr><td>Hợp với</td><td>Hàng lẻ, đồ ăn, quà, hàng gấp</td><td>Khối lượng lớn, đồ đạc nhà cửa, hàng không gấp</td></tr>
<tr><td>Chi phí cố định hai đầu</td><td>Thấp</td><td>Cao — nên hàng ít thì không lợi</td></tr>
<tr><td>Thực phẩm</td><td>Đi được, tuỳ nhóm</td><td>Hạn chế nhiều hơn vì thời gian dài</td></tr>
</tbody></table>
<p>Chi tiết xem bài <a href="/tin-tuc/gui-hang-duong-bien-di-my">gửi hàng đường biển đi Mỹ</a>.</p>
<h2>Những khoản hay bị quên khi so giá</h2>
<ol>
<li><strong>Thuế đầu nhập Mỹ</strong> — nơi bao trọn gói và nơi không bao là hai con số cuối cùng rất khác nhau.</li>
<li><strong>Phí đóng gói</strong> — có nơi tính, có nơi miễn phí.</li>
<li><strong>Phí lấy hàng tận nơi.</strong></li>
<li><strong>Phụ thu theo nhóm hàng.</strong></li>
<li><strong>Phí giao vùng xa</strong> — địa chỉ ngoài thành phố lớn thường cộng thêm cả thời gian lẫn chi phí.</li>
</ol>
<p>Khi hỏi giá ở bất kỳ đâu, hãy hỏi "tổng cộng tôi phải trả bao nhiêu và người nhận có phải trả gì nữa không" thay vì chỉ hỏi giá một ký.</p>
<h2>Đi nhanh hay đi tiết kiệm?</h2>
<p>Cùng một kiện hàng, chọn dịch vụ khác nhau thì cước khác nhau. Cách chọn:</p>
<ul>
<li><strong>Đi nhanh</strong> khi hàng có hạn sử dụng ngắn, đồ dễ hút ẩm, hàng đông lạnh, hoặc cần kịp dịp lễ.</li>
<li><strong>Đi tiết kiệm</strong> khi là đồ khô để dành, quần áo, đồ dùng, sách vở — những thứ chậm vài ngày không sao.</li>
</ul>
<p>Lưu ý cả hai đều tính bằng <strong>ngày làm việc</strong> và tính từ khi hàng rời Việt Nam, nên gửi sát cuối tuần thì cộng thêm ngày nghỉ.</p>
<h2>Vì sao hai người gửi cùng số ký mà trả khác nhau</h2>
<ol>
<li><strong>Kích thước thùng khác nhau</strong> — người đóng gọn thì tính theo cân thực, người đóng phồng thì bị tính theo quy đổi.</li>
<li><strong>Loại hàng khác nhau</strong> — có nhóm kèm phụ thu, có nhóm không.</li>
<li><strong>Dịch vụ khác nhau</strong> — đi nhanh và đi tiết kiệm không cùng giá.</li>
<li><strong>Địa chỉ nhận khác nhau</strong> — vùng xa ngoài thành phố lớn cộng thêm thời gian và chi phí.</li>
<li><strong>Bao thuế hay không</strong> — đây là khác biệt lớn nhất nhưng hay bị bỏ quên khi so giá.</li>
</ol>
<h2>Cân quy đổi tính với thùng không vuông vức thì sao</h2>
<p>Đo theo chiều dài nhất của mỗi cạnh, tính cả phần nhô ra. Kiện tròn hoặc hình dạng lạ thì đo theo khối hộp nhỏ nhất bao được nó. Vali, thùng xốp, két nhựa đều tính theo cách này. Nếu không chắc, chụp ảnh kèm thước và gửi qua Zalo {HL} để được đo giúp.</p>
<h2>Bốn cách giảm cước</h2>""")

# ─────────────────────────────── ghi ───────────────────────────────
con = sqlite3.connect(DB, timeout=30)
TIEN = re.compile(r"\d{1,3}[.,]\d{3}\s*(đ|vnd)|\d+\s*(triệu|tr)\b", re.I)
dem = lambda c: len(html.unescape(re.sub(r"<[^>]+>", " ", c)).split())

for slug, (moc, them) in THEM.items():
    row = con.execute("select content from Article where slug=?", (slug,)).fetchone()
    if not row:
        print(f"!! không thấy {slug}"); continue
    c = row[0]
    if moc not in c:
        print(f"!! không thấy mốc chèn trong {slug}"); continue
    if them[:60] in c:
        print(f"   {slug}: đã bổ sung rồi, bỏ qua"); continue
    moi = c.replace(moc, them, 1)
    xau = TIEN.search(html.unescape(re.sub(r"<[^>]+>", " ", them)))
    print(f"{slug}\n   {dem(c)} → {dem(moi)} chữ" + (f"  ⚠️ LỌT SỐ TIỀN: {xau.group(0)}" if xau else "  ✓ không có số tiền"))
    if xau or not WRITE:
        continue
    con.execute("update Article set content=? where slug=?", (moi, slug))
    con.commit()
    print("   ĐÃ GHI")

print("\n(chạy thử — thêm --ghi để ghi thật)" if not WRITE else "\nXONG")
