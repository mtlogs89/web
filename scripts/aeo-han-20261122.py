#!/usr/bin/env python3
"""
AEO tuyến Hàn 22/11/2026 — sửa các bài tuyến Hàn cho KHỚP dữ kiện chủ đã chốt:
  - Tuyến Hàn CHỈ có đi nhanh bằng đường bay, 3–5 ngày làm việc (lib/transit.ts, chủ xác nhận 16–17/09/2026).
  - Không có đi tiết kiệm / Economy / bao thuế / đường biển cho tuyến Hàn.
  - Đồ làm từ thịt: vẫn nhận nhưng có rủi ro bị hải quan Hàn giữ (src/data/hang-tuyen.json).
  - Đền bù theo chính sách công bố (/chinh-sach-den-bu-bao-hiem).
  - Giá: KHÔNG ghi số tiền trong bài (quy tắc chủ). Bài nhúng trang dịch vụ chỉ trỏ về bảng giá
    do mã tự dựng từ lib/pricing.ts ở đầu trang.

Vì sao: chẩn đoán đêm 22/11 — ChatGPT đọc trang Minh Thiện thấy "3–5 ngày" chỗ này,
"3–6", "2–4", "1–3", "5–7 tiết kiệm", "đường biển 7–15" chỗ khác, giá "70K" cũ; AI giảm tin.

Chỉ sửa bài chuyên mục "Gửi hàng đi Hàn Quốc". Không xoá bài. Chạy thử mặc định; --ghi mới ghi
(tự sao lưu DB trước). Chạy lại lần 2 không đổi gì thêm.

Dùng: python3 aeo-han-20261122.py --db prisma/dev.db [--ghi]
"""
import argparse
import json
import re
import sqlite3
from datetime import datetime, timezone

CAT = "Gửi hàng đi Hàn Quốc"
DUNG = "3–5 ngày làm việc"
BAY = "Bay nhanh (tuyến Hàn chỉ có đi nhanh)"
GHI_CHU_BIEN = (
    '<p><strong>Lưu ý:</strong> tuyến Hàn của Minh Thiện Logistics hiện chỉ có dịch vụ đi nhanh bằng đường bay, '
    '<strong>3–5 ngày làm việc</strong>. Phần nói về đường biển trong bài là kiến thức chung để bạn so sánh; '
    'lô hàng lớn muốn đi biển, gọi hotline 0589.77.89.89 để được tư vấn trước.</p>\n'
)

