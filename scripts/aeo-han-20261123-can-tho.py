#!/usr/bin/env python3
"""
AEO tuyến Hàn 23/11/2026 — câu "gửi hàng đi Hàn Quốc tại Cần Thơ" / "ở đâu uy tín".

Sửa các bài Hàn đang ghi sai cách lấy hàng ở Cần Thơ, theo quy tắc chủ chốt 22/11/2026
(skill viet-bai-minhthien): ở TP.HCM, Hà Nội, Đà Nẵng, Huế, Nha Trang, Cần Thơ Minh Thiện tới
tận nơi lấy hàng; nơi khác gọi hotline để Minh Thiện đặt chuyển phát nội địa tới nhà lấy;
văn phòng chỉ có TP.HCM + chi nhánh Nha Trang; câu "giao cho người nhận của Minh Thiện tại
Cần Thơ" CHƯA xác nhận — đừng dùng; không viết "lấy tận nơi chỉ ở …"; không ghi số tiền trong bài.

Bài sửa:
  1. gui-hang-di-han-quoc-tai-can-tho — viết lại phần đầu, cách gửi, văn phòng, mục cước
     (tuyến Hàn đồng giá theo kg, bỏ câu "thùng càng nặng giá mỗi ký càng tốt"), hỏi–đáp, tiêu đề.
  2. gui-hang-di-han-quoc-so-lieu-thuc-te — 1 câu "người nhận của Minh Thiện ở Cần Thơ".
  3. so-sanh-cach-gui-hang-di-han-quoc — câu cước theo mốc cân (sai với đồng giá).
  4. gui-hang-di-han-quoc-tu-mien-tay-thu-tuc-hai-quan-dong-goi — mô tả "thông quan 100%".
  5. gui-do-cho-con-lam-viec-o-han-tu-can-tho-dong-goi-sao-cho-chac — câu "Cần Thơ … nên gửi về
     kho TP.HCM", "lấy tận nơi chỉ ở / chỉ áp dụng ở …".

An toàn: đọc bản MỚI NHẤT trong DB ngay lúc chạy (phiên khác vừa sửa 106 bài lúc 08:12 23/11),
mỗi chỗ thay phải khớp đúng số lần mong đợi, ghi bằng UPDATE … WHERE updatedAt = bản vừa đọc
(bài bị ai sửa chen giữa thì không ghi), sao lưu DB trước khi ghi. Không xoá bài nào.

Dùng: python3 aeo-han-20261123-can-tho.py --db prisma/dev.db [--ghi]
"""
import argparse
import json
import re
import sqlite3
from datetime import datetime, timezone

CT = "gui-hang-di-han-quoc-tai-can-tho"

