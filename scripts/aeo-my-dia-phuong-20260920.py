#!/usr/bin/env python3
"""
20/09/2026 — đợt AEO tuyến Mỹ, lấp các câu khách hỏi AI mà web chưa trả lời
(bảng khảo sát ~/Desktop/MinhThien-DaoTao/Khao-sat-cau-hoi-AI-tuyen-My.xlsx).

1) VÁ bài "gui-hang-di-my-tu-ho-chi-minh-tphcm" — KHÔNG đẻ bài trùng:
   - thêm mục trả lời thẳng câu 3 "ở Tân Bình chỗ nào tốt" và câu 4 "gần sân bay Tân Sơn Nhất"
   - bỏ chữ "Quận" trong danh sách lấy hàng (quận đã bị xoá, giờ là phường) — vẫn giữ tên cũ
     kèm chữ "cũ" vì khách vẫn gõ tên cũ khi tìm Google
   - gỡ địa chỉ chi nhánh Cần Thơ (công ty đã bỏ chi nhánh này, xem commit cfea4df)
2) ĐĂNG 5 bài theo nơi nhận bên Mỹ: Houston, Little Saigon – Orange County, Seattle,
   Florida, Oregon (câu 119–124 trong bảng khảo sát, web chưa có bài nào).

Chạy thử:  python3 scripts/aeo-my-dia-phuong-20260920.py prisma/dev.db
Ghi thật:  python3 scripts/aeo-my-dia-phuong-20260920.py prisma/dev.db --ghi
"""
import json, re, secrets, sqlite3, sys

from datetime import datetime, timezone

DB = sys.argv[1]
WRITE = "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
HL, HL_RAW = "0589.77.89.89", "0589778989"
GIA_1KG, GIA_5KG = "1.156.244đ", "2.132.522đ"
GIA_NGOAC = f"(giá tạm ước tính, cần liên hệ hotline/Zalo {HL} để biết chi tiết)"
THOI_GIAN = "đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày"

con = sqlite3.connect(DB, timeout=30)

# ───────────────────────────── 1. Vá bài TP.HCM ─────────────────────────────
SLUG_HCM = "gui-hang-di-my-tu-ho-chi-minh-tphcm"

SUA_CHU = [
    # Quận đã bị xoá, gộp thành phường. Giữ tên cũ nhưng ghi rõ là tên cũ.
    ("Quận 1, 3, 5, 7, 10, Bình Thạnh, Gò Vấp, Tân Bình, Tân Phú, Phú Nhuận, Thủ Đức, Bình Tân, Hóc Môn, Củ Chi",
     "khu trung tâm (Quận 1, 3, 5 cũ), Bình Thạnh, Gò Vấp, Tân Sơn Nhất (Tân Bình cũ), Tân Phú, Phú Nhuận, Thủ Đức, Bình Tân, Hóc Môn, Củ Chi"),
    # Công ty đã bỏ chi nhánh Cần Thơ — gỡ địa chỉ, không đụng tới bài nhắm khách Cần Thơ.
    ("<li>Cần Thơ: Chợ Trung Hưng, Thốt Nốt</li>", ""),
    ("<li><strong>Cần Thơ:</strong> Chợ Trung Hưng, Thốt Nốt</li>", ""),
    ("(TP.HCM, Nha Trang, Cần Thơ và các tỉnh lân cận)", "(TP.HCM, Nha Trang và các tỉnh lân cận)"),
]

