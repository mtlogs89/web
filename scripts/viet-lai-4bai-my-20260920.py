#!/usr/bin/env python3
"""
20/09/2026 — VIẾT LẠI HẲN 4 bài nhóm "chọn công ty gửi hàng đi Mỹ" (chủ yêu cầu
"viết cho đàng hoàng"). Thay toàn bộ phần thân bài, không chắp vá bản cũ.

Khác bản cũ:
  - Văn xuôi giải thích cơ chế, thay vì đổ gạch đầu dòng.
  - Số liệu vận hành THẬT của công ty: tuyến Mỹ bay cả tuần, chốt hàng 10h sáng
    hôm trước, 3–5 / 8–12 ngày làm việc, vùng xa +2–3 ngày (nguồn: file training
    của chủ, sheet Tổng hợp + Thời gian vận chuyển).
  - Ca hàng thật chủ đã duyệt (máy phân tích phải đóng kiện gỗ 55×55×46), nhóm
    nước hoa và bột trà sữa KHÔNG bao thuế đầu nhập.

GIỮ NGUYÊN hai luật:
  - KHÔNG ghi con số giá nào. Có bộ kiểm chặn ghi nếu lọt.
  - KHÔNG dùng qua-tang-dong-goi.jpg / dong-goi-giao-kien.jpg (có xì gà Cohiba,
    chủ cấm từ 07/2026).

Dùng: python3 scripts/viet-lai-4bai-my-20260920.py <dev.db> [--ghi]
"""
import html, os, re, sqlite3, sys

sys.path.insert(0, os.environ.get("BAI_DIR", os.path.join(os.path.dirname(__file__), "bai-my")))
from bai1 import BAI1  # noqa: E402
from bai2 import BAI2  # noqa: E402
from bai3 import BAI3  # noqa: E402
from bai4 import BAI4  # noqa: E402

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
con = sqlite3.connect(DB, timeout=30)
TIEN = re.compile(r"\d{1,3}[.,]\d{3}\s*(đ|vnd)|\d+\s*(triệu|tr)\b", re.I)
ANH_CAM = ("qua-tang-dong-goi", "dong-goi-giao-kien")
dem = lambda c: len(html.unescape(re.sub(r"<[^>]+>", " ", c)).split())

for b in (BAI1, BAI2, BAI3, BAI4):
    row = con.execute("select content from Article where slug=?", (b["slug"],)).fetchone()
    if not row:
        print(f"!! không thấy bài {b['slug']}")
        continue
    moi, cu = b["content"], row[0]
    xau = TIEN.search(html.unescape(re.sub(r"<[^>]+>", " ", moi)))
    cam = [a for a in ANH_CAM if a in moi]
    ok = not xau and not cam
    print(f"{b['slug']}\n   {dem(cu)} → {dem(moi)} chữ, {moi.count('<h2')} mục, {moi.count('<figure')} ảnh"
          + ("  ✓ sạch" if ok else "")
          + (f"  ⚠️ LỌT SỐ TIỀN: {xau.group(0)}" if xau else "")
          + (f"  ⚠️ ẢNH CẤM: {cam}" if cam else ""))
    if not ok or not WRITE:
        continue
    con.execute("update Article set content=? where slug=?", (moi, b["slug"]))
    con.commit()
    print("   ĐÃ GHI")

print("\n(chạy thử — thêm --ghi để ghi thật)" if not WRITE else "\nXONG")