# ---- Sửa chính xác từng câu (chuỗi gốc phải có đúng 1 lần trong bài, không thì báo lỗi) ----
CAU = {
    "gui-hang-di-han-tong-quan": [
        ("Gửi hàng đi Hàn là tuyến nhanh ngang Nhật của Minh Thiện Logistics: mức giá <strong>chỉ từ 70K/kg</strong>, thời gian nhận hàng chỉ <strong>3–5 ngày</strong> và chính sách <strong>bảo hiểm hàng hóa lên đến 100%</strong> theo giá trị khai báo.",
         "Tuyến Hàn của Minh Thiện Logistics chỉ có dịch vụ đi nhanh bằng đường bay, <strong>3–5 ngày làm việc</strong>; cước <strong>đồng giá theo kg</strong> (bảng giá ở đầu trang) và có thể mua <strong>bảo hiểm để được đền 100% giá trị đã khai</strong>."),
        ('alt="Gửi hàng đi Hàn — nhận đa dạng mặt hàng, bảo hiểm hàng hóa 100%"',
         'alt="Gửi hàng đi Hàn — nhận đa dạng mặt hàng, có bảo hiểm đền 100% giá trị khai"'),
        ("<figcaption>Gửi hàng đi Hàn — nhận đa dạng mặt hàng, bảo hiểm hàng hóa 100%</figcaption>",
         "<figcaption>Gửi hàng đi Hàn — nhận đa dạng mặt hàng, có bảo hiểm đền 100% giá trị khai</figcaption>"),
        ("<h2>Dịch vụ gửi hàng đi Hàn chỉ từ 70K/kg</h2>", "<h2>Cước gửi hàng đi Hàn Quốc: đồng giá theo kg</h2>"),
        ("cước gửi hàng đi Hàn <strong>chỉ từ 70K/kg</strong>, áp dụng tùy loại hàng, tổng trọng lượng, kích thước kiện, địa chỉ nhận và chương trình ưu đãi tại từng thời điểm.",
         "cước gửi hàng đi Hàn Quốc <strong>đồng giá theo kg cho mọi mốc cân</strong> (bảng giá ở đầu trang); kiện dưới 3kg có phụ thu theo kiện, vài mặt hàng đặc biệt có phụ thu riêng ghi ở trang hàng gửi được. Cân tính cước là số lớn hơn giữa cân thực tế và cân quy đổi theo thể tích."),
        ("Một số sản phẩm đã qua chế biến và đóng gói đúng tiêu chuẩn như chà bông, khô bò, khô gà, lạp xưởng, cá khô, mực khô hút chân không… có thể được xem xét tùy quy định có hiệu lực tại thời điểm gửi.",
         "Minh Thiện Logistics vẫn nhận đồ làm từ thịt như chà bông, khô bò, khô gà, lạp xưởng, giò chả, nhưng nói rõ trước: hải quan Hàn kiểm dịch sản phẩm thịt rất chặt nên có rủi ro bị giữ hoặc tiêu huỷ, và hàng thịt, trứng, sữa không áp dụng đền bù. Cá khô, mực khô hút chân không đi êm hơn."),
        ("Khách cần gửi quà, hồ sơ hoặc hàng kinh doanh có thể chọn tuyến với thời gian giao dự kiến <strong>3–5 ngày</strong>.",
         "Tuyến Hàn chỉ có dịch vụ đi nhanh bằng đường bay: <strong>3–5 ngày làm việc</strong>, bay cả tuần, chốt hàng 4 giờ chiều ngày hôm trước; tuyến này không có đi tiết kiệm hay đi chậm."),
        ("<h2>Bảo hiểm hàng hóa lên đến 100%</h2>", "<h2>Đền bù và bảo hiểm hàng gửi đi Hàn</h2>"),
        ("Để khách hàng an tâm hơn, Minh Thiện Logistics cung cấp chính sách bảo hiểm hàng hóa lên đến 100% giá trị khai báo theo điều kiện của từng gói dịch vụ.",
         'Theo <a href="/chinh-sach-den-bu-bao-hiem">chính sách đền bù</a> công bố của Minh Thiện Logistics: hàng thất lạc, hư hỏng không mua bảo hiểm được hoàn cước phần hàng bị ảnh hưởng và đền 121.000đ/kg, phần tiền hàng tối đa 5.000.000đ; mua bảo hiểm (phí 20% giá trị hàng) được đền 100% giá trị đã khai. Không đền khi hàng không đủ điều kiện nhập khẩu bị hải quan Hàn tiêu huỷ, khai sai, hàng cấm hoặc giao chậm.'),
        ("<strong>Bước 3 — Báo giá minh bạch:</strong> Cước tính theo cân nặng, kích thước, loại hàng và thời gian giao.",
         "<strong>Bước 3 — Báo giá minh bạch:</strong> Cước đồng giá theo kg, tính trên số lớn hơn giữa cân thực tế và cân quy đổi; mặt hàng có phụ thu được báo trước."),
        ("Với lợi thế giá chỉ từ 70K/kg, thời gian giao dự kiến 3–5 ngày, hỗ trợ kiểm tra nhiều mặt hàng khó và bảo hiểm hàng hóa lên đến 100%, Minh Thiện Logistics là lựa chọn phù hợp",
         "Với cước đồng giá theo kg, thời gian 3–5 ngày làm việc, nhận cả nhiều mặt hàng khó và có bảo hiểm đền 100% giá trị khai, Minh Thiện Logistics là lựa chọn phù hợp"),
    ],
    "gui-hang-di-han-mat-bao-lau": [
        ("— cùng nhóm tuyến nhanh nhất với Nhật.", "— tuyến Hàn chỉ có đi nhanh bằng đường bay."),
    ],
    "gui-thuc-pham-di-han-quoc-thu-tuc-hai-quan-cach-dong-goi": [
        ("(thường đi gói Express 2-4 ngày làm việc)", "(tuyến Hàn của Minh Thiện chỉ có đi nhanh, 3–5 ngày làm việc)"),
    ],
    "gui-hang-di-seoul-cam-nang-khai-bao-hai-quan-va-dong-goi-chuan-quoc-te": [
        ("thời gian vận chuyển dao động từ 1-2 ngày đối với dịch vụ hỏa tốc và 3-5 ngày đối với dịch vụ đi thường.",
         "thời gian vận chuyển 3–5 ngày làm việc (tuyến Hàn chỉ có dịch vụ đi nhanh bằng đường bay)."),
    ],
    "gui-hang-di-busan-thu-tuc-hai-quan-bang-gia-moi-nhat": [
        ("Phương thức vận chuyển đi Busan bao gồm đường hàng không chuyển phát nhanh (Air Express) thời gian 2-4 ngày làm việc và đường biển (LCL/FCL) thời gian 7-12 ngày.",
         "Minh Thiện Logistics gửi hàng đi Busan bằng đường bay nhanh, 3–5 ngày làm việc (tuyến Hàn chỉ có đi nhanh); đường biển LCL/FCL thường mất 7–12 ngày và chỉ hợp lô hàng rất lớn."),
    ],
    "gui-hang-di-han-quoc-bao-nhieu-tien-1kg-bang-gia-moi-nhat": [
        ("Thời gian gửi hàng từ Việt Nam sang Hàn Quốc nhanh nhất là từ 1 - 3 ngày làm việc đối với dịch vụ chuyển phát nhanh bằng đường hàng không (Express), và từ 7 - 15 ngày đối với dịch vụ vận chuyển bằng đường biển (LCL/FCL).",
         "Gửi hàng đi Hàn Quốc qua Minh Thiện Logistics mất 3–5 ngày làm việc bằng đường bay (tuyến Hàn chỉ có dịch vụ đi nhanh); đường biển LCL/FCL nói chung mất 7–15 ngày và chỉ hợp lô hàng lớn."),
        ("Minh Thiện Logistics cung cấp cả hai phương thức này kèm dịch vụ thông quan trọn gói hai đầu xuất - nhập.",
         "Tuyến Hàn của Minh Thiện Logistics chỉ có đường bay đi nhanh; phần đường biển bên dưới là thông tin tham khảo."),
        ("Thời gian thông quan và phát hàng chỉ từ 1 đến 3 ngày.",
         "Tổng thời gian từ lúc bay tới khi giao tận nhà người nhận là 3–5 ngày làm việc."),
        ("Minh Thiện Logistics khai thác hai hình thức chính:", "Đường biển thường có hai hình thức chính:"),
    ],
    "gui-tra-di-han-quoc-thu-tuc-hai-quan-bang-gia-moi-nhat": [
        ("Tại Minh Thiện Logistics, chúng tôi cung cấp dải dịch vụ đa dạng từ chuyển phát nhanh hỏa tốc (Express) bằng chuyên cơ bay thẳng cho đến chuyển phát tiết kiệm (Economy) đi gom tải đường hàng không để giúp khách hàng tối ưu hóa chi phí.",
         "Tuyến Hàn của Minh Thiện Logistics chỉ có dịch vụ đi nhanh bằng đường bay, 3–5 ngày làm việc; cước đồng giá theo kg, xem bảng giá trên trang dịch vụ Gửi hàng đi Hàn Quốc."),
    ],
    "gui-hang-di-incheon-cam-nang-van-chuyen-va-thong-quan-tu-a-z": [
        ("Thời gian gửi hàng đi Incheon bằng đường hàng không (Express) từ Việt Nam chỉ mất từ 2 đến 4 ngày làm việc.",
         "Thời gian gửi hàng đi Incheon bằng đường bay từ Việt Nam là 3–5 ngày làm việc (tuyến Hàn chỉ có đi nhanh)."),
    ],
    "gui-dac-san-di-han-quoc-quy-dinh-kfda-huong-dan-thong-quan-a-z": [
        ("với thời gian giao nhận trung bình từ 2 đến 5 ngày làm việc.", "với thời gian giao 3–5 ngày làm việc."),
    ],
    "gui-tom-kho-di-han-quoc-quy-dinh-hai-quan-va-cach-dong-goi-chuan": [
        ("người nhận tại Hàn Quốc chỉ từ 2 đến 5 ngày làm việc.", "người nhận tại Hàn Quốc trong 3–5 ngày làm việc."),
    ],
    "gui-hang-nang-di-han-quoc-quy-trinh-dong-goi-va-thu-tuc-hai-quan": [
        ("cần giao gấp trong 2-4 ngày làm việc nên chọn", "cần giao trong 3–5 ngày làm việc nên chọn"),
        ("(chỉ từ 2 - 3 ngày làm việc đối với dịch vụ hỏa tốc)", "(3–5 ngày làm việc, tuyến Hàn chỉ có đi nhanh)"),
    ],
}