MUC_SAN_BAY = f"""<h2>Gửi hàng đi Mỹ ở khu Tân Bình cũ, gần sân bay Tân Sơn Nhất</h2>
<p>Kho Minh Thiện Logistics ở <strong>5/5 Nguyễn Văn Vĩnh, Phường Tân Sơn Nhất, TP. Hồ Chí Minh</strong> — chính là khu vực trước đây gọi là Quận Tân Bình, cách sân bay Tân Sơn Nhất chừng vài phút xe. Hàng nhận buổi sáng không phải chạy lòng vòng qua kho trung chuyển nào khác, ra thẳng sân bay lên chuyến.</p>
<ul>
<li><strong>Ở khu Tân Bình cũ, Tân Phú, Phú Nhuận, Gò Vấp:</strong> mang hàng ra kho cho nhanh, hoặc nhắn Zalo {HL} để nhân viên qua lấy tận nhà, không mất phí.</li>
<li><strong>Cần gửi gấp cho kịp chuyến trong ngày:</strong> nhắn Zalo trước 10h sáng — đây là giờ chốt hàng để kịp bay.</li>
<li><strong>Ở xa hơn (Thủ Đức, Bình Tân, Hóc Môn, Củ Chi):</strong> vẫn lấy hàng tận nhà miễn phí, nhắn Zalo trước 15h là đi trong ngày.</li>
</ul>
<p>Bạn muốn biết món hàng của mình có gửi đi Mỹ được không, xem <a href="/hang-gui-duoc/my">bảng 41 nhóm mặt hàng gửi đi Mỹ</a> — ghi rõ loại nào nhận, loại nào có phụ thu, loại nào không nhận.</p>"""

FAQ_THEM_HCM = [
    ("Gửi hàng đi Mỹ ở Tân Bình chỗ nào tốt?",
     f"Kho Minh Thiện Logistics nằm tại 5/5 Nguyễn Văn Vĩnh, Phường Tân Sơn Nhất, TP.HCM — khu vực trước đây là Quận Tân Bình. Mang hàng ra kho hoặc nhắn Zalo {HL} để nhân viên qua lấy tận nhà miễn phí. Giá trọn gói đã bao thuế đầu nhập Mỹ."),
    ("Gửi hàng đi Mỹ gần sân bay Tân Sơn Nhất ở đâu?",
     f"Minh Thiện Logistics có kho tại 5/5 Nguyễn Văn Vĩnh, Phường Tân Sơn Nhất, cách sân bay Tân Sơn Nhất vài phút xe, nên hàng không phải trung chuyển qua kho khác. Hotline/Zalo {HL}, làm việc T2–CN 8:00–21:00."),
    ("Gửi hàng đi Mỹ ở TP.HCM cần chốt hàng trước mấy giờ?",
     f"Nhắn Zalo {HL} trước 10h sáng để kịp chuyến trong ngày. Lấy hàng tận nhà thì nhắn trước 15h là đi trong ngày."),
]


def va_bai_hcm():
    row = con.execute("select content, faqJson from Article where slug=?", (SLUG_HCM,)).fetchone()
    if not row:
        print("!! Không thấy bài TP.HCM — bỏ qua bước 1")
        return
    content, faq_raw = row
    goc = content
    for cu, moi in SUA_CHU:
        content = content.replace(cu, moi)
    if "khu Tân Bình cũ, gần sân bay" not in content:
        # Chèn ngay trước mục "Bảng giá" để phần địa điểm nằm cao trong bài.
        moc = "<h2>Bảng giá gửi hàng đi Mỹ"
        content = content.replace(moc, MUC_SAN_BAY + "\n" + moc, 1) if moc in content else content + MUC_SAN_BAY

    faq = json.loads(faq_raw) if faq_raw else []
    co = {f["q"] for f in faq}
    faq += [{"q": q, "a": a} for q, a in FAQ_THEM_HCM if q not in co]

    print(f"[TP.HCM] nội dung {len(goc)} → {len(content)} ký tự | FAQ {len(json.loads(faq_raw) if faq_raw else [])} → {len(faq)}")
    for cu, _ in SUA_CHU:
        if cu and cu in content:
            print(f"   !! còn sót: {cu[:60]}")
    if WRITE:
        # Giữ nguyên updatedAt để không xáo trộn thứ tự bài.
        con.execute("update Article set content=?, faqJson=? where slug=?",
                    (content, json.dumps(faq, ensure_ascii=False), SLUG_HCM))
        con.commit()
        print("   ĐÃ VÁ")


