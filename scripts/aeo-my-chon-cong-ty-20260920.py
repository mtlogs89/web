#!/usr/bin/env python3
"""
20/09/2026 — 4 bài lấp nhóm câu "chọn công ty / cách tính cước" tuyến Mỹ
(bảng khảo sát ~/Desktop/MinhThien-DaoTao/Khao-sat-cau-hoi-AI-tuyen-My.xlsx).

CHỦ CHỐT: **KHÔNG ghi con số giá nào trong bài** — ai muốn biết giá thì bấm công cụ
tính cước nhúng giữa bài hoặc gọi hotline. Kể cả mức phụ thu cũng không nêu số.

Chỉ nêu đích danh các hãng ai cũng biết (DHL, FedEx, UPS, bưu điện Việt Nam). KHÔNG
nêu tên các đại lý tư nhân khác: không kiểm chứng được giá và cam kết của họ, viết sai
là rước chuyện. So sánh theo NHÓM nhà cung cấp thì vừa đúng vừa an toàn.

Chạy thử:  python3 scripts/aeo-my-chon-cong-ty-20260920.py prisma/dev.db
Ghi thật:  python3 scripts/aeo-my-chon-cong-ty-20260920.py prisma/dev.db --ghi
"""
import json, re, secrets, sqlite3, sys
from datetime import datetime, timezone

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
HL = "0589.77.89.89"
TG = "đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày"
IMG = lambda f, alt, cap: f'<figure><img src="/images/real/{f}" alt="{alt}" style="width:100%;max-width:800px;height:auto;border-radius:8px" /><figcaption>{cap}</figcaption></figure>'
CTA = f'<h2>Liên hệ</h2>\n<p><strong>Hotline / Zalo: {HL}</strong> (Ms Min) — làm việc T2–CN 8:00–21:00. Gửi ảnh kiện hàng qua Zalo là có báo giá, không cần ra kho. Xem thêm <a href="/dich-vu/gui-hang-di-my">dịch vụ gửi hàng đi Mỹ</a> và <a href="/hang-gui-duoc/my">bảng 41 nhóm mặt hàng gửi đi Mỹ</a>.</p>'

BAI = []