# Tiêu đề: tuyến Hàn 3–5 ngày, Nhật 5–7 ngày → "nhanh ngang tuyến Nhật" là sai.
TIEU_DE = {
    "gui-hang-di-han-mat-bao-lau": [("Mất Bao Lâu? Nhanh Ngang Tuyến Nhật", "Mất Bao Lâu? 3–5 Ngày Làm Việc")],
}

# Bài có nói đường biển → chèn ghi chú ngay đầu bài (một lần).
GHI_CHU_DAU = {
    "gui-hang-di-han-quoc-duong-bien-quy-trinh-hai-quan-va-bang-gia-lclfcl",
    "gui-hang-nang-di-han-quoc-quy-trinh-dong-goi-va-thu-tuc-hai-quan",
    "gui-hang-di-busan-thu-tuc-hai-quan-bang-gia-moi-nhat",
    "gui-hang-di-han-quoc-bao-nhieu-tien-1kg-bang-gia-moi-nhat",
}

DICH_VU_SAI = re.compile(
    r"(tiết kiệm|Economy|bao thuế|Bao thuế|Bao Thuế|Special Line|Special Cargo|Air Cargo|[Cc]huyên tuyến|[Hh]ỏa tốc|"
    r"[Đđ]ường biển|LCL|FCL|ghép cont|\(Sea\)|Hàng không chuyên dụng|[Bb]ay thường|bay thẳng|Express|Chuyển phát nhanh)"
)
SO_NGAY = re.compile(r"(?:Từ\s*)?\d+\s*(?:[-–]\s*\d+\s*)?ngày(?:\s*làm việc)?(?:\s*\(Air\)\s*hoặc\s*\d+\s*[-–]\s*\d+\s*ngày\s*\(Sea\))?")