CT_DAU_MOI = """<p><strong>Ở Cần Thơ, Minh Thiện Logistics tới tận nơi lấy hàng gửi đi Hàn Quốc</strong> — bạn nhắn Zalo hoặc gọi <strong>0589.77.89.89</strong> để hẹn giờ, không phải tự chở hàng lên TP.HCM. Ở xa trung tâm Cần Thơ hay ở tỉnh miền Tây khác, gọi hotline để Minh Thiện đặt chuyển phát nội địa tới nhà lấy hàng, hoặc bạn tự gửi chành xe về kho TP.HCM. Hàng về kho được cân, chụp ảnh gửi bạn xác nhận, đóng gói miễn phí rồi bay; tuyến Hàn chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc, bay cả tuần. Theo <a href="/tin-tuc/gui-hang-di-han-quoc-so-lieu-thuc-te">số liệu 125 đơn đi Hàn Minh Thiện nhận từ tháng 6 đến đầu tháng 10/2026</a>, hơn một nửa là khách Cần Thơ và các tỉnh miền Tây, thùng trung bình nặng 13,6kg.</p>
<p>Nhà nào ở Cần Thơ, Vĩnh Long hay An Giang có con đi lao động, đi học hay lấy chồng bên Hàn cũng có lúc cần gửi một thùng đồ quê sang. Bài này nói rõ cách giao hàng, món nào đi được, mất bao lâu và người nhận bên Hàn cần chuẩn bị gì.</p>

<h2>Ở Cần Thơ gửi hàng đi Hàn Quốc bằng cách nào?</h2>
<p><strong>Có hai cách: hẹn Minh Thiện tới tận nơi lấy hàng, hoặc tự gửi chành xe về kho TP.HCM.</strong> Cách nào cũng nên nhắn Zalo trước để được kiểm hàng và báo giá.</p>
<h3>Cách 1: Hẹn Minh Thiện tới tận nơi lấy hàng</h3>
<p>Nhắn Zalo <strong>0589.77.89.89</strong> kèm ảnh hàng, số ký ước chừng và địa chỉ người nhận bên Hàn. Nhân viên kiểm món nào đi được, báo giá, rồi hẹn giờ tới tận nơi lấy hàng ở Cần Thơ. Ở xa trung tâm Cần Thơ (như vùng Sóc Trăng trước đây) hoặc ở tỉnh miền Tây khác như Vĩnh Long, An Giang, Đồng Tháp, Cà Mau, bạn gọi hotline để Minh Thiện đặt chuyển phát nội địa tới nhà lấy hàng. Hàng được chuyển về kho TP.HCM, cân, đóng gói lại và bay theo lịch.</p>
<h3>Cách 2: Tự gửi chành xe về kho TP.HCM</h3>
<p>Nếu nhà gần bến xe hoặc quen chành xe, bạn có thể tự gửi hàng về kho Minh Thiện ở TP.HCM (<strong>5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất</strong>). Nhắn Zalo trước để được hướng dẫn ghi thông tin trên thùng; hàng về tới kho là được cân, chụp ảnh gửi bạn xác nhận, đóng gói và bay. Bài <a href="/tin-tuc/an-giang-gui-do-sang-han-tu-mang-len-hay-gui-xe-ve-kho">gửi đồ sang Hàn từ An Giang</a> so sánh kỹ tự mang, xe khách và chuyển phát nội địa.</p>

<h2>Minh Thiện có văn phòng ở Cần Thơ không?</h2>
<p><strong>Không. Minh Thiện Logistics có trụ sở ở TP.HCM và chi nhánh ở Nha Trang; ở Cần Thơ, Minh Thiện tới tận nơi lấy hàng.</strong> Mọi thùng đi Hàn đều về kho chính ở 5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất, TP.HCM để cân, kiểm, đóng gói và làm thủ tục trước khi bay. Kho làm việc T2–CN 8:00–17:30; muốn tự mang hàng tới thì nhắn Zalo trước để kho chuẩn bị.</p>

"""

CT_GIA_MOI = """<h2>Gửi hàng đi Hàn từ Cần Thơ tính cước thế nào?</h2>
<p><strong>Cước tuyến Hàn đồng giá theo kg cho mọi mốc cân; chỉ kiện nhỏ dưới 3kg có thêm phụ thu kiện.</strong> Cân tính cước là số lớn hơn giữa cân thực và cân quy đổi (Dài × Rộng × Cao)/5000, cân chốt là cân tại kho TP.HCM. Một số món có phụ thu riêng như nước hoa, đồng hồ đeo tay, sâm ngâm mật ong, sách vở; đóng gói, thùng và hút chân không miễn phí. Giá mỗi ký đang áp dụng có ở ô đầu bài và trong <a href="/dich-vu/gui-hang-di-han#tra-loi-nhanh">bảng giá gửi hàng đi Hàn Quốc</a>; nhập số ký vào ô tính cước dưới đây để ước chi phí thùng của bạn.</p>
<p>[[tinh-cuoc]]</p>

"""