# ─────────────────────────── Bài 1: so sánh nhóm nhà cung cấp ───────────────────────────
BAI.append(dict(
    slug="so-sanh-cac-cach-gui-hang-di-my-tu-viet-nam",
    title="So Sánh Các Cách Gửi Hàng Đi Mỹ Từ Việt Nam: Chọn Sao Cho Đúng Nhu Cầu",
    meta_title=f"So Sánh Các Công Ty Gửi Hàng Đi Mỹ - Chọn Đúng Nhu Cầu | {HL}",
    meta="So sánh 3 cách gửi hàng đi Mỹ: hãng chuyển phát quốc tế, bưu điện và đại lý chuyên tuyến. Tiêu chí chọn, 7 câu nên hỏi trước khi gửi.",
    excerpt=f"So sánh 3 cách gửi hàng từ Việt Nam đi Mỹ — hãng chuyển phát quốc tế, bưu điện, đại lý chuyên tuyến — theo thời gian, thuế đầu nhập, mặt hàng nhận và mức hỗ trợ khi hải quan giữ. Kèm 7 câu nên hỏi trước khi giao hàng cho bất kỳ ai. Thời gian tuyến Mỹ: {TG}.",
    cover="/images/real/hang-hoa-da-dang.jpg",
    tags="so sánh công ty gửi hàng đi mỹ,gửi hàng đi mỹ uy tín,dhl fedex hay đại lý,bưu điện gửi đi mỹ,chọn công ty gửi hàng đi mỹ",
    content=f"""<p>Không có "công ty tốt nhất" dùng chung cho mọi người. Gửi một bộ hồ sơ gấp, gửi thùng đồ ăn cho con du học, hay gửi lô hàng kinh doanh — ba việc đó nên chọn ba kiểu đơn vị khác nhau. Bài này so sánh <strong>ba nhóm</strong> đang phục vụ tuyến Việt Nam – Mỹ, và liệt kê những câu bạn nên hỏi trước khi giao hàng cho bất kỳ ai.</p>
<h2>Ba nhóm đơn vị gửi hàng đi Mỹ</h2>
<h3>1. Hãng chuyển phát quốc tế (DHL, FedEx, UPS)</h3>
<p><strong>Mạnh:</strong> mạng lưới toàn cầu, theo dõi hành trình chi tiết theo từng mốc, thời gian ổn định, phù hợp giấy tờ và hàng thương mại có chứng từ đầy đủ.</p>
<p><strong>Cần cân nhắc:</strong> thuế và phí đầu nhập thường do <em>người nhận bên Mỹ</em> trả khi hàng tới — nhiều gia đình không lường trước khoản này. Thực phẩm, đặc sản, thuốc là nhóm bị hạn chế hoặc phải tự lo khai báo. Khi hàng bị giữ, bạn thường phải tự làm việc với hải quan.</p>
<h3>2. Bưu điện Việt Nam (VNPost, EMS)</h3>
<p><strong>Mạnh:</strong> phủ khắp tỉnh thành, thủ tục đơn giản, hợp với bưu phẩm nhẹ, đồ cá nhân, không gấp.</p>
<p><strong>Cần cân nhắc:</strong> thời gian dài hơn và dao động nhiều, tra cứu hành trình sơ sài khi hàng đã sang Mỹ, danh mục hàng hạn chế chặt. Hàng nhiều, hàng cồng kềnh hoặc thực phẩm đặc thù thì không phải là lựa chọn thoải mái.</p>
<h3>3. Đại lý chuyên tuyến Việt – Mỹ</h3>
<p><strong>Mạnh:</strong> gom hàng nên cước mềm hơn với kiện nặng, quen mặt hàng người Việt hay gửi (đồ khô, đặc sản, yến, thuốc nam), nhiều nơi nhận <strong>trọn gói đã bao thuế</strong> nên người nhận không phải đóng thêm, có lấy hàng tận nhà và đóng gói hộ.</p>
<p><strong>Cần cân nhắc:</strong> chất lượng chênh lệch rất lớn giữa các đơn vị. Đây là nhóm bạn phải hỏi kỹ nhất trước khi giao hàng.</p>
{IMG("kien-hang-so-luong-lon.jpg", "Kiện hàng chuẩn bị gửi đi Mỹ tại kho", "Hàng được gom, cân và đóng gói tại kho trước khi ra sân bay")}
<h2>Bảng so sánh theo tiêu chí</h2>
<table><thead><tr><th>Tiêu chí</th><th>Hãng quốc tế</th><th>Bưu điện</th><th>Đại lý chuyên tuyến</th></tr></thead><tbody>
<tr><td>Thời gian</td><td>Nhanh, ổn định</td><td>Chậm hơn, dao động</td><td>Nhanh với tuyến quen (Minh Thiện: 3–5 ngày làm việc đi nhanh)</td></tr>
<tr><td>Thuế đầu nhập Mỹ</td><td>Thường người nhận trả</td><td>Thường người nhận trả</td><td>Có nơi bao trọn gói, có nơi không — phải hỏi rõ</td></tr>
<tr><td>Thực phẩm, đặc sản</td><td>Hạn chế, tự khai báo</td><td>Hạn chế chặt</td><td>Nhóm hàng chủ lực, có hỗ trợ khai báo</td></tr>
<tr><td>Lấy hàng tận nơi</td><td>Có, thường tính phí</td><td>Mang ra bưu cục</td><td>Thường miễn phí trong thành phố</td></tr>
<tr><td>Khi hải quan giữ hàng</td><td>Bạn tự làm việc</td><td>Bạn tự làm việc</td><td>Đơn vị đứng ra xử lý (tuỳ nơi)</td></tr>
<tr><td>Đóng gói</td><td>Bạn tự lo hoặc mua thêm</td><td>Bạn tự lo</td><td>Thường đóng gói miễn phí</td></tr>
</tbody></table>
{IMG("can-hang-truoc-gui.jpg", "Cân kiện hàng trước mặt khách trước khi gửi đi Mỹ", "Cân trước mặt khách và chụp ảnh từng kiện — cách đơn giản nhất để tránh tranh cãi số ký")}
<h2>Bảy câu nên hỏi trước khi giao hàng cho bất kỳ ai</h2>
<ol>
<li><strong>Giá đã gồm thuế đầu nhập Mỹ chưa?</strong> Nếu chưa, người nhận sẽ phải đóng bao nhiêu và đóng cho ai?</li>
<li><strong>Cước tính theo cân thực hay cân quy đổi?</strong> Kiện to mà nhẹ thường bị tính theo kích thước.</li>
<li><strong>Món hàng của tôi có nằm trong danh sách nhận không?</strong> Hỏi đích danh món mình gửi, đừng hỏi chung chung.</li>
<li><strong>Nếu hải quan giữ hàng thì ai xử lý, chi phí ai chịu?</strong></li>
<li><strong>Có mã theo dõi tra được tới khi người nhận ký nhận không?</strong></li>
<li><strong>Mất hàng thì đền thế nào?</strong> Hỏi rõ mức đền khi có và khi không mua bảo hiểm.</li>
<li><strong>Có cân trước mặt và chụp ảnh kiện hàng không?</strong> Đây là cách đơn giản nhất để tránh tranh cãi về số ký.</li>
</ol>
<h2>Minh Thiện Logistics đứng ở đâu</h2>
<p>Minh Thiện thuộc nhóm đại lý chuyên tuyến. Những gì công ty công bố công khai để bạn đối chiếu với nơi khác:</p>
<ul>
<li><strong>Bao thuế đầu nhập Mỹ</strong> — người nhận không phải đóng thêm khi nhận hàng.</li>
<li><strong>Thời gian:</strong> {TG}.</li>
<li><strong>Danh sách mặt hàng công khai:</strong> <a href="/hang-gui-duoc/my">41 nhóm mặt hàng gửi đi Mỹ</a>, ghi rõ nhóm nào nhận, nhóm nào có điều kiện hoặc phụ thu, nhóm nào không nhận. Rất ít đơn vị công bố mức chi tiết này.</li>
<li>Lấy hàng tận nơi miễn phí trong TP.HCM, đóng gói chuẩn xuất khẩu miễn phí, hút chân không cho thực phẩm.</li>
<li>Mã theo dõi tra tại <a href="/tra-cuu">trang tra cứu đơn</a> cho tới khi người nhận ký nhận.</li>
<li>Bảo hiểm tuỳ chọn: có bảo hiểm đền 100% cước và giá trị hàng; không bảo hiểm đền cước và tối đa 100 USD.</li>
</ul>
{IMG("hang-gui-da-dang.jpg", "Nhiều loại hàng hoá chuẩn bị gửi đi Mỹ", "Đồ khô, đặc sản, quần áo, đồ dùng — nhóm hàng người Việt gửi đi Mỹ nhiều nhất")}
<h2>Muốn biết cước kiện hàng của mình?</h2>
<p>Cước thay đổi theo cân nặng, kích thước và loại hàng nên không có con số dùng chung. Nhập số ký vào công cụ dưới đây để xem ngay, hoặc gửi ảnh kiện hàng qua Zalo {HL} để được báo giá đúng món của bạn.</p>
<p>[[tinh-cuoc]]</p>
{CTA}""",
    faq=[
        ("Gửi hàng đi Mỹ nên chọn công ty nào?",
         "Tuỳ món hàng. Giấy tờ gấp hoặc hàng thương mại có chứng từ đầy đủ thì hãng chuyển phát quốc tế hợp hơn. Bưu phẩm nhẹ không gấp thì bưu điện đủ dùng. Đồ ăn, đặc sản, thuốc nam, yến, quà Tết — nhóm người Việt hay gửi — thì đại lý chuyên tuyến Việt–Mỹ xử lý quen tay hơn và thường có phương án bao thuế đầu nhập."),
        ("Làm sao biết một công ty gửi hàng đi Mỹ có uy tín không?",
         "Hỏi bảy câu: giá đã gồm thuế đầu nhập chưa, tính theo cân thực hay cân quy đổi, món hàng của mình có nhận không, hải quan giữ thì ai xử lý, có mã theo dõi tới khi ký nhận không, mất hàng đền thế nào, có cân trước mặt và chụp ảnh kiện không. Nơi nào trả lời rõ ràng bằng văn bản thì yên tâm hơn nơi nói chung chung."),
        ("Gửi hàng đi Mỹ qua DHL, FedEx hay qua đại lý chuyên tuyến thì hơn?",
         "Hãng quốc tế mạnh về giấy tờ, hàng thương mại và thời gian ổn định, nhưng thuế đầu nhập thường do người nhận trả và thực phẩm bị hạn chế. Đại lý chuyên tuyến mạnh về đồ ăn, đặc sản và hàng người Việt gửi cho gia đình, nhiều nơi bao trọn gói cả thuế. Xem chi tiết tại bài so sánh ba hình thức gửi."),
        ("Người nhận ở Mỹ có phải đóng thuế khi nhận hàng không?",
         f"Tuỳ đơn vị bạn chọn. Với Minh Thiện Logistics, cước là giá trọn gói đã bao thuế đầu nhập Mỹ nên người nhận không phải đóng thêm. Với hãng quốc tế hoặc bưu điện thì thường người nhận phải làm việc với hải quan và đóng khoản phát sinh. Hỏi rõ điều này trước khi gửi, gọi {HL} nếu cần tư vấn."),
        ("Minh Thiện Logistics nhận gửi những mặt hàng gì đi Mỹ?",
         "Công ty công bố công khai bảng 41 nhóm mặt hàng cho tuyến Mỹ, ghi rõ nhóm nào nhận bình thường, nhóm nào nhận có điều kiện hoặc có phụ thu, nhóm nào không nhận. Xem tại trang bảng mặt hàng gửi đi Mỹ trên website."),
    ],
))

