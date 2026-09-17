#!/usr/bin/env python3
"""Thời gian trong 3 bài tổng quan (nhúng vào trang dịch vụ) theo bảng chủ điền 17/09/2026:
Hàn chỉ đi nhanh 3–5 ngày; Nhật chỉ đi nhanh 5–7 ngày; Châu Âu nhanh 5–7 / tiết kiệm 8–15 ngày.
Dùng: python3 <script> <dev.db> [--ghi]"""
import sqlite3, sys
from datetime import datetime, timezone
DB, WRITE = sys.argv[1], "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
RULES = {
    "gui-hang-di-han-tong-quan": [("3–6 ngày", "3–5 ngày"), ("3-6 Ngày", "3-5 Ngày"), ("3-6 ngày", "3-5 ngày")],
    "gui-hang-di-nhat-tong-quan": [("3–6 ngày — tuyến nhanh nhất của Minh Thiện", "5–7 ngày làm việc (tuyến Nhật chỉ có dịch vụ đi nhanh)"),
                                   ("3–6 ngày", "5–7 ngày"), ("3-6 Ngày", "5-7 Ngày"), ("3-6 ngày", "5-7 ngày")],
    "gui-hang-di-chau-au-tong-quan": [("7–15 ngày", "5–7 ngày (đi nhanh) hoặc 8–15 ngày (tiết kiệm)"), ("7-15 ngày", "5-7 ngày (đi nhanh), 8-15 ngày (tiết kiệm)")],
}
COLS = ["content", "faqJson", "metaTitle", "metaDescription", "title"]
con = sqlite3.connect(DB, timeout=30)
for slug, rules in RULES.items():
    row = dict(zip(COLS, con.execute(f"select {','.join(COLS)} from Article where slug=?", (slug,)).fetchone()))
    upd = {}
    for c in COLS:
        v = row[c] or ""
        n = v
        for a, b in rules: n = n.replace(a, b)
        if n != v: upd[c] = n
    print(slug, "→ sửa", list(upd), "| số chỗ:", sum(sum((row[c] or "").count(a) for a, _ in rules) for c in COLS))
    if WRITE and upd:
        with con:
            con.execute(f"update Article set {', '.join(c+' = ?' for c in upd)}, updatedAt = ? where slug = ?", [*upd.values(), NOW, slug])
print("ĐÃ GHI" if WRITE else "(chạy thử)")
