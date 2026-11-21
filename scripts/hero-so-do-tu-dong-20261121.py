#!/usr/bin/env python3
"""Chữ đầu trang chủ: đổi số đo gõ cứng sang MÃ để web tự điền số mới mỗi tháng (21/11/2026).

Vì sao: audit SEO/AI 21/11/2026 thấy trang chủ tự mâu thuẫn. Đầu trang (SiteSetting home_hero_badge,
home_hero_title, home_hero_subtitle) ghi "91 kiện · tháng 7–9/2026", "Mỹ 9 ngày", "82% về trong 8–12 ngày",
còn khối số ngay bên dưới (đọc delivery_stats, cron do-thoi-gian-giao.py chạy 7h mùng 1 mỗi tháng) đã là
"187 kiện, trung vị 10 ngày, 77% trong vòng 12 ngày". Chữ gõ cứng thì tháng nào cũng sẽ lệch lại.

Mã điền do dienSoGiao() trong src/lib/delivery-stats.ts xử lý ({my_tk_ngay}, {my_tk_kien}, {my_tk_dung_hen},
{my_nhanh_ngay}, {ky}…). Không điền được (chưa có số) thì trang dùng chữ mặc định trong src/lib/settings.ts.

⚠️ CHỈ GHI SAU KHI web đã chạy bản code có dienSoGiao. Ghi trước thì trang chủ hiện nguyên chữ "{my_tk_ngay}".

Cách đổi: chỉ thay khi chữ đang có KHỚP ĐÚNG bản cũ dưới đây. Ai đã sửa tay ở admin thì để nguyên và báo ra.
Trước khi ghi, tự sao lưu DB ra <db>.bak-hero-so-do-<giờ chạy>. Chạy lại không sao (đã đổi thì báo "đã đổi").

Chạy:  python3 scripts/hero-so-do-tu-dong-20261121.py <dev.db>          (chạy thử, in trước/sau)
       python3 scripts/hero-so-do-tu-dong-20261121.py <dev.db> --ghi    (ghi thật)
"""
import sqlite3
import sys
from datetime import datetime, timezone

DOI_SO = [a for a in sys.argv[1:] if not a.startswith("--")]
if len(DOI_SO) != 1:
    sys.exit(__doc__)
DB = DOI_SO[0]
GHI = "--ghi" in sys.argv

DOI = {
    "home_hero_badge": (
        "Số đo thật · 91 kiện · tháng 7–9/2026",
        "Số đo thật · {my_tk_kien} kiện Mỹ · {ky}",
    ),
    "home_hero_title": (
        "Gửi hàng đi Mỹ 9 ngày, đi nhanh 3 ngày",
        "Gửi hàng đi Mỹ {my_tk_ngay} ngày, đi nhanh {my_nhanh_ngay} ngày",
    ),
    "home_hero_subtitle": (
        "Số đo từ hệ thống theo dõi của Minh Thiện Logistics, không phải lời hứa: tuyến Mỹ đi tiết kiệm trung vị"
        " 9 ngày làm việc (82% về trong 8–12 ngày), đi nhanh trung vị 3 ngày. Nhận gửi đi Úc, Canada, Châu Âu,"
        " Nhật, Hàn, Đài Loan, Singapore, Malaysia, Thái Lan và hơn 200 quốc gia. Lấy hàng tận nơi miễn phí"
        " trong TP.HCM.",
        "Số đo từ hệ thống theo dõi của Minh Thiện Logistics, không phải lời hứa: tuyến Mỹ đi tiết kiệm trung vị"
        " {my_tk_ngay} ngày làm việc ({my_tk_dung_hen}% về trong vòng 12 ngày), đi nhanh trung vị {my_nhanh_ngay}"
        " ngày. Nhận gửi đi Úc, Canada, Châu Âu, Nhật, Hàn, Đài Loan, Singapore, Malaysia, Thái Lan và hơn 200"
        " quốc gia. Lấy hàng tận nơi miễn phí trong TP.HCM.",
    ),
}

con = sqlite3.connect(DB)
hien = dict(con.execute("select key, value from SiteSetting where key in (%s)" % ",".join("?" * len(DOI)), list(DOI)))

can_ghi = {}
for key, (cu, moi) in DOI.items():
    v = hien.get(key)
    if v == moi:
        print(f"= {key}: đã đổi rồi")
    elif v == cu:
        print(f"~ {key}\n    trước: {cu}\n    sau:   {moi}")
        can_ghi[key] = moi
    else:
        print(f"! {key}: chữ đang có khác bản cũ (có thể chủ đã sửa ở admin) → ĐỂ NGUYÊN\n    đang có: {v!r}")

if not can_ghi:
    print("Không có gì để ghi.")
    sys.exit(0)
if not GHI:
    print(f"\nChạy thử: {len(can_ghi)} dòng sẽ đổi. Thêm --ghi để ghi thật.")
    sys.exit(0)

gio = datetime.now().strftime("%Y%m%d-%H%M%S")
bak = f"{DB}.bak-hero-so-do-{gio}"
with sqlite3.connect(bak) as dich:
    con.backup(dich)
print(f"\nĐã sao lưu: {bak}")

now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
with con:
    for key, moi in can_ghi.items():
        con.execute("update SiteSetting set value = ?, updatedAt = ? where key = ?", (moi, now, key))
print(f"Đã ghi {len(can_ghi)} dòng.")