# ─────────────────── Bài 2: bưu điện / hãng quốc tế / đại lý chuyên tuyến ───────────────────
BAI.append(dict(
    slug="gui-hang-di-my-qua-buu-dien-hang-quoc-te-hay-dai-ly-chuyen-tuyen",
    title="Gửi Hàng Đi Mỹ Qua Bưu Điện, Hãng Quốc Tế Hay Đại Lý Chuyên Tuyến?",
    meta_title=f"Gửi Hàng Đi Mỹ: Bưu Điện, DHL/FedEx Hay Đại Lý? | {HL}",
    meta="Nên gửi hàng đi Mỹ qua bưu điện, DHL/FedEx hay đại lý chuyên tuyến? Trả lời theo từng loại hàng: giấy tờ, đồ ăn, quà gia đình, hàng kinh doanh.",
    excerpt=f"Chọn hình thức gửi hàng đi Mỹ theo loại hàng: giấy tờ và hàng thương mại hợp hãng quốc tế; bưu phẩm nhẹ không gấp hợp bưu điện; đồ ăn, đặc sản, quà gia đình hợp đại lý chuyên tuyến. Thời gian tuyến Mỹ: {TG}.",
    cover="/images/real/thung-hang-san-sang.jpg",
    tags="gửi hàng đi mỹ qua bưu điện,dhl hay fedex đi mỹ,đại lý chuyên tuyến mỹ,gửi hàng đi mỹ nhanh 3-5 ngày",
    content=f"""<p>Câu hỏi hay gặp nhất khi chuẩn bị gửi đồ sang Mỹ: nên ra bưu điện, gọi DHL/FedEx, hay đưa cho một đại lý chuyên tuyến? Câu trả lời ngắn gọn: <strong>chọn theo món hàng, không chọn theo tên tuổi</strong>. Dưới đây là cách chọn cho từng trường hợp.</p>
<h2>Trả lời nhanh theo loại hàng</h2>
<table><thead><tr><th>Bạn gửi gì</th><th>Nên chọn</th><th>Vì sao</th></tr></thead><tbody>
<tr><td>Giấy tờ, hợp đồng gấp</td><td>Hãng chuyển phát quốc tế</td><td>Nhanh, đúng hẹn, theo dõi từng mốc</td></tr>
<tr><td>Bưu phẩm nhẹ, không gấp</td><td>Bưu điện</td><td>Thủ tục đơn giản, nhận ở mọi tỉnh</td></tr>
<tr><td>Đồ ăn khô, đặc sản, yến, thuốc nam</td><td>Đại lý chuyên tuyến</td><td>Quen khai báo nhóm hàng này, có hỗ trợ khi hải quan hỏi</td></tr>
<tr><td>Quà cho gia đình, thùng đồ nhiều món</td><td>Đại lý chuyên tuyến</td><td>Gom kiện, đóng gói hộ, nhiều nơi bao trọn gói cả thuế</td></tr>
<tr><td>Hàng kinh doanh có chứng từ đầy đủ</td><td>Hãng quốc tế hoặc đại lý, tuỳ khối lượng</td><td>Hàng lẻ thì hãng quốc tế; lô lớn thì đại lý gom hàng lợi hơn</td></tr>
<tr><td>Hàng nặng, cồng kềnh, không gấp</td><td>Đường biển</td><td>Xem bài <a href="/tin-tuc/gui-hang-duong-bien-di-my">gửi hàng đường biển đi Mỹ</a></td></tr>
</tbody></table>
{IMG("hang-thuc-pham-dong-goi.jpg", "Thực phẩm khô đóng gói hút chân không gửi đi Mỹ", "Thực phẩm khô được hút chân không trước khi đóng thùng")}
{IMG("kien-hang-carton.jpg", "Thùng carton đóng gói chuẩn xuất khẩu đi Mỹ", "Thùng được đóng chuẩn xuất khẩu, dán niêm trước khi ra sân bay")}
<h2>Ba điểm khác nhau quan trọng nhất</h2>
<h3>Ai trả thuế đầu nhập Mỹ</h3>
<p>Đây là chỗ hay phát sinh nhất. Gửi qua hãng quốc tế hoặc bưu điện thì người nhận bên Mỹ thường là người làm việc với hải quan và đóng khoản phát sinh. Một số đại lý chuyên tuyến nhận <strong>trọn gói đã bao thuế</strong>, người nhận chỉ việc ký nhận hàng. Hỏi rõ điều này trước khi gửi, đừng để người thân bên đó bị động.</p>
<h3>Món hàng có được nhận hay không</h3>
<p>Thực phẩm, thuốc, mỹ phẩm là nhóm bị hạn chế ở gần như mọi hình thức, nhưng mức độ khác nhau. Trước khi đóng thùng, hãy hỏi đích danh món mình gửi. Minh Thiện công bố sẵn <a href="/hang-gui-duoc/my">bảng 41 nhóm mặt hàng gửi đi Mỹ</a> để bạn tra trước, gồm cả nhóm không nhận.</p>
<h3>Ai xử lý khi hàng bị giữ</h3>
<p>Hàng thực phẩm bị hải quan hoặc FDA giữ lại là chuyện có thật, không hiếm. Khác biệt nằm ở chỗ bạn phải tự xoay hay có người đứng ra làm giúp. Hỏi thẳng: "Nếu hàng bị giữ thì bên mình xử lý hay tôi tự làm, chi phí ai chịu?"</p>
{IMG("thuc-pham-gui-quoc-te.jpg", "Thực phẩm đóng gói gửi quốc tế đi Mỹ", "Thực phẩm là nhóm hàng đại lý chuyên tuyến xử lý quen tay nhất")}
<h2>Gửi đi Mỹ nhanh 3–5 ngày có thật không?</h2>
<p>Có, với dịch vụ đi nhanh đường bay. Minh Thiện công bố <strong>{TG}</strong>. Lưu ý hai điều để khỏi hiểu nhầm: đó là <strong>ngày làm việc</strong>, không tính cuối tuần và ngày lễ; và thời gian tính từ khi hàng rời Việt Nam, nên hàng chốt sau giờ cut-off sẽ đi chuyến hôm sau.</p>
<h2>Cước bao nhiêu?</h2>
<p>Cước phụ thuộc cân nặng, kích thước kiện và loại hàng nên không có con số dùng chung cho mọi trường hợp. Nhập số ký vào công cụ dưới đây để xem ngay cho kiện hàng của bạn:</p>
<p>[[tinh-cuoc]]</p>
{CTA}""",
    faq=[
        ("Nên gửi hàng đi Mỹ qua bưu điện hay công ty chuyển phát tư nhân?",
         "Bưu phẩm nhẹ, đơn giản, không gấp thì bưu điện đủ dùng và thủ tục nhẹ nhàng. Thùng đồ ăn, đặc sản, quà gia đình hoặc hàng cần đi nhanh thì công ty tư nhân chuyên tuyến xử lý tốt hơn: gom kiện, đóng gói hộ, hỗ trợ khai báo và nhiều nơi bao trọn gói cả thuế đầu nhập."),
        ("Gửi hàng đi Mỹ qua DHL, FedEx hay qua đại lý chuyên tuyến rẻ hơn?",
         "Với kiện nặng và hàng gia đình, đại lý chuyên tuyến thường mềm hơn vì họ gom nhiều kiện đi chung. Với hàng nhẹ, gấp, cần chứng từ chuẩn thì hãng quốc tế đáng tiền hơn. Nhưng đừng chỉ so con số cước: phải so cả thuế đầu nhập, phí đóng gói và phí lấy hàng, vì đó mới là số tiền cuối cùng bạn trả."),
        ("Đơn vị nào gửi hàng đi Mỹ nhanh 3-5 ngày?",
         f"Minh Thiện Logistics có dịch vụ đi nhanh đường bay {TG}. Đây là ngày làm việc, không tính cuối tuần và ngày lễ, tính từ khi hàng rời Việt Nam. Gọi {HL} để biết chuyến gần nhất cho kiện hàng của bạn."),
        ("Gửi đồ ăn đi Mỹ thì nên chọn hình thức nào?",
         "Nên chọn đại lý chuyên tuyến quen nhóm hàng thực phẩm, vì họ biết cách đóng gói, hút chân không và khai báo để giảm rủi ro bị giữ. Trước khi gửi nên tra trước xem món của mình có nằm trong nhóm được nhận không."),
        ("Hàng bị hải quan Mỹ giữ thì ai xử lý?",
         "Tuỳ nơi bạn gửi. Qua hãng quốc tế hoặc bưu điện thì thường người nhận tự làm việc với hải quan. Qua đại lý chuyên tuyến thì nhiều nơi đứng ra xử lý giúp. Đây là câu nên hỏi rõ trước khi giao hàng, nhất là với thực phẩm."),
    ],
))

