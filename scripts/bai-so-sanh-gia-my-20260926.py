#!/usr/bin/env python3
"""
26/09/2026 — bài SO SÁNH GIÁ gửi hàng đi Mỹ, có nêu tên và có số.

⚠️ Bài này CỐ Ý ngược hai luật cũ ("không ghi giá", "không nêu tên đại lý tư nhân")
   — chủ chốt lại ngày 26/09: "bạn viết và so giá đi", và "chỉ so sánh mức 5, 10, 15, 20kg".

NGUYÊN TẮC AN TOÀN khi viết bài loại này:
  1. Chỉ dùng số ĐỐI THỦ TỰ CÔNG BỐ trên web của họ, và ghi rõ ngày kiểm.
  2. Chỉ nêu tên bên nào mình TỰ KIỂM ĐƯỢC hôm nay. Kiểm 26/09: VHE còn bảng giá
     đầy đủ; quynam.vn và 3a.net.vn KHÔNG còn bảng giá trên trang → không đưa số
     của họ vào, chỉ nói là không công bố.
  3. KHÔNG nói "mấy công ty này là một nhà" — phiên trước có ghi nhận vậy nhưng
     không tự kiểm chắc được, viết ra là rước kiện.
  4. KHÔNG khẳng định giá đối thủ chưa gồm thuế — chỉ nói trang họ KHÔNG NÊU.
  5. Nói thẳng khúc mình đắt hơn (hàng nhẹ) thay vì lờ đi.

Dùng: python3 scripts/bai-so-sanh-gia-my-20260926.py <dev.db> [--ghi]
"""
import html, json, re, secrets, sqlite3, sys
from datetime import datetime, timezone

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
HL = "0589.77.89.89"
NGAY_KIEM = "26/09/2026"
SLUG = "so-sanh-gia-gui-hang-di-my"
IMG = lambda f, alt, cap: f'<figure><img src="/images/real/{f}" alt="{alt}" style="width:100%;max-width:800px;height:auto;border-radius:8px" /><figcaption>{cap}</figcaption></figure>'

# Giá Minh Thiện: lấy từ bảng giá đang chạy (SiteSetting price_my), mốc 0,5kg → idx = kg/0,5 - 1
MT = {5: 2132522, 10: 3323693, 15: 4527967, 20: 5750803}
# Giá VHE: bảng "Số ký / Giá cước gửi" trên vhe.vn/cong-ty-gui-hang-di-my-uy-tin.html, đọc 26/09/2026
VHE = {5: 2325000, 10: 3985000, 15: 5625000, 20: 7075000}
tien = lambda n: f"{n:,}".replace(",", ".") + "đ"

hang = ""
for kg in (5, 10, 15, 20):
    ch = MT[kg] - VHE[kg]
    pct = abs(ch) / VHE[kg] * 100
    hang += (f"<tr><td><strong>{kg}kg</strong></td><td>{tien(MT[kg])}</td><td>{tien(VHE[kg])}</td>"
             f"<td>{'giảm ' + tien(-ch) if ch < 0 else 'cao hơn ' + tien(ch)}</td><td>{pct:.1f}%</td></tr>")

TITLE = "So Sánh Giá Gửi Hàng Đi Mỹ: Minh Thiện Và Đại Lý Chuyên Tuyến"
META_TITLE = f"So Sánh Giá Gửi Hàng Đi Mỹ 5-20kg (Cập Nhật {NGAY_KIEM})"
META = (f"So sánh giá gửi hàng đi Mỹ ở mức 5, 10, 15, 20kg giữa Minh Thiện Logistics và bảng giá "
        f"đại lý tự công bố. Kèm cách đọc giá để biết số cuối cùng phải trả. Cập nhật {NGAY_KIEM}.")
EXCERPT = (f"So sánh giá gửi hàng đi Mỹ ở 4 mức cân phổ biến 5, 10, 15 và 20kg, dùng bảng giá từng bên "
           f"tự công bố (kiểm {NGAY_KIEM}). Kèm phần quan trọng hơn con số: giá đã gồm thuế đầu nhập Mỹ "
           f"hay chưa, và những khoản khiến số cuối cùng khác số niêm yết.")

