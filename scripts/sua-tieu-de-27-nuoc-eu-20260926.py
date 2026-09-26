#!/usr/bin/env python3
"""
26/09/2026 — sửa tiêu đề + mô tả cho 27 trang nước Châu Âu.

LÝ DO (đo được, không đoán): 27 trang này dùng chung khuôn tiêu đề
"Gửi Hàng Đi X (X): Cẩm Nang Chi Tiết 2026" và gom **261 lượt hiện / 0 lượt bấm**
trong 28 ngày — 20% lượt hiện của cả web mà không ra một cú bấm nào.
Khách gõ "gửi THỰC PHẨM đi hy lạp" nhưng dòng hiện trên Google không có chữ nào
về thực phẩm hay về hàng nhận/không nhận.

Sửa 3 thứ, KHÔNG đụng một chữ nào trong thân bài:
  1. title      — bỏ lặp tên nước, bỏ "2026", nói thẳng bài trả lời gì.
  2. metaTitle  — đưa "thực phẩm" vào, bỏ "| Minh Thiện" vì layout đã tự thêm
                  "| Minh Thiện Logistics" (đang bị lặp tên công ty 2 lần).
  3. metaDescription — nêu nhóm hàng + thời gian ĐÚNG số chủ chốt 16/09
                  (nhanh 5–7, tiết kiệm 8–15), thay vì "7-15 ngày" đang ghi sai.

Dùng: python3 scripts/sua-tieu-de-27-nuoc-eu-20260926.py <dev.db> [--ghi]
"""
import re, sqlite3, sys

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
HL = "0589.77.89.89"
MAU = re.compile(r"^Gửi Hàng Đi (.+?) \((.+?)\): Cẩm Nang Chi Tiết")

con = sqlite3.connect(DB, timeout=30)
rows = con.execute(
    "select slug, title, metaTitle, metaDescription from Article "
    "where published=1 and title like '%Cẩm Nang Chi Tiết%' order by slug").fetchall()

print(f"Tìm thấy {len(rows)} trang\n")
doi = []
for slug, title, mt, md in rows:
    m = MAU.match(title or "")
    if not m:
        print(f"!! bỏ qua (tiêu đề không đúng khuôn): {slug} — {title}")
        continue
    vn, en = m.group(1).strip(), m.group(2).strip()
    # Tên tiếng Anh chỉ giữ khi khác tên tiếng Việt, để khách gõ "greece" vẫn khớp.
    kem_en = f" ({en})" if en.lower() != vn.lower() else ""

    title_moi = f"Gửi Hàng Đi {vn}: Nhận Gửi Gì, Mất Bao Lâu, Cần Giấy Tờ Gì"
    mt_moi = f"Gửi Thực Phẩm, Hàng Đi {vn}: Nhận Gì, Mấy Ngày Tới"
    md_moi = (f"Gửi đồ khô, đặc sản, bánh kẹo, thuốc, mỹ phẩm đi {vn}{kem_en}: xem nhóm hàng nhận "
              f"và không nhận. Đi nhanh 5–7 ngày, tiết kiệm 8–15 ngày làm việc. Hotline {HL}.")
    canh = ""
    if len(md_moi) > 160:
        md_moi = (f"Gửi đồ khô, đặc sản, bánh kẹo, thuốc, mỹ phẩm đi {vn}: xem nhóm hàng nhận và "
                  f"không nhận. Nhanh 5–7 ngày, tiết kiệm 8–15 ngày. Hotline {HL}.")
    if len(md_moi) > 160:
        canh = f"  ⚠️ mô tả {len(md_moi)} ký tự"
    doi.append((slug, title_moi, mt_moi, md_moi))
    print(f"{slug}")
    print(f"   cũ : {title}")
    print(f"        {mt}")
    print(f"   mới: {title_moi}")
    print(f"        {mt_moi}")
    print(f"        {md_moi[:120]}…{canh}")
    print()

print(f"Sẽ sửa {len(doi)} trang (chỉ tiêu đề + mô tả, KHÔNG đụng thân bài).")
if WRITE:
    for slug, t, mt, md in doi:
        con.execute("update Article set title=?, metaTitle=?, metaDescription=? where slug=?", (t, mt, md, slug))
    con.commit()
    print("ĐÃ GHI")
else:
    print("(chạy thử — thêm --ghi để ghi thật)")