CT_TITLE = "Ở Cần Thơ gửi hàng đi Hàn Quốc: hẹn lấy tận nơi, bay 3–5 ngày"
CT_META_TITLE = "Ở Cần Thơ gửi hàng đi Hàn Quốc: lấy tận nơi, bay 3–5 ngày"
CT_META_DESC = ("Ở Cần Thơ, Minh Thiện tới tận nơi lấy hàng đi Hàn Quốc; tỉnh miền Tây khác đặt chuyển phát "
                "hoặc gửi chành xe về kho TP.HCM. Bay 3–5 ngày. Zalo 0589.77.89.89")
CT_EXCERPT = ("Ở Cần Thơ, Minh Thiện Logistics tới tận nơi lấy hàng gửi đi Hàn Quốc: nhắn Zalo hoặc gọi 0589.77.89.89 "
              "để hẹn giờ. Ở xa trung tâm hay ở tỉnh miền Tây khác, gọi hotline để được đặt chuyển phát nội địa tới nhà "
              "lấy hàng, hoặc gửi chành xe về kho TP.HCM. Tuyến Hàn chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc, bay cả "
              "tuần. Hơn một nửa số đơn đi Hàn của Minh Thiện là khách Cần Thơ và miền Tây.")


def ct_faq(cu):
    """Hỏi–đáp mới; giữ nguyên văn 3 câu cũ còn đúng (khô cá/mắm, lạp xưởng, thời gian)."""
    giu = {f["q"].strip(): f["a"] for f in cu}
    can = ["Gửi khô cá, mắm miền Tây đi Hàn được không?", "Gửi lạp xưởng, khô bò đi Hàn được không?",
           "Gửi hàng từ Cần Thơ đi Hàn mất bao lâu?"]
    for q in can:
        assert q in giu, f"hỏi–đáp cũ không còn câu: {q}"
    return [
        {"q": "Ở Cần Thơ gửi hàng đi Hàn Quốc ở đâu?",
         "a": "Không cần mang đi đâu: Minh Thiện Logistics tới tận nơi lấy hàng ở Cần Thơ, bạn nhắn Zalo hoặc gọi 0589.77.89.89 kèm ảnh hàng để hẹn giờ. Hàng được chuyển về kho TP.HCM (5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất) để cân, đóng gói và bay. Muốn tự gửi thì gửi chành xe về kho này."},
        {"q": "Minh Thiện có văn phòng ở Cần Thơ không?",
         "a": "Không. Minh Thiện Logistics có trụ sở ở TP.HCM và chi nhánh ở Nha Trang. Ở Cần Thơ, Minh Thiện tới tận nơi lấy hàng; mọi thùng đi Hàn đều về kho TP.HCM để cân, kiểm, đóng gói và làm thủ tục trước khi bay."},
        {"q": "Ở Vĩnh Long, An Giang, Đồng Tháp, Cà Mau gửi hàng đi Hàn được không?",
         "a": "Được. Gọi hotline hoặc nhắn Zalo 0589.77.89.89 để Minh Thiện đặt chuyển phát nội địa tới nhà lấy hàng, hoặc bạn tự gửi chành xe về kho TP.HCM. Hàng về kho được cân, chụp ảnh gửi bạn xác nhận, đóng gói và bay."},
        {"q": can[0], "a": giu[can[0]]},
        {"q": can[1], "a": giu[can[1]]},
        {"q": can[2], "a": giu[can[2]]},
        {"q": "Người nhận ở Hàn cần chuẩn bị gì?",
         "a": "Mã thông quan cá nhân PCCC (bắt đầu bằng chữ P, người nhận tự đăng ký online với hải quan Hàn), địa chỉ đầy đủ bằng tiếng Hàn kèm mã bưu chính và số điện thoại Hàn. Người ở ký túc xá công ty ghi rõ tên công ty và số phòng để shipper giao không bị hoàn."},
        {"q": "Gửi đồ Tết sang Hàn từ Cần Thơ nên gửi khi nào?",
         "a": "Nên gửi sớm trước Tết Seollal hoặc Chuseok bên Hàn, vì hai kỳ nghỉ này hải quan và giao nhận Hàn nghỉ dài. Tuyến Hàn đi nhanh 3–5 ngày làm việc tính từ khi hàng bay, cộng khoảng một ngày để hàng từ Cần Thơ về kho TP.HCM."},
    ]