# ─────────────────────── Bài 3: gửi cho du học sinh & Việt kiều ───────────────────────
BAI.append(dict(
    slug="gui-do-cho-du-hoc-sinh-va-viet-kieu-o-my",
    title="Gửi Đồ Cho Du Học Sinh Và Việt Kiều Ở Mỹ: Gửi Được Gì, Tránh Gì",
    meta_title=f"Gửi Đồ Cho Du Học Sinh, Việt Kiều Ở Mỹ - Gửi Gì Được | {HL}",
    meta="Gửi đồ ăn cho con du học ở Mỹ và quà cho Việt kiều: món nào đi được, món nào bị hải quan giữ, cách đóng gói và nên gửi trước dịp lễ bao lâu.",
    excerpt=f"Gửi đồ cho con du học và người thân ở Mỹ: đồ khô, đặc sản, bánh kẹo, cà phê, yến đi bình thường; thịt, giò chả, sữa có phụ thu và có rủi ro bị giữ; rau củ trái cây tươi không nhận. Kèm cách ghi địa chỉ Mỹ và mốc nên gửi trước dịp lễ. Thời gian: {TG}.",
    cover="/images/real/banh-keo-dac-san.jpg",
    tags="gửi đồ ăn cho con du học ở mỹ,gửi quà cho việt kiều,gửi quà tết đi mỹ,gửi đồ cho người thân ở mỹ",
    content=f"""<p>Hai nhóm khách gửi đồ sang Mỹ nhiều nhất là <strong>cha mẹ gửi cho con đi du học</strong> và <strong>người nhà gửi quà cho Việt kiều</strong>. Cả hai đều vướng đúng một chỗ: không biết món nào đi được, món nào bị giữ. Bài này trả lời thẳng theo danh sách Minh Thiện đang nhận.</p>
<h2>Gửi cho con du học: món nào đi êm</h2>
<p>Nhóm gửi được bình thường, không phụ thu riêng:</p>
<ul>
<li>Đồ khô và đặc sản quê: bánh tráng, gạo, hạt điều, hạt sen, miến, mì gói, rong biển.</li>
<li>Cá khô, mực khô, tôm khô — nên hút chân không từng gói.</li>
<li>Bánh kẹo, mứt, cà phê, trà.</li>
<li>Quần áo, giày dép, đồ dùng cá nhân, sách vở tài liệu.</li>
<li>Mỹ phẩm, yến sào, sâm và đông trùng hạ thảo.</li>
</ul>
<p>Nhóm <strong>vẫn gửi được nhưng có phụ thu và có rủi ro bị hải quan Mỹ giữ</strong> — nhân viên sẽ báo trước khi nhận hàng:</p>
<ul>
<li>Giò chả, chả lụa, thịt khô, khô bò, lạp xưởng, chà bông.</li>
<li>Sữa, trứng và đồ làm từ sữa.</li>
<li>Thuốc tây, thuốc nam thuốc bắc, thực phẩm chức năng.</li>
<li>Nước mắm, mắm các loại, gia vị và nước sốt đóng chai (có phụ thu chất lỏng).</li>
</ul>
<p>Nhóm <strong>không nhận</strong>: rau củ và trái cây tươi, pin rời và sạc dự phòng, rượu bia, thuốc lá.</p>
<p>Danh sách đầy đủ 41 nhóm mặt hàng xem tại <a href="/hang-gui-duoc/my">bảng hàng gửi đi Mỹ</a>.</p>
{IMG("thuc-pham-kho-dac-san.jpg", "Đồ khô đặc sản đóng gói gửi cho du học sinh ở Mỹ", "Đồ khô và đặc sản là nhóm gửi cho du học sinh nhiều nhất")}
<h2>Gửi quà cho Việt kiều</h2>
<p>Quà gửi cho người thân định cư lâu năm thường nghiêng về đồ quê và đồ sức khoẻ: bánh mứt, kẹo dừa, bánh pía, cà phê, trà, yến sào, sâm ngâm mật ong, thuốc nam. Nhóm này đi bình thường, chỉ cần đóng gói kỹ.</p>
<p>Hai lưu ý hay bị bỏ qua:</p>
<ul>
<li><strong>Đồ có mùi mạnh</strong> như mắm, khô — nên hút chân không hai lớp và bọc riêng, tránh ám sang quần áo cùng thùng.</li>
<li><strong>Đồ dễ vỡ</strong> như hũ thuỷ tinh, chai sành — báo trước để được đóng chống va đập, hoặc đổi sang loại chai nhựa cho chắc.</li>
</ul>
{IMG("kho-bo-ga.jpg", "Khô bò khô gà đóng gói gửi đi Mỹ", "Khô bò, khô gà vẫn gửi được nhưng có phụ thu và có rủi ro bị hải quan Mỹ giữ")}
<h2>Nên gửi trước dịp lễ bao lâu?</h2>
<p>Mùa cao điểm là trước Giáng sinh và trước Tết Nguyên đán — cả hãng bay lẫn hải quan hai đầu đều quá tải.</p>
<ul>
<li><strong>Quà Giáng sinh:</strong> nên gửi trước ít nhất 3 tuần nếu đi tiết kiệm, 2 tuần nếu đi nhanh.</li>
<li><strong>Quà Tết:</strong> nên gửi trước 3–4 tuần. Càng sát Tết càng dễ kẹt và phụ thu mùa cao điểm.</li>
<li>Thời gian bình thường: {TG}.</li>
</ul>
{IMG("thuc-pham-kho-gui-di.jpg", "Thùng đồ khô chuẩn bị gửi cho người thân ở Mỹ", "Đồ khô và đặc sản quê — nhóm quà gửi cho người thân bên Mỹ nhiều nhất")}
<h2>Ghi địa chỉ người nhận ở Mỹ</h2>
<ul>
<li>Đủ <strong>số nhà, tên đường, thành phố, viết tắt bang, ZIP code 5 số</strong>. Thiếu ZIP là hàng dễ nằm kho.</li>
<li><strong>Bắt buộc có số điện thoại người nhận</strong> kiểu Mỹ (10 số) — bên giao hàng gọi trước khi tới.</li>
<li>Ở chung cư hoặc khu có cổng thì ghi rõ số căn hộ (Apt, Unit, Ste) và mã cổng nếu có.</li>
<li>Du học sinh ở ký túc xá nên ghi thêm tên trường, số phòng và tên đầy đủ đúng như trên giấy tờ trường cấp.</li>
</ul>
<h2>Cước bao nhiêu?</h2>
<p>Tuỳ cân nặng và kích thước thùng. Nhập số ký để xem ngay:</p>
<p>[[tinh-cuoc]]</p>
{CTA}""",
    faq=[
        ("Chỗ nào gửi đồ ăn cho con du học ở Mỹ uy tín?",
         f"Nên chọn đơn vị chuyên tuyến Việt–Mỹ có công bố rõ danh sách mặt hàng nhận gửi và có hỗ trợ khi hải quan giữ hàng. Minh Thiện Logistics nhận gửi đồ khô, đặc sản, bánh kẹo, cà phê, mì gói, yến sào và công bố công khai bảng 41 nhóm mặt hàng cho tuyến Mỹ. Hotline/Zalo {HL}."),
        ("Gửi đồ ăn cho con du học ở Mỹ được gửi những gì?",
         "Đồ khô, đặc sản quê, bánh tráng, mì gói, hạt điều, hạt sen, cá khô, tôm khô, bánh kẹo, cà phê, trà đều gửi bình thường. Giò chả, khô bò, sữa, thuốc tây vẫn gửi được nhưng có phụ thu và có rủi ro bị hải quan Mỹ giữ. Rau củ trái cây tươi thì không nhận."),
        ("Gửi hàng cho Việt kiều ở Mỹ nên chọn công ty nào?",
         "Nên chọn nơi nhận trọn gói đã bao thuế đầu nhập, để người thân bên Mỹ không phải làm việc với hải quan hay đóng thêm khoản nào khi nhận hàng. Ngoài ra nên hỏi rõ đơn vị có nhận đúng món mình gửi không và mất hàng thì đền thế nào."),
        ("Gửi quà Giáng sinh đi Mỹ nên gửi trước bao lâu?",
         "Nên gửi trước ít nhất 3 tuần nếu chọn đi tiết kiệm, 2 tuần nếu đi nhanh. Cuối năm là mùa cao điểm, cả hãng bay lẫn hải quan đều quá tải nên thời gian dễ kéo dài hơn ngày thường."),
        ("Gửi quà Tết cho người thân ở Mỹ nên gửi khi nào?",
         "Nên gửi trước Tết 3–4 tuần. Càng sát Tết càng dễ kẹt chuyến và gặp phụ thu mùa cao điểm. Bánh mứt, kẹo, trà, cà phê là nhóm gửi được bình thường."),
        ("Gửi hàng đi Mỹ cần ghi địa chỉ người nhận thế nào?",
         "Ghi đủ số nhà, tên đường, thành phố, viết tắt bang và ZIP code 5 số, kèm số điện thoại người nhận kiểu Mỹ 10 số. Chung cư thì ghi thêm số căn hộ. Du học sinh ở ký túc xá nên ghi thêm tên trường và số phòng."),
        ("Gửi hàng đi Mỹ có cần số điện thoại người nhận không?",
         "Có, bắt buộc. Bên giao hàng bên Mỹ gọi cho người nhận trước khi giao; thiếu số điện thoại thì hàng dễ bị chậm hoặc trả về."),
    ],
))