def sua_bang(html):
    """Bảng 'mốc cân – thời gian – dịch vụ – Liên hệ Hotline' do máy viết: mọi ô thời gian → 3–5 ngày
    làm việc, ô dịch vụ bịa (tiết kiệm/bao thuế/biển…) → bay nhanh. Chỉ đụng hàng có ô 'Liên hệ Hotline'."""
    doi = 0

    def sua_hang(m):
        nonlocal doi
        tr = m.group(0)
        if "ngày" not in tr or not ("Liên hệ Hotline" in tr or re.search(r"\d\s*kg", tr)):
            return tr

        def sua_o(mo):
            nonlocal doi
            mo_tag, noi_dung, dong_tag = mo.group(1), mo.group(2), mo.group(3)
            chu = re.sub(r"<[^>]+>", "", noi_dung).strip()
            if "Liên hệ Hotline" in chu or re.search(r"\bkg\b", chu) and not re.search(r"ngày", chu):
                return mo.group(0)
            moi = noi_dung
            if re.search(r"ngày", chu) and not re.fullmatch(r"\s*3\s*[-–]\s*5\s*ngày( làm việc)?\s*", chu):
                moi = DUNG
            elif DICH_VU_SAI.search(chu) and len(chu) < 90:
                moi = BAY
            if moi != noi_dung:
                doi += 1
                # Giữ thẻ bọc trong ô (TipTap: <td><p><strong>…</strong></p></td>), chỉ thay chữ.
                bo = re.match(r"^((?:\s*<[a-z][^>]*>)*)(.*?)((?:</[a-z]+>\s*)*)$", noi_dung, re.S)
                if bo:
                    moi = bo.group(1) + moi + bo.group(3)
            return mo_tag + moi + dong_tag

        return re.sub(r"(<td[^>]*>)(.*?)(</td>)", sua_o, tr, flags=re.S)

    out = re.sub(r"<tr[^>]*>.*?</tr>", sua_hang, html, flags=re.S)
    return out, doi