def sua_can_tho(row):
    html = row["content"]
    a = html.index("<p>Ở Cần Thơ, Vĩnh Long, Sóc Trăng")
    b = html.index("<figure>")
    cu = html[a:b]
    assert "Cách 1: Giao hàng cho người nhận của Minh Thiện tại Cần Thơ" in cu and "Cách 2: Gửi chành xe về kho TP.HCM" in cu, "phần đầu bài đã khác bản đọc trước"
    html = html[:a] + CT_DAU_MOI + html[b:]
    li_cu = "<li><strong>Giao hàng:</strong> giao cho người nhận của Minh Thiện tại Cần Thơ, hoặc gửi chành xe về kho TP.HCM.</li>"
    li_moi = "<li><strong>Lấy hàng:</strong> Minh Thiện tới tận nơi lấy hàng ở Cần Thơ; ở xa hơn thì gọi hotline để được đặt chuyển phát nội địa tới nhà lấy, hoặc bạn tự gửi chành xe về kho TP.HCM.</li>"
    assert html.count(li_cu) == 1, "không thấy đúng 1 dòng bước 3"
    html = html.replace(li_cu, li_moi)
    g1 = html.index("<h2>Giá gửi hàng đi Hàn từ Cần Thơ</h2>")
    g2 = html.index("<h2>Người nhận bên Hàn cần chuẩn bị gì?</h2>")
    assert "thùng càng nặng thì giá mỗi ký càng tốt" in html[g1:g2]
    html = html[:g1] + CT_GIA_MOI + html[g2:]
    assert "người nhận của Minh Thiện" not in html
    faq = ct_faq(json.loads(row["faqJson"]))
    tags = row["tags"] or ""
    if "gửi hàng đi hàn quốc ở cần thơ" not in tags:
        tags = tags + ",gửi hàng đi hàn quốc ở cần thơ" if tags else "gửi hàng đi hàn quốc ở cần thơ"
    return {"content": html, "title": CT_TITLE, "metaTitle": CT_META_TITLE, "metaDescription": CT_META_DESC,
            "excerpt": CT_EXCERPT, "faqJson": json.dumps(faq, ensure_ascii=False), "tags": tags}


def thay(row, cot, cu, moi, so_lan=1):
    s = row[cot] or ""
    n = s.count(cu)
    assert n == so_lan, f"{row['slug']}.{cot}: thấy {n} chỗ, mong {so_lan}: {cu[:70]}…"
    return s.replace(cu, moi)


def sua_so_lieu(row):
    html = row["content"]
    m = list(re.finditer(r"Khách ở miền Tây có hai cách gửi:.*?để được hướng dẫn\.", html, re.S))
    assert len(m) == 1, f"so-lieu: thấy {len(m)} câu"
    assert "người nhận của Minh Thiện" in m[0].group(0)
    moi = ("Ở Cần Thơ, Minh Thiện tới tận nơi lấy hàng; ở các tỉnh miền Tây khác, gọi hotline <strong>0589.77.89.89</strong> "
           "để Minh Thiện đặt chuyển phát nội địa tới nhà lấy hàng, hoặc gửi chành xe về kho TP.HCM.")
    return {"content": html[:m[0].start()] + moi + html[m[0].end():]}