# ─────────────────────── Bài 4: cước tính thế nào (KHÔNG nêu số tiền) ───────────────────────
BAI.append(dict(
    slug="cuoc-gui-hang-di-my-tinh-the-nao",
    title="Cước Gửi Hàng Đi Mỹ Tính Thế Nào? Cân Quy Đổi, Phụ Thu Và Bao Thuế",
    meta_title=f"Cước Gửi Hàng Đi Mỹ Tính Thế Nào - Cân Quy Đổi, Bao Thuế | {HL}",
    meta="Hiểu cách tính cước gửi hàng đi Mỹ: cân thực và cân quy đổi, khi nào có phụ thu, bao thuế nghĩa là gì, hàng nặng trên 20kg và hàng cồng kềnh tính ra sao.",
    excerpt=f"Cước gửi hàng đi Mỹ tính theo mức cao hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao chia 5000), cộng phụ thu với vài nhóm hàng. Bài giải thích cách tính, ý nghĩa của giá bao thuế, hàng trên 20kg và hàng cồng kềnh. Thời gian: {TG}.",
    cover="/images/real/can-hang-truoc-gui.jpg",
    tags="cước gửi hàng đi mỹ,cân quy đổi,tính cước đi mỹ,gửi hàng nặng đi mỹ,bao thuế đi mỹ",
    content=f"""<p>Hai người cùng gửi "một thùng" đi Mỹ nhưng trả tiền khác nhau là chuyện bình thường — vì cước không tính theo thùng mà theo <strong>số ký tính cước</strong>. Hiểu cách tính này giúp bạn đóng gói gọn lại và tiết kiệm được kha khá.</p>
<h2>Cân thực và cân quy đổi: lấy cái nào lớn hơn</h2>
<p>Hàng đi máy bay bị giới hạn cả sức nặng lẫn chỗ chứa, nên hãng bay tính theo <strong>mức cao hơn</strong> giữa hai con số:</p>
<ul>
<li><strong>Cân thực:</strong> cân lên được bao nhiêu ký.</li>
<li><strong>Cân quy đổi:</strong> <code>(Dài × Rộng × Cao tính bằng cm) chia 5000</code>.</li>
</ul>
<p>Ví dụ cho dễ hình dung: một thùng chăn gối kích thước 60 × 40 × 50 cm, cân lên chỉ 6kg. Cân quy đổi là 60 × 40 × 50 ÷ 5000 = <strong>24kg</strong>. Cước sẽ tính theo 24kg chứ không phải 6kg.</p>
<p><strong>Rút ra:</strong> đồ nhẹ mà cồng kềnh (chăn gối, đồ nhựa, hộp xốp, bánh phồng) là nhóm dễ bị đội giá nhất. Nén gọn, bỏ bớt hộp giấy thừa, dồn thùng lại là giảm được đáng kể.</p>
{IMG("can-kien-hang.jpg", "Cân kiện hàng trước khi gửi đi Mỹ", "Hàng được cân và đo kích thước trước mặt khách, chụp ảnh xác nhận")}
<h2>"Giá bao thuế" nghĩa là gì?</h2>
<p>Gửi hàng sang Mỹ có thể phát sinh thuế và phí ở đầu nhập. Có hai cách làm:</p>
<ul>
<li><strong>Không bao thuế:</strong> bạn trả cước ở Việt Nam, còn người nhận bên Mỹ làm việc với hải quan và đóng khoản phát sinh khi hàng tới. Khoản này không biết trước được.</li>
<li><strong>Bao thuế trọn gói:</strong> khoản đó đã nằm trong cước bạn trả ở Việt Nam, người nhận chỉ việc ký nhận hàng.</li>
</ul>
<p>Minh Thiện Logistics áp dụng <strong>bao thuế đầu nhập Mỹ</strong> cho hàng thông thường. Một vài mặt hàng đặc thù không bao đầu nhập — nhân viên sẽ nói rõ trước khi nhận hàng, xem chi tiết tại <a href="/hang-gui-duoc/my">bảng 41 nhóm mặt hàng gửi đi Mỹ</a>.</p>
{IMG("kien-hang-carton.jpg", "Đo kích thước thùng hàng để tính cân quy đổi", "Kiện nhẹ mà to thì cước tính theo kích thước, không theo cân thực")}
<h2>Khi nào có phụ thu?</h2>
<p>Ngoài cước theo ký, một số nhóm hàng có phụ thu riêng vì cần đóng gói hoặc xử lý đặc biệt:</p>
<ul>
<li>Hàng lỏng đóng chai: nước mắm, mắm, gia vị, nước sốt — cần bọc chống rò và đóng thùng riêng.</li>
<li>Hàng có rủi ro ở đầu nhập: giò chả, thịt khô, sữa trứng, thuốc, thực phẩm chức năng.</li>
<li>Hàng giá trị cao hoặc cần xử lý riêng: nước hoa, đồng hồ, thiết bị máy móc.</li>
<li>Hàng đông lạnh: có tuyến riêng, chỉ đi dịch vụ nhanh.</li>
</ul>
<p>Mức phụ thu của từng nhóm ghi rõ trong bảng mặt hàng, hoặc gọi hotline để được báo đúng món của bạn.</p>
<h2>Hàng nặng và hàng cồng kềnh</h2>
<p>Kiện càng nặng thì đơn giá mỗi ký càng giảm, nên gom nhiều món vào một thùng thường rẻ hơn chia nhỏ ra nhiều thùng. Với kiện vượt mốc thông thường, cước được báo riêng theo lô — gửi ảnh và số đo thùng qua Zalo {HL} là có giá.</p>
<p>Hàng thật sự nặng và không gấp thì nên cân nhắc đường biển thay vì đường bay: chậm hơn nhiều nhưng rẻ hơn hẳn cho khối lượng lớn. Xem bài <a href="/tin-tuc/gui-hang-duong-bien-di-my">gửi hàng đường biển đi Mỹ</a>.</p>
{IMG("hang-kho-da-dang.jpg", "Hàng khô gom chung một thùng gửi đi Mỹ", "Gom nhiều món vào một thùng thường rẻ hơn chia ra nhiều thùng nhỏ")}
<h2>Bốn cách giảm cước</h2>
<ol>
<li><strong>Nén gọn thùng.</strong> Bỏ hộp giấy thừa, hút chân không quần áo và chăn gối — đây là cách giảm nhiều nhất với hàng cồng kềnh.</li>
<li><strong>Gom một thùng thay vì nhiều thùng nhỏ.</strong></li>
<li><strong>Chọn đi tiết kiệm nếu không gấp</strong> ({TG}).</li>
<li><strong>Tránh nhóm có phụ thu khi có thể.</strong> Ví dụ gia vị dạng bột thay cho dạng chai lỏng.</li>
</ol>
<h2>Xem cước kiện hàng của bạn</h2>
<p>Nhập số ký vào công cụ dưới đây để có giá ước tính ngay, hoặc gửi ảnh kiện hàng qua Zalo {HL} để được báo giá chính xác kèm phụ thu nếu có:</p>
<p>[[tinh-cuoc]]</p>
{CTA}""",
    faq=[
        ("Cước gửi hàng đi Mỹ tính theo cân nặng hay kích thước?",
         "Tính theo mức cao hơn giữa cân thực và cân quy đổi. Cân quy đổi bằng Dài nhân Rộng nhân Cao tính bằng cm rồi chia 5000. Hàng nhẹ mà cồng kềnh như chăn gối, đồ nhựa thường bị tính theo cân quy đổi."),
        ("Cân quy đổi là gì và tính thế nào?",
         "Cân quy đổi là số ký tính theo chỗ mà kiện hàng chiếm trên máy bay: lấy Dài nhân Rộng nhân Cao (cm) chia cho 5000. Ví dụ thùng 60 x 40 x 50 cm có cân quy đổi là 24kg, dù cân thực chỉ 6kg."),
        ("Giá gửi hàng đi Mỹ đã bao gồm thuế chưa?",
         "Với Minh Thiện Logistics, cước tuyến Mỹ là giá trọn gói đã bao thuế đầu nhập, người nhận bên Mỹ không phải đóng thêm khi nhận hàng. Một vài mặt hàng đặc thù không bao đầu nhập, nhân viên sẽ báo rõ trước khi nhận hàng."),
        ("Gửi hàng nặng trên 20kg đi Mỹ tính giá thế nào?",
         f"Kiện càng nặng thì đơn giá mỗi ký càng giảm. Với kiện vượt mốc thông thường, cước được báo riêng theo lô — gửi ảnh và số đo thùng qua Zalo {HL} để được báo giá."),
        ("Gửi hàng đi Mỹ đường biển có rẻ hơn đường bay không?",
         "Rẻ hơn đáng kể với khối lượng lớn, nhưng chậm hơn nhiều nên chỉ hợp khi không gấp. Hàng lẻ và hàng nhẹ thì đường bay vẫn lợi hơn vì đường biển còn có các chi phí cố định ở hai đầu."),
        ("Làm sao giảm cước gửi hàng đi Mỹ?",
         "Nén gọn thùng và bỏ hộp giấy thừa, gom nhiều món vào một thùng thay vì chia nhiều thùng nhỏ, chọn dịch vụ đi tiết kiệm nếu không gấp, và tránh nhóm hàng có phụ thu khi có lựa chọn thay thế."),
    ],
))