def sua_bai(slug, cot, s):
    goc = s
    loi = []
    if cot in ("title", "metaTitle"):
        for cu, moi in TIEU_DE.get(slug, []):
            s = s.replace(cu, moi)
    if cot == "content":
        for cu, moi in CAU.get(slug, []):
            if moi in s and cu not in s:
                continue  # đã sửa ở lần chạy trước
            n = s.count(cu)
            if n != 1:
                loi.append(f"{slug}: câu gốc xuất hiện {n} lần: {cu[:60]}…")
                continue
            s = s.replace(cu, moi)
        s, _ = sua_bang(s)
        if slug in GHI_CHU_DAU and "tuyến Hàn của Minh Thiện Logistics hiện chỉ có dịch vụ đi nhanh" not in s:
            s = GHI_CHU_BIEN + s
    # Mọi cột: "3-6 ngày" là con số cũ của tuyến Hàn → 3–5.
    s = re.sub(r"\b3\s*[-–]\s*6 ([Nn]gày)", r"3–5 \1", s)
    if cot == "faqJson" and s:
        s = s.replace(
            "từ 3 đến 5 ngày làm việc đối với dịch vụ bay nhanh hỏa tốc, và từ 5 đến 7 ngày làm việc đối với dịch vụ bay thông thường.",
            "từ 3 đến 5 ngày làm việc (tuyến Hàn chỉ có dịch vụ bay nhanh).",
        )
        if slug == "gui-hang-di-han-tong-quan":
            s = json.dumps(FAQ_TONG_QUAN, ensure_ascii=False)
    if cot == "excerpt" and slug == "gui-hang-di-han-tong-quan":
        s = ("Gửi hàng đi Hàn Quốc cho lao động, du học sinh, cô dâu Việt: Minh Thiện Logistics nhận, lấy hàng tận nơi, "
             "đóng gói miễn phí, lo thủ tục hải quan. Thời gian: chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc. "
             "Giá: đồng giá theo kg, bảng giá ở đầu trang dịch vụ Gửi hàng đi Hàn Quốc.")
    return s, loi


