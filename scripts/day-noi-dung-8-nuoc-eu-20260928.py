#!/usr/bin/env python3
"""
28/09/2026 — dày nội dung 8 trang nước Châu Âu có nhu cầu thật.

LÝ DO (đo 28 ngày): 27 trang nước EU chỉ 658–712 chữ, bằng 1/3 mặt bằng web
(trung vị 1.896) nên nằm hạng 23–43 dù có đúng từ khoá. Làm 8 trang có lượt hiện
cao nhất trước: Bỉ 37, Latvia 30, Áo 24, Litva 20, Estonia 20, Slovenia 60,
Hy Lạp 17, Ireland 13 — gom ~180/261 lượt hiện của cả nhóm.

CHÈN THÊM (giữ nguyên phần cũ, không xoá chữ nào):
  - Bảng 41 nhóm mặt hàng tuyến Châu Âu (nguồn: src/data/hang-tuyen.json, chủ xác nhận)
  - Lịch bay thứ 3 & thứ 5, chốt hàng thứ 7 – thứ 4 (nguồn: file training của chủ)
  - Đóng gói từng nhóm, ghi địa chỉ ở châu Âu, thuế VAT của EU
  - Thêm 4 câu hỏi–đáp khớp câu khách thật sự gõ ("gửi thực phẩm đi X được không")

GIỮ LUẬT: không ghi con số cước; chỉ nêu phụ thu chất lỏng vì đó là con số chủ đã
cho đăng công khai ở /hang-gui-duoc. Không dùng 2 ảnh có xì gà Cohiba.

Dùng: python3 scripts/day-noi-dung-8-nuoc-eu-20260928.py <dev.db> [--ghi]
"""
import html, json, re, sqlite3, sys

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
HL = "0589.77.89.89"
SLUGS = ["gui-hang-di-belgium", "gui-hang-di-latvia", "gui-hang-di-austria", "gui-hang-di-lithuania",
         "gui-hang-di-estonia", "gui-hang-di-slovenia", "gui-hang-di-greece", "gui-hang-di-ireland"]

DK = [("Giò chả, chả lụa", "Đi được nhưng có rủi ro bị giữ ở đầu châu Âu, có phụ thu theo kg"),
      ("Thịt khô, khô bò, lạp xưởng, chà bông", "Như trên — nhóm sản phẩm từ thịt bị siết chặt nhất"),
      ("Hải sản, thực phẩm đông lạnh", "Chỉ nhận hải sản đông lạnh, đi dịch vụ nhanh 3–5 ngày"),
      ("Sữa, trứng và đồ làm từ sữa", "Đi được nhưng có rủi ro, có phụ thu theo kg"),
      ("Gia vị, nước sốt đóng chai", "Phụ thu chất lỏng 300.000đ/kiện, đóng chống rò riêng"),
      ("Thuốc tây", "Đi được nhưng có rủi ro, nên để nguyên vỉ nguyên hộp, kèm toa nếu có"),
      ("Thuốc Nam, thuốc Bắc", "Đi được nhưng có rủi ro, có phụ thu theo kg"),
      ("Thực phẩm chức năng", "Đi được nhưng có rủi ro, gửi số lượng vừa đủ dùng"),
      ("Điện thoại, laptop, đồ điện tử có pin", "Đi được nhưng có rủi ro; pin rời thì không nhận")]
KHONG = "Rau củ và trái cây tươi · Pin rời, sạc dự phòng · Rượu, bia · Thuốc lá"
NHAN = ("đồ khô và đặc sản quê, cá khô, mực khô, tôm khô, nước mắm và mắm các loại, bánh kẹo, mứt Tết, "
        "cà phê, trà, hành phi, yến sào, sâm và đông trùng hạ thảo, mỹ phẩm, nước hoa, quần áo giày dép, "
        "đồng hồ, nhạc cụ, máy móc linh kiện, sách vở tài liệu, hàng mẫu và hàng kinh doanh số lượng lớn")
IMG = lambda f, alt, cap: f'<figure><img src="/images/real/{f}" alt="{alt}" style="width:100%;max-width:800px;height:auto;border-radius:8px" /><figcaption>{cap}</figcaption></figure>'


def bang_hang(vn):
    r = "".join(f"<tr><td><strong>{t}</strong></td><td>{g}</td></tr>" for t, g in DK)
    return f"""<h2>Gửi đi {vn} được những gì?</h2>
<p>Đây là câu hỏi đầu tiên của gần như mọi người gửi đồ ăn sang châu Âu, nên trả lời thẳng trước. Danh sách dưới đây là chính sách thật của Minh Thiện Logistics cho tuyến châu Âu, không phải chép luật chung chung.</p>
<h3>Nhận gửi bình thường</h3>
<p>{NHAN.capitalize()} — nhóm này đi đều, không phụ thu riêng, chỉ cần đóng gói tử tế.</p>
<h3>Nhận nhưng có điều kiện hoặc có phụ thu</h3>
<p>Nhóm này vẫn gửi được, nhưng nhân viên sẽ báo trước khi nhận hàng — và bạn nên coi việc được báo trước là dấu hiệu tốt, không phải dấu hiệu xấu.</p>
<table><thead><tr><th>Mặt hàng</th><th>Điều kiện</th></tr></thead><tbody>{r}</tbody></table>
<h3>Không nhận</h3>
<p>{KHONG}. Bốn nhóm này không có ngoại lệ cho tuyến châu Âu.</p>
<p>Danh sách đầy đủ 41 nhóm mặt hàng xem tại <a href="/hang-gui-duoc/chau-au">bảng hàng gửi đi châu Âu</a>.</p>"""