CONTENT = f"""<p>Đi hỏi giá gửi hàng đi Mỹ, bạn sẽ nhận được những con số rất khác nhau — và phần lớn không so được với nhau, vì mỗi nơi tính một kiểu. Bài này so ở <strong>bốn mức cân người ta hay gửi nhất: 5kg, 10kg, 15kg và 20kg</strong>, dùng đúng bảng giá mà từng bên <em>tự công bố trên website của mình</em>, kiểm ngày {NGAY_KIEM}.</p>

<h2>Bảng so sánh</h2>
<table><thead><tr><th>Cân nặng</th><th>Minh Thiện Logistics</th><th>VHE Logistics</th><th>Chênh lệch</th><th>Tỉ lệ</th></tr></thead><tbody>
{hang}
</tbody></table>
<p class="text-sm"><em>Nguồn: bảng giá công bố trên minhthienlogs.com và trên vhe.vn/cong-ty-gui-hang-di-my-uy-tin.html, đọc ngày {NGAY_KIEM}. Giá thay đổi theo thời điểm — hãy kiểm lại ở cả hai nơi trước khi quyết định.</em></p>
<p>Ở khoảng 5–20kg, chênh lệch tăng dần theo cân: từ khoảng 8% ở mức 5kg lên gần 19% ở mức 20kg. Lý do đơn giản là đơn giá mỗi ký giảm nhanh hay chậm theo bậc cân, và mỗi đơn vị thiết kế bậc khác nhau.</p>
<p><strong>Nói cho sòng phẳng:</strong> ở khoảng hàng nhẹ dưới 2kg thì bảng giá các bên sát nhau hơn nhiều và không phải lúc nào Minh Thiện cũng thấp hơn. Bài này so ở 5–20kg vì đó là cỡ thùng đồ gửi cho gia đình; gửi bưu phẩm nhẹ thì bạn nên hỏi giá cả hai nơi.</p>

{IMG("kien-hang-so-luong-lon.jpg", "Kiện hàng 5-20kg chuẩn bị gửi đi Mỹ", "5–20kg là cỡ thùng đồ người Việt hay gửi cho gia đình bên Mỹ")}

<h2>Quan trọng hơn con số: giá đã gồm thuế đầu nhập chưa?</h2>
<p>Đây là chỗ khiến hai con số trông giống nhau lại là hai thứ khác hẳn.</p>
<p>Hàng vào Mỹ có thể phát sinh thuế và phí ở đầu nhập. Nếu cước bạn trả <em>chưa</em> gồm khoản đó, người nhận bên Mỹ sẽ là người làm việc với hải quan và đóng thêm — và không ai biết trước là bao nhiêu. Nếu cước <em>đã</em> gồm, người nhận chỉ việc ký nhận hàng.</p>
<p><strong>Giá của Minh Thiện Logistics ở bảng trên là giá trọn gói đã bao thuế đầu nhập Mỹ</strong> cho hàng thông thường. Một vài mặt hàng đặc thù không bao đầu nhập — nước hoa và bột pha trà sữa — và điều đó được nói trước khi nhận hàng.</p>
<p>Còn bảng giá của VHE, chúng tôi đọc toàn bộ trang ngày {NGAY_KIEM} và <strong>không thấy nêu giá đã gồm thuế đầu nhập hay chưa</strong>. Chúng tôi không kết luận thay họ — nhưng nếu bạn đang cân nhắc, đây chính là câu bạn nên hỏi thẳng trước khi gửi.</p>

<h2>Phần lớn đại lý không công bố giá</h2>
<p>Khi đi kiểm để viết bài này, chúng tôi mở các trang đang đứng đầu Google cho từ khoá "công ty gửi hàng đi Mỹ uy tín". Kết quả ngày {NGAY_KIEM}: <strong>quynam.vn và 3a.net.vn có bài giới thiệu dịch vụ nhưng không có bảng giá nào trên trang</strong>. Chỉ VHE công bố bảng giá đầy đủ theo từng nửa ký, nên bài này chỉ so được với họ.</p>
<p>Không công bố giá không có nghĩa là đắt. Nhưng nó có nghĩa là bạn phải hỏi từng nơi một, và không có gì để đối chiếu về sau. Hãy yêu cầu báo giá <strong>bằng văn bản</strong> — tin nhắn Zalo cũng được — ghi rõ số ký, loại hàng, đã gồm thuế hay chưa.</p>

<h2>Năm khoản khiến số cuối cùng khác số niêm yết</h2>
<ol>
<li><strong>Thuế đầu nhập Mỹ.</strong> Như trên. Đây là khoản lớn nhất và hay bị bỏ quên nhất.</li>
<li><strong>Cân quy đổi.</strong> Hàng đi máy bay tính theo mức cao hơn giữa cân thực và <code>Dài × Rộng × Cao ÷ 5000</code>. Thùng chăn gối 60 × 40 × 50 cm cân 6kg nhưng tính cước theo 24kg. Xem chi tiết ở bài <a href="/tin-tuc/cuoc-gui-hang-di-my-tinh-the-nao">cước gửi hàng đi Mỹ tính thế nào</a>.</li>
<li><strong>Phụ thu theo nhóm hàng.</strong> Hàng lỏng đóng chai, sản phẩm từ thịt, hàng giá trị cao, hàng đông lạnh, hàng phải đóng kiện gỗ đều có phụ thu riêng.</li>
<li><strong>Phí đóng gói và phí lấy hàng tận nơi.</strong> Có nơi tính, có nơi miễn phí.</li>
<li><strong>Phí giao vùng xa.</strong> Địa chỉ ngoài thành phố lớn thường cộng thêm cả thời gian lẫn chi phí.</li>
</ol>
<p>Vì vậy câu hỏi đúng khi đi hỏi giá không phải "bao nhiêu một ký", mà là <strong>"tổng cộng tôi trả bao nhiêu, và người nhận có phải trả gì nữa không"</strong>.</p>

{IMG("can-hang-truoc-gui.jpg", "Cân kiện hàng trước mặt khách", "Cân trước mặt khách và chụp ảnh từng kiện để đối chiếu về sau")}

<h2>Vì sao càng nặng chênh lệch càng lớn</h2>
<p>Nhìn bảng sẽ thấy ở 5kg chênh khoảng 8%, tới 20kg thành gần 19%. Không phải bên nào "phá giá" cả — đó là cách bậc cân được thiết kế.</p>
<p>Cước hàng không gồm một phần cố định cho mỗi kiện (xử lý, chứng từ, giao chặng cuối) và một phần theo ký. Đơn vị gom được nhiều hàng đi chung một chuyến sẽ chia phần cố định đó ra nhiều kiện hơn, nên càng lên cân cao thì đơn giá mỗi ký càng rớt nhanh. Ngược lại, ở mức 0,5–2kg thì phần cố định chiếm tỉ trọng lớn, nên giá các bên sát nhau và khó chênh nhiều.</p>
<p>Hệ quả thực tế: <strong>gom một thùng 20kg thường rẻ hơn hẳn so với chia thành bốn thùng 5kg</strong>, dù tổng số ký bằng nhau. Nếu bạn đang định gửi làm nhiều đợt, thử hỏi giá cho phương án gom một lần.</p>

<h2>Một thùng thật thì tính ra sao</h2>
<p>Giả sử bạn gửi một thùng đồ khô 10kg, kích thước 45 × 35 × 30 cm, đi California.</p>
<ul>
<li><strong>Cân quy đổi:</strong> 45 × 35 × 30 ÷ 5000 = 9,45kg. Nhỏ hơn cân thực 10kg, nên tính theo 10kg. Nếu cùng số ký đó mà đóng thùng 60 × 45 × 40 cm thì cân quy đổi thành 21,6kg — và bạn trả tiền cho 21,6kg.</li>
<li><strong>Cước theo bảng:</strong> ở mức 10kg, Minh Thiện công bố {tien(MT[10])}; VHE công bố {tien(VHE[10])}.</li>
<li><strong>Thuế đầu nhập:</strong> với Minh Thiện, khoản này đã nằm trong số trên. Với nơi không nêu rõ, bạn cần hỏi để biết người nhận có phải đóng thêm không.</li>
<li><strong>Phụ thu:</strong> thùng đồ khô thuần thì không có. Nếu trong thùng có chai nước mắm thì phát sinh phụ thu hàng lỏng; có giò chả thì phát sinh phụ thu nhóm rủi ro.</li>
</ul>
<p>Bài học rút ra không phải là con số, mà là: <strong>đóng gọn thùng lại có khi tiết kiệm nhiều hơn là đi tìm chỗ rẻ hơn vài phần trăm.</strong></p>

<h2>Đi nhanh hay đi tiết kiệm</h2>
<p>Cùng một kiện, chọn dịch vụ khác nhau thì giá khác nhau. Đồ khô để dành, quần áo, sách vở thì đi tiết kiệm là đủ. Hàng có hạn dùng ngắn, đồ dễ hút ẩm, hàng đông lạnh hoặc cần kịp một dịp cụ thể thì nên đi nhanh. Khi so giá giữa hai nơi, nhớ hỏi rõ con số họ báo là cho dịch vụ nào — so giá đi tiết kiệm của bên này với giá đi nhanh của bên kia là so lệch.</p>

<h2>Cách tự kiểm chứng bảng giá trong bài</h2>
<p>Chúng tôi không muốn bạn tin suông. Bảng giá của Minh Thiện nằm công khai trong công cụ tính cước ở cuối bài — nhập số ký là ra. Bảng giá của VHE nằm trên chính trang <em>vhe.vn/cong-ty-gui-hang-di-my-uy-tin.html</em>, mục "Số ký / Giá cước gửi". Cả hai đều có thể đổi bất cứ lúc nào; bài này ghi lại tình trạng ngày {NGAY_KIEM}. Nếu bạn đọc bài này sau đó khá lâu, hãy mở lại cả hai nguồn và tự đối chiếu.</p>

<h2>Năm câu để đòi một báo giá thật</h2>
<ol>
<li>Giá này đã gồm thuế đầu nhập Mỹ chưa? Nếu chưa, người nhận sẽ phải đóng khoảng bao nhiêu?</li>
<li>Tính theo cân thực hay cân quy đổi? Thùng của tôi kích thước này thì tính ra bao nhiêu ký?</li>
<li>Món hàng của tôi có phụ thu không? (Hỏi đích danh món mình gửi.)</li>
<li>Có phí đóng gói, phí lấy hàng, phí vùng xa không?</li>
<li>Mất hàng đền thế nào, có bảo hiểm và không bảo hiểm khác nhau ra sao?</li>
</ol>
<p>Nơi nào trả lời được năm câu này bằng văn bản thì con số họ đưa mới so sánh được với nơi khác.</p>

<h2>Ngoài giá, Minh Thiện công bố sẵn những gì</h2>
<ul>
<li><strong>Danh sách 41 nhóm mặt hàng</strong> cho tuyến Mỹ tại <a href="/hang-gui-duoc/my">bảng hàng gửi đi Mỹ</a> — ghi rõ nhóm nào nhận, nhóm nào có điều kiện hoặc phụ thu, nhóm nào không nhận.</li>
<li><strong>Thời gian:</strong> đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; vùng sâu vùng xa tuỳ postcode cộng thêm 2–3 ngày.</li>
<li><strong>Lịch bay cả tuần, chốt hàng 10 giờ sáng ngày hôm trước.</strong></li>
<li><strong>Bảo hiểm tuỳ chọn:</strong> có bảo hiểm đền 100% cước và giá trị hàng; không bảo hiểm đền cước và tối đa 100 USD.</li>
<li>Lấy hàng tận nơi miễn phí trong TP.HCM, đóng gói chuẩn xuất khẩu miễn phí, mã theo dõi tra tại <a href="/tra-cuu">trang tra cứu đơn</a> tới khi người nhận ký nhận.</li>
</ul>

<h2>Tự tính cho kiện hàng của bạn</h2>
<p>Bảng trên là bốn mức cân tròn. Kiện hàng thật thì hiếm khi tròn số — nhập đúng số ký và kích thước vào công cụ dưới đây để có mức ước tính ngay:</p>
<p>[[tinh-cuoc]]</p>

<h2>Liên hệ</h2>
<p><strong>Hotline / Zalo: {HL}</strong> (Ms Min) — làm việc T2–CN 8:00–21:00. Gửi ảnh kiện hàng qua Zalo là có báo giá kèm phụ thu nếu có. Xem thêm <a href="/dich-vu/gui-hang-di-my">dịch vụ gửi hàng đi Mỹ</a> và <a href="/tin-tuc/so-sanh-cac-cach-gui-hang-di-my-tu-viet-nam">so sánh các cách gửi hàng đi Mỹ</a>.</p>"""

