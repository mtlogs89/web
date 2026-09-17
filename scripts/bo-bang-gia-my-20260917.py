#!/usr/bin/env python3
"""Chủ chọn 17/09/2026: BỎ khối bảng giá cũ tuyến Mỹ trong thân bài (1kg 1.382.000đ...), chỉ để
câu hướng dẫn dùng công cụ tính cước / gọi báo giá. Giữ nguyên bảng giá YẾN SÀO (tuyến riêng, theo lạng).
Dùng: python3 <script> <dev.db> [--ghi]"""
import re, sqlite3, sys
from datetime import datetime, timezone
DB, WRITE = sys.argv[1], "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
HUONG_DAN = ('<p>Xem giá cho kiện hàng của bạn bằng <a href="/dich-vu/gui-hang-di-my">công cụ tính cước trên trang gửi hàng đi Mỹ</a>, '
             'hoặc gọi hotline/Zalo <strong>0589.77.89.89</strong> (Ms Min) để được báo giá trong 5 phút.</p>')
KHOI_MOI = ('<h2>Giá gửi hàng đi Mỹ</h2>\n<p>Giá trọn gói <strong>đã bao thuế đầu nhập Mỹ</strong>, tính theo kg — hàng cồng kềnh tính theo cân quy đổi '
            '(Dài × Rộng × Cao)/5000. Miễn phí đóng gói, lấy hàng tận nơi, bay <strong>nhanh 3–5 ngày hoặc tiết kiệm 8–12 ngày làm việc</strong>.</p>\n' + HUONG_DAN)
KIEN_21 = r'\s*<p><em>Kiện trên 21kg: gọi Ms Min <strong>0589\.77\.8989</strong> để nhận giá sỉ tốt hơn\.</em></p>'
BANG = r'<div style="overflow-x:auto">\s*<table(?:(?!</table>).)*?1\.220\.000đ.*?</table>\s*</div>'
# 1) Nguyên mục "Bảng giá gửi hàng đi Mỹ (đường bay, trọn gói bao thuế)": tiêu đề + đoạn dẫn + bảng + dòng 21kg
MUC = re.compile(r'<h2>Bảng giá gửi hàng đi Mỹ \(đường bay, trọn gói bao thuế\)</h2>\s*(?:<p>(?:(?!</p>).)*</p>\s*)?' + BANG + '(?:' + KIEN_21 + ')?', re.S)
# 2) Bảng lẻ (bài đường biển, LCL) — giữ tiêu đề/đoạn dẫn của bài, chỉ thay bảng
BANG_LE = re.compile(BANG + '(?:' + KIEN_21 + ')?', re.S)
TEXT = [  # (slug, cột, cũ, mới)
    ("gui-hang-di-my-tong-quan", "content", "— từ 1.382.000đ/kg, càng nặng càng rẻ.", "— tính theo kg, càng nặng càng rẻ."),
    ("gui-ca-kho-muc-kho-di-my", "content", " (2.624.000đ - 4.460.000đ trọn gói)", ""),
    ("gui-kho-tom-di-my", "content", "gửi 2kg chỉ 1.674.000đ, 5kg = 2.624.000đ trọn gói bao thuế.", "cước tính theo cân thật, trọn gói bao thuế."),
    ("gui-hang-sample-thu-nghiem-di-my", "content", "với giá theo bảng dưới (1kg = 1.382.000đ, 3kg = 2.030.000đ trọn gói).", "với giá trọn gói bao thuế tính theo kg."),
    ("gui-hang-duong-bien-di-my", "content", "<h2>Nếu cần nhanh — bảng giá đường bay tham khảo</h2>", "<h2>Nếu cần nhanh — đi đường bay</h2>"),
    ("gui-hang-di-my-tong-quan", "metaDescription", "trọn gói từ 1.382.000đ/kg đã bao thuế", "trọn gói đã bao thuế"),
    ("gui-ca-kho-muc-kho-di-my", "metaDescription", " Giá từ 1.382.000đ/kg,", ""),
    ("gui-kho-ca-can-tho-di-my-gia-re", "metaDescription", "Giá bao thuế từ 1.382.000đ/kg, ", "Giá trọn gói bao thuế, "),
    ("gui-hang-di-my-tu-ho-chi-minh-tphcm", "metaDescription", "giá bao thuế từ 1.382.000đ/kg, ", "giá trọn gói bao thuế, "),
    ("gui-hang-det-may-quan-ao-di-my", "metaDescription", " bao thuế trọn gói từ 1.382.000đ/kg.", " bao thuế trọn gói."),
]
con = sqlite3.connect(DB, timeout=30)
changed = {}
for slug, content in con.execute("select slug, content from Article where published=1 and content like '%1.220.000đ%' and slug != 'gui-yen-sao-di-my-fda-2026'"):
    c, n1 = MUC.subn(KHOI_MOI, content)
    c, n2 = BANG_LE.subn(HUONG_DAN, c)
    if c != content: changed.setdefault(slug, {})["content"] = c; print(f"  {slug}: mục {n1}, bảng lẻ {n2}")
for slug, col, old, new in TEXT:
    cur = changed.get(slug, {}).get(col) or con.execute(f"select {col} from Article where slug=?", (slug,)).fetchone()[0] or ""
    if old in cur: changed.setdefault(slug, {})[col] = cur.replace(old, new)
    elif new and new in cur: pass
    else: print("  KHÔNG THẤY:", slug, col, old[:50])
left = [(s, c.count("1.382.000đ") + c.count("1.220.000đ")) for s, cols in changed.items() for c in [cols.get("content", "")] if "1.382.000đ" in c or "1.220.000đ" in c]
print("bài sửa:", len(changed), "| còn sót giá cũ:", left)
if WRITE:
    with con:
        for slug, cols in changed.items():
            con.execute(f"update Article set {', '.join(k+' = ?' for k in cols)}, updatedAt = ? where slug = ?", [*cols.values(), NOW, slug])
    print("ĐÃ GHI")