# ───────────────────────── 2. Năm bài theo nơi nhận ─────────────────────────
def bai(slug, ten, ten_ngan, vung, mo_dau, khu_viet, luu_y, anh, faq_rieng):
    title = f"Gửi Hàng Đi {ten} Từ Việt Nam: Giá, Thời Gian Và Mặt Hàng Gửi Được"
    meta_title = f"Gửi Hàng Đi {ten} - Giá Trọn Gói Bao Thuế, {HL}"
    meta = (f"Gửi hàng từ Việt Nam đi {ten}: giá trọn gói đã bao thuế, đi nhanh 3–5 ngày. "
            f"Nhận đồ khô, thực phẩm, thuốc, mỹ phẩm, quà Tết. Hotline/Zalo {HL}.")[:160]
    excerpt = (f"Nhận gửi hàng đi {ten}: đồ khô, đặc sản, thực phẩm, thuốc, mỹ phẩm, quần áo, hàng kinh doanh. "
               f"Thời gian: {THOI_GIAN}. "
               f"Giá: 1kg {GIA_1KG}, 5kg {GIA_5KG} đã bao thuế {GIA_NGOAC}.")
    content = f"""<p>{mo_dau}</p>
<h2>Gửi hàng đi {ten_ngan} mất bao lâu?</h2>
<p><strong>Đi nhanh 3–5 ngày làm việc</strong>, <strong>đi tiết kiệm 8–12 ngày làm việc</strong> tính từ lúc hàng rời Việt Nam. Người nhận ở vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày. Mỗi kiện có mã theo dõi, tra tại <a href="/tra-cuu">trang tra cứu đơn</a> cho tới khi người nhận ký nhận.</p>
<h2>Gửi hàng đi {ten_ngan} giá bao nhiêu?</h2>
<p>Giá trọn gói <strong>đã bao thuế đầu nhập Mỹ</strong> — người nhận bên đó không phải đóng thêm. Cước tính theo mức cao hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao)/5000. Tham khảo: 1kg khoảng {GIA_1KG}, 5kg khoảng {GIA_5KG} <em>{GIA_NGOAC}</em>.</p>
<p>[[tinh-cuoc]]</p>
{f'<figure><img src="/images/real/{anh}" alt="Kiện hàng đóng gói gửi đi {ten_ngan}" style="width:100%;max-width:800px;height:auto;border-radius:8px" /><figcaption>Hàng được cân và đóng gói tại kho trước khi bay đi Mỹ</figcaption></figure>'}
<h2>Người Việt ở {ten_ngan} hay nhận gì từ nhà gửi sang?</h2>
<p>{khu_viet}</p>
<p>Danh sách đầy đủ 41 nhóm mặt hàng — loại nào nhận, loại nào có phụ thu, loại nào không nhận — xem tại <a href="/hang-gui-duoc/my">bảng hàng gửi đi Mỹ</a>. Vài điểm hay vướng nhất:</p>
<ul>
<li><strong>Đồ khô, đặc sản, bánh kẹo, cà phê, trà:</strong> nhận gửi bình thường.</li>
<li><strong>Nước mắm, gia vị đóng chai:</strong> nhận, phụ thu chất lỏng 300.000đ/kiện, đóng chống rò.</li>
<li><strong>Giò chả, khô bò, sữa, trứng, thuốc tây, thực phẩm chức năng:</strong> vẫn nhận nhưng có phụ thu theo kg và có rủi ro bị hải quan Mỹ giữ — nhân viên báo trước khi nhận hàng.</li>
<li><strong>Rau củ trái cây tươi, pin rời, sạc dự phòng, rượu bia, thuốc lá:</strong> không nhận.</li>
</ul>
<h2>Lưu ý khi ghi địa chỉ người nhận ở {ten_ngan}</h2>
<p>{luu_y}</p>
<ul>
<li>Ghi đủ <strong>số nhà, tên đường, thành phố, viết tắt bang, ZIP code 5 số</strong> — thiếu ZIP là hàng dễ nằm kho.</li>
<li><strong>Bắt buộc có số điện thoại người nhận</strong> (10 số kiểu Mỹ): bên giao hàng gọi trước khi tới, không có số là chậm hoặc trả hàng.</li>
<li>Nhà chung cư, khu có cổng thì ghi rõ số căn hộ (Apt / Unit / Ste) và mã cổng nếu có.</li>
</ul>
<h2>Gửi hàng đi {ten_ngan} theo 4 bước</h2>
<ol>
<li><strong>Nhắn Zalo {HL}:</strong> gửi ảnh hàng, số ký ước chừng và địa chỉ người nhận để nhận báo giá.</li>
<li><strong>Lấy hàng tận nơi:</strong> nhân viên qua nhà lấy, miễn phí trong TP.HCM; ở tỉnh thì hướng dẫn gửi về kho.</li>
<li><strong>Cân và đóng gói:</strong> cân trước mặt khách, chụp ảnh từng kiện, đóng gói chuẩn xuất khẩu miễn phí.</li>
<li><strong>Bay và giao tận nhà:</strong> nhận mã tracking, theo dõi tới khi người nhận ở {ten_ngan} ký nhận.</li>
</ol>
<h2>Vì sao chọn Minh Thiện Logistics</h2>
<ul>
<li>🛃 Giá trọn gói <strong>đã bao thuế đầu nhập Mỹ</strong>, không phát sinh.</li>
<li>📦 Đóng gói chuẩn xuất khẩu miễn phí, hút chân không cho thực phẩm.</li>
<li>🏢 Kho tại 5/5 Nguyễn Văn Vĩnh, Phường Tân Sơn Nhất, TP.HCM — sát sân bay Tân Sơn Nhất.</li>
<li>🛡️ Bảo hiểm hàng hoá tuỳ chọn: có bảo hiểm đền <strong>100% cước + giá trị hàng</strong>; không bảo hiểm đền cước + tối đa 100 USD.</li>
</ul>
<h2>Liên hệ</h2>
<p><strong>Hotline / Zalo: {HL}</strong> (Ms Min) — làm việc T2–CN 8:00–21:00. Gửi ảnh kiện hàng qua Zalo là có báo giá ngay, không cần ra kho. Xem thêm <a href="/dich-vu/gui-hang-di-my">dịch vụ gửi hàng đi Mỹ</a>.</p>"""

    faq = faq_rieng + [
        (f"Gửi hàng từ Việt Nam đi {ten_ngan} mất bao lâu?",
         f"Đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; người nhận ở vùng xa (tuỳ postcode) cộng thêm 2–3 ngày. Mỗi kiện có mã tracking theo dõi tới khi ký nhận."),
        (f"Gửi hàng đi {ten_ngan} giá bao nhiêu một ký?",
         f"Khoảng {GIA_1KG} cho 1kg và {GIA_5KG} cho 5kg, đã bao thuế đầu nhập Mỹ {GIA_NGOAC}. Hàng cồng kềnh tính theo cân quy đổi (Dài × Rộng × Cao)/5000."),
        (f"Người nhận ở {ten_ngan} có phải đóng thuế không?",
         "Không. Giá của Minh Thiện Logistics là giá trọn gói đã bao thuế đầu nhập Mỹ, người nhận không phải đóng thêm khoản nào khi nhận hàng."),
        (f"Gửi đồ ăn, thực phẩm khô đi {ten_ngan} được không?",
         f"Được. Đồ khô, đặc sản, bánh kẹo, cà phê, trà, cá khô, tôm khô đều nhận gửi bình thường. Nước mắm và gia vị đóng chai phụ thu chất lỏng 300.000đ/kiện. Giò chả, khô bò, sữa, trứng vẫn gửi được nhưng có phụ thu và có rủi ro bị hải quan Mỹ giữ — gọi {HL} hỏi trước."),
        (f"Gửi hàng đi {ten_ngan} cần ghi địa chỉ thế nào?",
         "Ghi đủ số nhà, tên đường, thành phố, viết tắt bang và ZIP code 5 số, kèm số điện thoại người nhận ở Mỹ. Nhà chung cư thì ghi thêm số căn hộ (Apt/Unit). Thiếu ZIP hoặc thiếu số điện thoại là hàng dễ bị chậm."),
    ]
    tags = f"gửi hàng đi {ten_ngan.lower()},gửi hàng đi mỹ,{vung.lower()},gửi đồ ăn đi mỹ,gửi quà đi mỹ,bao thuế"
    return dict(slug=slug, title=title, excerpt=excerpt, content=content, cover=f"/images/real/{anh}",
                meta_title=meta_title, meta=meta, faq=faq, tags=tags)