def phan_con_lai(vn):
    return f"""<h2>Lịch bay và giờ chốt hàng đi {vn}</h2>
<p>Chi tiết này quyết định hàng của bạn đi chuyến nào, mà hiếm nơi nói ra. Tuyến châu Âu của Minh Thiện có <strong>chuyến bay thứ Ba và thứ Năm hằng tuần</strong>, <strong>nhận chốt hàng từ thứ Bảy đến thứ Tư</strong>.</p>
<p>Nghĩa là: hàng gửi trong tuần được gom rồi bay theo chuyến gần nhất. Thời gian vận chuyển tính từ lúc hàng <em>rời Việt Nam</em>, không phải từ lúc bạn giao hàng — nên giao sát ngày bay thì kiện đó lên chuyến luôn, còn giao ngay sau chuyến thì chờ chuyến kế.</p>
<p>Thời gian tới {vn}: <strong>đi nhanh 5–7 ngày làm việc</strong>, <strong>đi tiết kiệm 8–15 ngày làm việc</strong>. Ngày làm việc không tính cuối tuần và ngày lễ ở cả hai đầu.</p>
{IMG("kien-hang-carton.jpg", f"Thùng hàng đóng gói chuẩn xuất khẩu gửi đi {vn}", "Hàng được gom theo chuyến, đóng gói chuẩn xuất khẩu trước khi ra sân bay")}
<h2>Thuế và VAT khi hàng vào châu Âu</h2>
<p>Khác với nhiều tuyến khác, <strong>EU thu VAT trên hàng nhập từ nước ngoài</strong>, và cách thu thì mỗi nước thành viên áp dụng hơi khác nhau. Hàng giá trị cao còn có thể chịu thêm thuế nhập khẩu.</p>
<p>Vì vậy, trước khi gửi hãy hỏi rõ hai điều: <strong>cước đã gồm khoản nào chưa</strong>, và <strong>người nhận ở {vn} có phải đóng thêm gì khi nhận hàng không</strong>. Đây là chỗ hay phát sinh nhất và cũng là chỗ dễ so giá lệch nhất giữa các đơn vị. Gọi {HL} để được tư vấn theo đúng món hàng và giá trị lô hàng của bạn.</p>
<h2>Đóng gói: bốn nhóm cần làm khác nhau</h2>
<ul>
<li><strong>Đồ khô và đặc sản:</strong> hút chân không từng gói nhỏ thay vì một túi to, giữ nguyên bao bì gốc có nhãn và hạn sử dụng. Hàng sang chiết vào hộp không tên là nhóm bị hỏi tới nhiều nhất ở hải quan.</li>
<li><strong>Đồ có mùi mạnh</strong> (mắm, khô, ruốc): bọc hai lớp, để riêng một góc thùng, đừng để chung ngăn với quần áo.</li>
<li><strong>Chai lọ:</strong> ưu tiên chai nhựa thay thuỷ tinh khi có lựa chọn; bọc miệng chai bằng màng thực phẩm trước khi vặn nắp để chống rò, đặt đứng giữa thùng và chèn quần áo xung quanh.</li>
<li><strong>Thuốc men:</strong> để nguyên vỉ nguyên hộp, kèm toa nếu có, gửi số lượng vừa đủ dùng cho một người — lô lớn dễ bị coi là hàng kinh doanh.</li>
</ul>
<h2>Ghi địa chỉ người nhận ở {vn}</h2>
<ul>
<li>Ghi đủ <strong>số nhà, tên đường, mã bưu chính, thành phố và tên nước</strong>. Mã bưu chính ở châu Âu là bắt buộc, thiếu là hàng dễ nằm kho.</li>
<li><strong>Số điện thoại người nhận kèm mã quốc gia</strong> — bên giao hàng gọi trước khi tới.</li>
<li>Ở chung cư thì ghi rõ tầng, số căn, và tên trên chuông cửa nếu khác tên người nhận. Ở châu Âu, bưu tá thường tìm theo tên trên chuông chứ không theo số căn.</li>
<li>Viết địa chỉ bằng đúng chính tả bản địa, không bỏ dấu và không dịch sang tiếng Việt.</li>
</ul>
<h2>Gửi từ tỉnh khác có được không?</h2>
<p>Được. Minh Thiện lấy hàng tận nơi miễn phí trong TP.HCM; ở tỉnh thì nhắn Zalo {HL} để được hướng dẫn gửi hàng về kho. Kho chính tại 5/5 Nguyễn Văn Vĩnh, Phường Tân Sơn Nhất, TP.HCM — sát sân bay Tân Sơn Nhất; chi nhánh Nha Trang tại 45 Nguyễn Xiển, P. Bắc Nha Trang.</p>
<h2>Cước gửi đi {vn} bao nhiêu?</h2>
<p>Cước tính theo mức cao hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao chia 5000), cộng phụ thu nếu món hàng thuộc nhóm đặc biệt ở bảng trên. Nhập số ký vào công cụ dưới đây để có mức ước tính ngay, hoặc gửi ảnh kiện hàng qua Zalo {HL} để được báo giá đúng món của bạn.</p>
<p>[[tinh-cuoc]]</p>"""