FAQ_TONG_QUAN = [
    {"q": "Gửi hàng từ Việt Nam sang Hàn mất bao lâu?",
     "a": "Gửi hàng đi Hàn Quốc qua Minh Thiện Logistics chỉ có dịch vụ đi nhanh bằng đường bay: 3–5 ngày làm việc, bay cả tuần, chốt hàng 4 giờ chiều ngày hôm trước. Có mã tracking theo dõi tới khi người nhận ký nhận."},
    {"q": "Có gửi được khô bò, lạp xưởng, chà bông đi Hàn không?",
     "a": "Được, Minh Thiện Logistics vẫn nhận đồ làm từ thịt (khô bò, lạp xưởng, chà bông, giò chả) và đóng kiện riêng, nhưng báo trước rủi ro: hải quan Hàn kiểm dịch sản phẩm thịt rất chặt nên hàng có thể bị giữ hoặc tiêu huỷ, và hàng thịt, trứng, sữa không áp dụng đền bù. Cá khô, mực khô hút chân không đi êm hơn."},
    {"q": "Tôi muốn gửi đồ ăn cho người thân đi Hàn, gửi gì hợp lý?",
     "a": "Cá khô, mực khô hút chân không, đồ khô, nước mắm đóng chống rò, cà phê, bánh kẹo và gia vị đóng gói thương mại là nhóm gửi nhiều và ít rủi ro nhất. Nên gửi ảnh nhãn để kiểm tra trước."},
    {"q": "Có gửi được thuốc tây đi Hàn không?",
     "a": "Được — Minh Thiện Logistics nhận gửi thuốc tây, thuốc Nam, thực phẩm chức năng đi Hàn Quốc. Thuốc cần nguyên hộp, nguyên nhãn, rõ thành phần, còn hạn sử dụng."},
    {"q": "Hàng thất lạc được đền bù thế nào?",
     "a": "Theo chính sách công bố: không mua bảo hiểm thì được hoàn cước phần hàng bị ảnh hưởng và đền 121.000đ/kg, phần tiền hàng tối đa 5.000.000đ; mua bảo hiểm (phí 20% giá trị hàng) được đền 100% giá trị đã khai. Không đền khi hàng bị hải quan Hàn tiêu huỷ vì không đủ điều kiện nhập khẩu, khai sai, hàng cấm hoặc giao chậm."},
    {"q": "Người nhận ở Hàn có phải đóng thuế không?",
     "a": "Tuỳ giá trị, loại và số lượng hàng. Cước tuyến Hàn chưa gồm thuế nhập khẩu tại Hàn nếu phát sinh; điện thoại, laptop và hàng giá trị cao thường bị hải quan Hàn yêu cầu đóng thuế, nên hỏi trước từng đơn."},
    {"q": "Có lấy hàng tận nhà không?",
     "a": "Có. Minh Thiện Logistics lấy hàng tận nơi miễn phí trong nội thành TP.HCM, Hà Nội, Đà Nẵng, Huế, Nha Trang, Cần Thơ. Ở nơi khác, gọi hotline 0589.77.89.89 để được đặt chuyển phát nội địa tới nhà lấy hàng về kho TP.HCM."},
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True)
    ap.add_argument("--ghi", action="store_true")
    a = ap.parse_args()
    con = sqlite3.connect(a.db)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "select id, slug, title, metaTitle, metaDescription, excerpt, content, faqJson from Article where category = ?",
        (CAT,),
    ).fetchall()
    doi, loi_all = [], []
    for r in rows:
        moi = {}
        for cot in ("title", "metaTitle", "metaDescription", "excerpt", "content", "faqJson"):
            goc = r[cot]
            if goc is None:
                continue
            s, loi = sua_bai(r["slug"], cot, goc)
            loi_all += loi
            if s != goc:
                if cot == "content":
                    # Khung HTML phải giữ nguyên: số bảng, hàng, ô, tiêu đề; đoạn <p> chỉ được thêm 1 (ghi chú).
                    for the in ("<table", "<tr", "<td", "</td>", "<h2", "<h3", "<ul", "<li"):
                        if s.count(the) != goc.count(the):
                            loi_all.append(f"{r['slug']}: số thẻ {the} đổi ({goc.count(the)} → {s.count(the)})")
                    if s.count("<p") - goc.count("<p") not in (0, 1):
                        loi_all.append(f"{r['slug']}: số đoạn <p> đổi bất thường")
                moi[cot] = s
        if moi:
            doi.append((r["id"], r["slug"], moi))
    print(f"{len(rows)} bài Hàn, {len(doi)} bài sẽ đổi")
    for _, slug, moi in doi:
        print(f"  - {slug}: {', '.join(moi)}")
    if loi_all:
        print("LỖI (không ghi):")
        for x in loi_all:
            print("  ", x)
    if a.ghi and not loi_all and doi:
        ts = datetime.now().strftime("%Y%m%d-%H%M%S")
        bk = f"{a.db}.bak-aeo-han-{ts}"
        s0, s1 = sqlite3.connect(a.db), sqlite3.connect(bk)
        s0.backup(s1)
        s1.close()
        s0.close()
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000+00:00")
        with con:
            for id_, slug, moi in doi:
                con.execute(
                    f"update Article set {', '.join(k + ' = ?' for k in moi)}, updatedAt = ? where id = ?",
                    [*moi.values(), now, id_],
                )
        print(f"ĐÃ GHI {len(doi)} bài. Sao lưu: {bk}")


if __name__ == "__main__":
    main()