FAQ = [
    ("Gửi 10kg đi Mỹ giá bao nhiêu?",
     f"Theo bảng giá Minh Thiện Logistics công bố ngày {NGAY_KIEM}, 10kg đi Mỹ là {tien(MT[10])} — giá trọn gói đã bao thuế đầu nhập Mỹ. Cùng mức cân, bảng giá VHE Logistics công bố là {tien(VHE[10])}, trang của họ không nêu đã gồm thuế đầu nhập hay chưa. Giá thay đổi theo thời điểm, nên kiểm lại trước khi gửi."),
    ("Gửi 20kg đi Mỹ giá bao nhiêu?",
     f"Bảng giá Minh Thiện ngày {NGAY_KIEM} là {tien(MT[20])} cho 20kg, đã bao thuế đầu nhập Mỹ. Bảng giá VHE công bố cùng mức là {tien(VHE[20])}. Lưu ý cước tính theo mức cao hơn giữa cân thực và cân quy đổi."),
    ("Công ty nào gửi hàng đi Mỹ rẻ nhất?",
     "Không có câu trả lời dùng chung, vì giá phụ thuộc mức cân và vì nhiều đơn vị không công bố bảng giá. Ở khoảng 5–20kg, so trên bảng giá công bố ngày " + NGAY_KIEM + ", Minh Thiện Logistics thấp hơn VHE Logistics khoảng 8% ở mức 5kg và gần 19% ở mức 20kg. Với hàng nhẹ dưới 2kg thì các bảng giá sát nhau hơn, nên hỏi cả hai nơi."),
    ("Giá gửi hàng đi Mỹ đã bao gồm thuế chưa?",
     "Tuỳ đơn vị. Giá của Minh Thiện Logistics là giá trọn gói đã bao thuế đầu nhập Mỹ cho hàng thông thường, người nhận không phải đóng thêm; riêng nước hoa và bột pha trà sữa thì không bao đầu nhập và được báo trước. Nhiều đơn vị khác không nêu rõ điều này trên bảng giá — hãy hỏi thẳng trước khi gửi."),
    ("Vì sao cùng số ký mà mỗi nơi báo một giá khác nhau?",
     "Vì con số cuối cùng gồm nhiều khoản chứ không chỉ cước theo ký: thuế đầu nhập, cân quy đổi, phụ thu theo nhóm hàng, phí đóng gói và lấy hàng, phí giao vùng xa. Hai nơi báo cùng một con số trên mỗi ký vẫn có thể ra hai số tiền rất khác nhau."),
    ("Làm sao biết báo giá nào là thật?",
     "Yêu cầu báo giá bằng văn bản, ghi rõ số ký, loại hàng, đã gồm thuế đầu nhập hay chưa, có phụ thu gì, và mức đền bù khi mất hàng. Báo giá trả lời đủ những mục đó mới so sánh được với nơi khác."),
]
TAGS = "so sánh giá gửi hàng đi mỹ,giá gửi hàng đi mỹ 10kg,giá gửi hàng đi mỹ 20kg,công ty gửi hàng đi mỹ rẻ,bảng giá gửi hàng đi mỹ"