BAI = [
    bai("gui-hang-di-houston-texas-tu-viet-nam", "Houston, Texas", "Houston", "Texas",
        f"Houston là một trong những nơi đông người Việt nhất nước Mỹ, nên đồ nhà gửi sang đây cũng nhiều nhất. Minh Thiện Logistics nhận gửi hàng từ Việt Nam đi Houston và khắp bang Texas, <strong>giá trọn gói đã bao thuế</strong>, đi nhanh 3–5 ngày làm việc. Hotline/Zalo {HL}.",
        "Khu Bellaire (Little Saigon của Houston) và vùng Southwest Houston là nơi nhận nhiều nhất: đồ khô, cá khô mực khô, bánh tráng, cà phê, trà, thuốc nam thuốc bắc, yến sào, mỹ phẩm và quần áo. Dịp Tết thì bánh mứt, lạp xưởng, quà Tết tăng mạnh — nên gửi sớm trước Tết khoảng 3 tuần cho thong thả.",
        "Texas dùng viết tắt <strong>TX</strong>, ZIP code Houston thường bắt đầu bằng 770–775.",
        "thuc-pham-kho-dac-san.jpg",
        [("Gửi hàng đi Houston Texas từ TP.HCM thế nào?",
          f"Nhắn Zalo {HL} kèm ảnh hàng, số ký và địa chỉ người nhận ở Houston để nhận báo giá. Nhân viên lấy hàng tận nhà miễn phí trong TP.HCM, đóng gói chuẩn xuất khẩu rồi bay đi Mỹ, giao tận nhà ở Houston trong 3–5 ngày làm việc (đi nhanh).")]),

    bai("gui-hang-di-little-saigon-orange-county", "Little Saigon, Orange County (California)", "Little Saigon", "California",
        f"Little Saigon ở Westminster – Garden Grove, Orange County là khu người Việt lớn nhất nước Mỹ. Minh Thiện Logistics nhận gửi hàng từ Việt Nam về tận nhà trong khu vực này và khắp California, <strong>giá trọn gói đã bao thuế</strong>. Hotline/Zalo {HL}.",
        "Hàng về Little Saigon nhiều nhất là đồ khô và đặc sản quê: cá khô, mực khô, tôm khô, bánh tráng, cà phê, trà, yến sào, thuốc nam thuốc bắc, mỹ phẩm. Nhiều nhà ở đây cũng nhận hàng kinh doanh số lượng lớn và hàng mẫu — Minh Thiện nhận cả hai, gọi hotline để được báo giá theo lô.",
        "California viết tắt là <strong>CA</strong>; ZIP code khu Westminster – Garden Grove thường là 926xx.",
        "thuc-pham-kho-gui-di.jpg",
        [("Gửi hàng về Little Saigon, Orange County mất bao lâu?",
          "Đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc. California là cửa ngõ hàng không sang Mỹ nên thường nằm ở mức nhanh nhất trong khoảng đó.")]),

    bai("gui-hang-di-seattle-washington-tu-viet-nam", "Seattle, Washington", "Seattle", "Washington",
        f"Seattle và vùng Tacoma, Renton, Kent có cộng đồng người Việt đông và lâu đời. Minh Thiện Logistics nhận gửi hàng từ Việt Nam đi Seattle cùng khắp bang Washington, <strong>giá trọn gói đã bao thuế</strong>, đi nhanh 3–5 ngày làm việc. Hotline/Zalo {HL}.",
        "Đồ khô, thực phẩm đóng gói, cà phê, trà, thuốc nam, yến sào và quà Tết là nhóm hàng về Seattle nhiều nhất. Mùa lạnh có nhiều nhà gửi quần áo và chăn gối — nhóm này cồng kềnh nên cước tính theo cân quy đổi, nén gọn trước khi gửi sẽ rẻ hơn đáng kể.",
        "Washington viết tắt là <strong>WA</strong> — đừng nhầm với Washington D.C. (viết tắt DC) ở bờ Đông; ZIP code vùng Seattle thường là 98xxx.",
        "kien-hang-carton.jpg",
        [("Gửi hàng đi Seattle Washington có khác gì Washington D.C. không?",
          "Khác hẳn, đây là hai nơi cách nhau cả nước Mỹ. Seattle thuộc bang Washington, viết tắt WA, ZIP 98xxx; còn Washington D.C. ở bờ Đông, viết tắt DC. Khi ghi địa chỉ nhớ ghi đúng viết tắt bang và ZIP code để hàng không đi lạc.")]),

    bai("gui-hang-di-florida-tu-viet-nam", "Florida", "Florida", "Florida",
        f"Người Việt ở Florida tập trung nhiều quanh Orlando, Tampa, Jacksonville và Miami. Minh Thiện Logistics nhận gửi hàng từ Việt Nam đi khắp bang Florida, <strong>giá trọn gói đã bao thuế</strong>, giao tận nhà. Hotline/Zalo {HL}.",
        "Đồ khô, đặc sản, cà phê, trà, bánh kẹo, thuốc nam thuốc bắc, thực phẩm chức năng và yến sào là nhóm gửi nhiều nhất. Florida nóng ẩm quanh năm nên thực phẩm khô cần hút chân không kỹ — khâu này Minh Thiện làm miễn phí tại kho.",
        "Florida viết tắt là <strong>FL</strong>; ZIP code trong bang thường bắt đầu bằng 32–34.",
        "hang-kho-da-dang.jpg",
        [("Gửi thực phẩm khô đi Florida có bị hỏng vì nóng ẩm không?",
          f"Hàng được hút chân không và đóng kín tại kho trước khi bay, miễn phí. Với đồ dễ hút ẩm như bánh tráng, cà phê, trà thì nên chọn đi nhanh 3–5 ngày cho chắc. Gọi {HL} để nhân viên tư vấn cách đóng theo đúng món hàng.")]),

    bai("gui-hang-di-oregon-tu-viet-nam", "Oregon", "Oregon", "Oregon",
        f"Portland và vùng Beaverton, Salem là nơi tập trung người Việt ở Oregon. Minh Thiện Logistics nhận gửi hàng từ Việt Nam đi khắp bang Oregon, <strong>giá trọn gói đã bao thuế</strong>, đi nhanh 3–5 ngày làm việc. Hotline/Zalo {HL}.",
        "Hàng về Oregon chủ yếu là đồ khô, đặc sản quê, cà phê, trà, thuốc nam thuốc bắc, yến sào, mỹ phẩm và quà Tết cho gia đình. Nhà nào gửi đồ nặng hoặc cồng kềnh như nồi niêu, đồ gia dụng thì nên hỏi trước vì cước tính theo cân quy đổi.",
        "Oregon viết tắt là <strong>OR</strong>; ZIP code trong bang thường bắt đầu bằng 97.",
        "hang-hoa-da-dang.jpg",
        [("Ở Oregon nhận hàng từ Việt Nam có lâu hơn các bang khác không?",
          "Không đáng kể. Đi nhanh vẫn 3–5 ngày làm việc; chỉ những địa chỉ nằm xa thành phố lớn (tuỳ postcode) mới cộng thêm 2–3 ngày như các bang khác.")]),
]


def dang_bai():
    for b in BAI:
        co = con.execute("select 1 from Article where slug=?", (b["slug"],)).fetchone()
        chu = len(re.sub(r"<[^>]+>", "", b["content"]))
        print(f"[{b['slug']}] {chu} chữ, {len(b['faq'])} FAQ" + (" — ĐÃ CÓ, bỏ qua" if co else ""))
        if co or not WRITE:
            continue
        con.execute("""insert into Article (id, slug, title, excerpt, content, coverImage, category, tags, metaTitle,
                       metaDescription, faqJson, published, views, publishedAt, createdAt, updatedAt)
                       values (?,?,?,?,?,?,?,?,?,?,?,1,0,?,?,?)""",
                    ("c" + secrets.token_hex(12), b["slug"], b["title"], b["excerpt"], b["content"], b["cover"],
                     "Gửi hàng đi Mỹ", b["tags"], b["meta_title"], b["meta"],
                     json.dumps([{"q": q, "a": a} for q, a in b["faq"]], ensure_ascii=False), NOW, NOW, NOW))
        con.commit()
        print("   ĐÃ ĐĂNG")


va_bai_hcm()
print()
dang_bai()
print("\n(chạy thử — thêm --ghi để ghi thật)" if not WRITE else "\nXONG")