def sua_so_sanh(row):
    html = row["content"]
    m = list(re.finditer(r"Cước tính theo kg, theo số lớn hơn giữa cân thực và cân quy đổi; thùng càng nặng thì giá mỗi ký càng mềm\. Hàng chất lỏng, nước hoa, đồ có pin tháo rời có phụ thu riêng\.", html))
    assert len(m) == 1, f"so-sanh: thấy {len(m)} câu"
    moi = ("Cước tuyến Hàn đồng giá theo kg cho mọi mốc cân, chỉ kiện nhỏ dưới 3kg có thêm phụ thu kiện; cân tính cước là số lớn hơn "
           "giữa cân thực và cân quy đổi. Một số món có phụ thu riêng như nước hoa, đồng hồ đeo tay (phải tháo pin), sâm ngâm mật ong, sách vở.")
    out = {"content": html[:m[0].start()] + moi + html[m[0].end():]}
    assert "càng nặng" not in (row["faqJson"] or ""), "so-sanh: hỏi–đáp còn câu càng nặng — xem tay"
    return out


def sua_mien_tay(row):
    return {"metaDescription": thay(row, "metaDescription",
            "Minh Thiện Logistics chuyên xử lý mắm, khô, thực phẩm thông quan 100%.",
            "Lấy tận nơi ở Cần Thơ, đóng mắm, đồ khô chống rò, bay 3–5 ngày làm việc.")}


def sua_con_can_tho(row):
    c = row["content"]
    c = thay({**row, "content": c}, "content",
             "Cần Thơ không có văn phòng của chúng tôi nên bạn gửi hàng về kho TP.HCM, nhắn Zalo trước để được hướng dẫn.",
             "Cần Thơ không có văn phòng của chúng tôi, nhưng Minh Thiện tới tận nơi lấy hàng ở Cần Thơ — nhắn Zalo hoặc gọi 0589.77.89.89 để hẹn giờ.")
    c = thay({**row, "content": c}, "content",
             "Cần Thơ không có văn phòng hay điểm nhận của Minh Thiện Logistics. Cách làm là nhắn Zalo gửi ảnh hàng và ký ước chừng, sau đó chuyển hàng về kho TP.HCM bằng xe khách, chành xe hoặc chuyển phát nội địa.",
             "Cần Thơ không có văn phòng hay điểm nhận của Minh Thiện Logistics, nhưng Minh Thiện tới tận nơi lấy hàng ở Cần Thơ. Cách làm là nhắn Zalo gửi ảnh hàng và ký ước chừng để hẹn giờ lấy; nếu muốn tự gửi thì chuyển hàng về kho TP.HCM bằng xe khách hoặc chành xe.")
    cu_li = "lấy hàng tận nơi chỉ ở TP.HCM, Hà Nội, Đà Nẵng, Huế, Nha Trang và Cần Thơ, tỉnh khác gửi về kho TP.HCM sau khi nhắn Zalo. Ở nơi khác, bạn gọi hotline 0589.77.89.89 để được đặt chuyển phát nội địa tới nhà lấy hàng."
    c = thay({**row, "content": c}, "content", cu_li,
             "Minh Thiện tới tận nơi lấy hàng ở TP.HCM, Hà Nội, Đà Nẵng, Huế, Nha Trang và Cần Thơ; ở nơi khác, bạn gọi hotline 0589.77.89.89 để được đặt chuyển phát nội địa tới nhà lấy hàng.",
             so_lan=c.count(cu_li) or 1)
    c = thay({**row, "content": c}, "content",
             "Ngoài TP.HCM và chi nhánh Nha Trang, các tỉnh khác không có văn phòng. Quy trình là nhắn Zalo trước kèm ảnh hàng và ký ước chừng, gửi hàng về kho TP.HCM, kho cân và chụp ảnh gửi bạn xác nhận, đóng gói rồi bay. Lấy hàng tận nơi chỉ áp dụng ở 6 nơi kể trên.",
             "Ngoài TP.HCM và chi nhánh Nha Trang, các tỉnh khác không có văn phòng. Ở Cần Thơ, Đà Nẵng, Hà Nội, Huế, Minh Thiện tới tận nơi lấy hàng; ở tỉnh khác như Đồng Nai, gọi hotline 0589.77.89.89 để được đặt chuyển phát nội địa tới nhà lấy hàng. Hàng về kho TP.HCM được cân, chụp ảnh gửi bạn xác nhận, đóng gói rồi bay.")
    c = thay({**row, "content": c}, "content",
             "<li><strong>Giao hàng tới kho:</strong> TP.HCM mang tới trụ sở hoặc hẹn lấy tận nơi, Nha Trang mang tới chi nhánh, tỉnh khác gửi về kho TP.HCM.</li>",
             "<li><strong>Giao hàng:</strong> TP.HCM mang tới trụ sở hoặc hẹn lấy tận nơi, Nha Trang mang tới chi nhánh; Cần Thơ, Hà Nội, Đà Nẵng, Huế hẹn lấy tận nơi; tỉnh khác gọi hotline để được đặt chuyển phát nội địa tới nhà lấy, hoặc tự gửi về kho TP.HCM.</li>")
    assert not re.search(r"Cần Thơ[^.]{0,80}nên bạn gửi hàng về kho|chỉ áp dụng ở 6 nơi|tận nơi chỉ ở", c)
    for f in json.loads(row["faqJson"] or "[]"):
        t = (f.get("q", "") + " " + f.get("a", ""))
        assert not re.search(r"Cần Thơ[^.]{0,80}(gửi hàng về kho|không có văn phòng[^.]{0,30}nên)|chỉ áp dụng ở|tận nơi chỉ ở", t), "hỏi–đáp bài con-cần-thơ còn câu sai — xem tay: " + t[:160]
    return {"content": c}