con = sqlite3.connect(DB, timeout=30)
dem = lambda c: len(html.unescape(re.sub(r"<[^>]+>", " ", c)).split())
ANH_CAM = ("qua-tang-dong-goi", "dong-goi-giao-kien")
cam = [a for a in ANH_CAM if a in CONTENT]
co = con.execute("select 1 from Article where slug=?", (SLUG,)).fetchone()
print(f"[{SLUG}]\n   {dem(CONTENT)} chữ, {CONTENT.count('<h2')} mục, {CONTENT.count('<figure')} ảnh, {len(FAQ)} hỏi-đáp"
      + (f"  ⚠️ ẢNH CẤM {cam}" if cam else "  ✓ ảnh sạch")
      + ("  — ĐÃ CÓ, bỏ qua" if co else ""))
if not co and not cam and WRITE:
    con.execute("""insert into Article (id, slug, title, excerpt, content, coverImage, category, tags, metaTitle,
                   metaDescription, faqJson, published, views, publishedAt, createdAt, updatedAt)
                   values (?,?,?,?,?,?,?,?,?,?,?,1,0,?,?,?)""",
                ("c" + secrets.token_hex(12), SLUG, TITLE, EXCERPT, CONTENT, "/images/real/kien-hang-so-luong-lon.jpg",
                 "Gửi hàng đi Mỹ", TAGS, META_TITLE, META,
                 json.dumps([{"q": q, "a": a} for q, a in FAQ], ensure_ascii=False), NOW, NOW, NOW))
    con.commit()
    print("   ĐÃ ĐĂNG")
elif not WRITE:
    print("\n(chạy thử — thêm --ghi để ghi thật)")