# ─────────────────────────────────── ghi vào DB ───────────────────────────────────
con = sqlite3.connect(DB, timeout=30)
TIEN = re.compile(r"\d{1,3}[.,]\d{3}\s*(đ|vnd|VNĐ)|\d+\s*(triệu|tr)\b", re.I)

for b in BAI:
    chu = len(re.sub(r"<[^>]+>", "", b["content"]))
    # Chủ chốt 20/09: KHÔNG ghi giá trong bài. Chặn ngay ở đây cho chắc.
    dinh_gia = [t for t in [b["content"], b["excerpt"], b["meta"]] + [a for _, a in b["faq"]] if TIEN.search(t)]
    co = con.execute("select 1 from Article where slug=?", (b["slug"],)).fetchone()
    print(f"[{b['slug']}]\n   {chu} ký tự, {len(b['faq'])} FAQ"
          + ("  ⚠️ CÓ SỐ TIỀN TRONG BÀI!" if dinh_gia else "  ✓ không có con số giá nào")
          + ("  — ĐÃ CÓ, bỏ qua" if co else ""))
    if dinh_gia:
        for t in dinh_gia[:2]:
            print("      ", TIEN.search(t).group(0), "…", t[max(0, TIEN.search(t).start() - 50):TIEN.search(t).start() + 40])
    if co or not WRITE or dinh_gia:
        continue
    con.execute("""insert into Article (id, slug, title, excerpt, content, coverImage, category, tags, metaTitle,
                   metaDescription, faqJson, published, views, publishedAt, createdAt, updatedAt)
                   values (?,?,?,?,?,?,?,?,?,?,?,1,0,?,?,?)""",
                ("c" + secrets.token_hex(12), b["slug"], b["title"], b["excerpt"], b["content"], b["cover"],
                 "Gửi hàng đi Mỹ", b["tags"], b["meta_title"], b["meta"],
                 json.dumps([{"q": q, "a": a} for q, a in b["faq"]], ensure_ascii=False), NOW, NOW, NOW))
    con.commit()
    print("   ĐÃ ĐĂNG")

print("\n(chạy thử — thêm --ghi để ghi thật)" if not WRITE else "\nXONG")