SUA = [
    (CT, sua_can_tho),
    ("gui-hang-di-han-quoc-so-lieu-thuc-te", sua_so_lieu),
    ("so-sanh-cach-gui-hang-di-han-quoc", sua_so_sanh),
    ("gui-hang-di-han-quoc-tu-mien-tay-thu-tuc-hai-quan-dong-goi", sua_mien_tay),
    ("gui-do-cho-con-lam-viec-o-han-tu-can-tho-dong-goi-sao-cho-chac", sua_con_can_tho),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True)
    ap.add_argument("--ghi", action="store_true")
    a = ap.parse_args()
    con = sqlite3.connect(a.db)
    con.row_factory = sqlite3.Row
    ke_hoach = []
    for slug, ham in SUA:
        row = con.execute("select * from Article where slug = ?", (slug,)).fetchone()
        assert row, f"không thấy bài {slug}"
        moi = ham(dict(row))
        doi = {k: v for k, v in moi.items() if v != row[k]}
        for k, v in doi.items():
            print(f"[{slug}] {k}: {len(row[k] or '')} → {len(v)} ký tự")
        for k in ("title", "metaTitle", "metaDescription"):
            if k in doi:
                print(f"     {k} = {doi[k]} ({len(doi[k])} ký tự)")
        ke_hoach.append((row["id"], slug, row["updatedAt"], doi))
    if not a.ghi:
        print("Chạy thử xong (chưa ghi). Thêm --ghi để ghi.")
        return
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    bk = f"{a.db}.bak-aeo-han-can-tho-{ts}"
    s1 = sqlite3.connect(bk)
    con.backup(s1)
    s1.close()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000+00:00")
    with con:
        for id_, slug, cu_upd, doi in ke_hoach:
            if not doi:
                continue
            cols = ", ".join(f"{k} = ?" for k in doi) + ", updatedAt = ?"
            cur = con.execute(f"update Article set {cols} where id = ? and updatedAt = ?",
                              (*doi.values(), now, id_, cu_upd))
            assert cur.rowcount == 1, f"{slug} vừa bị sửa chen giữa — dừng, không ghi gì"
    print(f"ĐÃ GHI {sum(1 for k in ke_hoach if k[3])} bài. Sao lưu: {bk}")


if __name__ == "__main__":
    main()