FAQ_THEM = lambda vn: [
    (f"Gửi thực phẩm đi {vn} được không?",
     f"Được. Đồ khô, đặc sản quê, cá khô, mực khô, tôm khô, nước mắm, bánh kẹo, mứt, cà phê, trà đều gửi bình thường đi {vn}. Riêng giò chả, thịt khô, sữa, trứng thì vẫn gửi được nhưng có phụ thu và có rủi ro bị giữ ở đầu châu Âu. Rau củ và trái cây tươi thì không nhận."),
    (f"Gửi thuốc đi {vn} được không?",
     f"Được, cả thuốc tây lẫn thuốc Nam thuốc Bắc và thực phẩm chức năng, nhưng thuộc nhóm có phụ thu và có rủi ro bị hải quan giữ. Nên để nguyên vỉ nguyên hộp, kèm toa nếu có, và gửi số lượng vừa đủ dùng cho một người. Gọi {HL} để được tư vấn trước khi gửi."),
    (f"Gửi hàng đi {vn} bay ngày nào, chốt hàng lúc nào?",
     f"Tuyến châu Âu có chuyến bay thứ Ba và thứ Năm hằng tuần, nhận chốt hàng từ thứ Bảy đến thứ Tư. Thời gian tới {vn}: đi nhanh 5–7 ngày làm việc, đi tiết kiệm 8–15 ngày làm việc, tính từ khi hàng rời Việt Nam."),
    (f"Người nhận ở {vn} có phải đóng thuế không?",
     f"EU thu VAT trên hàng nhập từ nước ngoài và mỗi nước thành viên áp dụng hơi khác nhau; hàng giá trị cao còn có thể chịu thêm thuế nhập khẩu. Hãy hỏi rõ cước đã gồm khoản nào và người nhận có phải đóng thêm gì không trước khi gửi — gọi {HL} để được tư vấn theo đúng lô hàng của bạn."),
]

con = sqlite3.connect(DB, timeout=30)
dem = lambda c: len(html.unescape(re.sub(r"<[^>]+>", " ", c or "")).split())
CAM = ("qua-tang-dong-goi", "dong-goi-giao-kien")

for slug in SLUGS:
    row = con.execute("select title, content, faqJson from Article where slug=?", (slug,)).fetchone()
    if not row:
        print(f"!! không thấy {slug}")
        continue
    title, c, fj = row
    m = re.match(r"^Gửi Hàng Đi (.+?):", title or "")
    vn = m.group(1).strip() if m else slug
    if "Gửi đi " + vn + " được những gì?" in c:
        print(f"   {slug}: đã bổ sung rồi, bỏ qua")
        continue

    moi = c
    # Bảng mặt hàng: chèn ngay trước mục quy định EU nếu có, không thì trước mục giá
    for moc in ("<h2>Quy định gửi hàng vào EU", "<h2>Giá cước và thời gian", "<h2>Quy trình gửi hàng"):
        if moc in moi:
            moi = moi.replace(moc, bang_hang(vn) + "\n" + moc, 1)
            break
    else:
        moi = bang_hang(vn) + "\n" + moi

    # Phần còn lại: chèn trước mục Liên hệ
    moc2 = "<h2>Liên hệ Minh Thiện Logistics"
    moi = moi.replace(moc2, phan_con_lai(vn) + "\n" + moc2, 1) if moc2 in moi else moi + phan_con_lai(vn)

    faq = json.loads(fj or "[]")
    co = {x["q"] for x in faq}
    faq += [{"q": q, "a": a} for q, a in FAQ_THEM(vn) if q not in co]

    cam = [a for a in CAM if a in moi]
    gia = re.findall(r"\d{1,3}\.\d{3}\.\d{3}\s*đ", html.unescape(re.sub(r"<[^>]+>", " ", phan_con_lai(vn) + bang_hang(vn))))
    print(f"{slug} ({vn})")
    print(f"   {dem(c)} → {dem(moi)} chữ | FAQ {len(json.loads(fj or '[]'))} → {len(faq)}"
          + (f"  ⚠️ ẢNH CẤM {cam}" if cam else "")
          + (f"  ⚠️ số tiền lạ {gia}" if gia else "  ✓ sạch"))
    if cam or not WRITE:
        continue
    con.execute("update Article set content=?, faqJson=? where slug=?",
                (moi, json.dumps(faq, ensure_ascii=False), slug))
    con.commit()
    print("   ĐÃ GHI")

print("\n(chạy thử — thêm --ghi để ghi thật)" if not WRITE else "\nXONG")
