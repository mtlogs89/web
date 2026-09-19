#!/usr/bin/env python3
"""Chủ chốt 19/09/2026: BỎ chi nhánh Cần Thơ (Chợ Trung Hưng, Thốt Nốt) khỏi web.
- Xoá dòng địa chỉ Cần Thơ, "TP.HCM, Nha Trang, Cần Thơ" → "TP.HCM, Nha Trang", "3 điểm nhận" → "2 điểm nhận".
- Bài "gửi khô cá Cần Thơ" (cả bài về kho Thốt Nốt): ẨN (không xoá) + chuyển hướng sang bài khô cá đi Mỹ.
- Tóm tắt "lấy hàng tận nơi ở miền Tây" → "từ miền Tây" (không còn điểm lấy hàng ở miền Tây).
Dùng: python3 <script> <dev.db> [--ghi]"""
import json, re, sqlite3, sys
from datetime import datetime, timezone
DB, WRITE = sys.argv[1], "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
HIDE = {"gui-kho-ca-can-tho-di-my-gia-re": "gui-ca-kho-muc-kho-di-my"}
RULES = [
    (r"\s*<li>\s*(?:<strong>)?Cần Thơ:?(?:</strong>)?:?\s*Chợ Trung Hưng,?\s*Thốt Nốt\s*</li>", ""),
    (r",\s*Chợ Trung Hưng,?\s*Thốt Nốt\s*\(Cần Thơ\)", ""),
    (r"(1 trong |tới |tại )3 điểm nhận", r"\g<1>2 điểm nhận"),
    (r"TP\.HCM, Nha Trang, Cần Thơ và", "TP.HCM, Nha Trang và"),
    (r"TP\.HCM, Nha Trang, Cần Thơ", "TP.HCM, Nha Trang"),
    (r" — chuyên tuyến đặc sản miền Tây với kho ngay Thốt Nốt, Cần Thơ\.", " — chuyên tuyến đặc sản miền Tây."),
    (r" lấy hàng tận nơi ở miền Tây: Minh Thiện nhận, lấy hàng tận nơi,", " từ miền Tây: Minh Thiện nhận (nhắn Zalo để hẹn cách giao hàng),"),
    # bài yến Mỹ: dòng địa chỉ lồng trong <ul>
    (r"\s*<li>Chợ Trung Hưng, Thốt Nốt, Cần Thơ</li>", ""),
    # bài cua khô / tôm khô / hải sản khô đi Mỹ
    (r"Minh Thiện Logistics có kho ngay <strong>Chợ Trung Hưng, Thốt Nốt, Cần Thơ</strong> — thủ phủ hải sản khô miền Tây\. Mỗi tuần chúng tôi", "Mỗi tuần Minh Thiện Logistics"),
    (r"<h2>Kho Thốt Nốt — lợi thế người miền Tây</h2>\s*<p>(?:(?!</p>).)*</p>", "<h2>Ở miền Tây gửi hải sản khô đi Mỹ thế nào?</h2>\n<p>Bạn ở Cần Thơ, An Giang, Đồng Tháp, Kiên Giang? Gửi hàng qua chành xe về kho Minh Thiện tại <strong>5/5 Nguyễn Văn Vĩnh, TP.HCM</strong>, hoặc nhắn Zalo <strong>0589.77.89.89</strong> để được hướng dẫn — hàng về kho là đóng gói và lên chuyến bay ngay.</p>"),
    (r"hút chân không tại kho Thốt Nốt", "hút chân không tại kho Minh Thiện"),
    (r'\{"q": "Ở Cần Thơ gửi hải sản khô đi Mỹ ở đâu\?", "a": "[^"]*"\}', '{"q": "Ở Cần Thơ gửi hải sản khô đi Mỹ ở đâu?", "a": "Gửi hàng qua chành xe về kho Minh Thiện tại 5/5 Nguyễn Văn Vĩnh, TP.HCM, hoặc nhắn Zalo 0589.77.89.89 để được hướng dẫn cách giao hàng. Hàng về kho là đóng gói, khai báo FDA và lên chuyến bay."}'),
]
con = sqlite3.connect(DB, timeout=30)
changed = {}
for slug, *vals in con.execute("select slug, content, coalesce(faqJson,''), coalesce(excerpt,''), coalesce(metaDescription,''), published from Article"):
    if not vals[4]: continue
    for col, v in zip(["content", "faqJson", "excerpt", "metaDescription"], vals[:4]):
        n = v
        for rx, rep in RULES: n = re.sub(rx, rep, n)
        if n != v: changed.setdefault(slug, {})[col] = n
for slug in HIDE:
    changed.setdefault(slug, {})["published"] = 0
left = []
for slug, cols in changed.items():
    if slug in HIDE: continue
    for col, v in cols.items():
        if isinstance(v, str) and re.search(r"Cần Thơ|Thốt Nốt|Trung Hưng", v): left.append((slug, col))
others = [s for (s, c, f) in con.execute("select slug, content, coalesce(faqJson,'') from Article where published=1") if s not in HIDE and s not in changed and re.search(r"Cần Thơ|Thốt Nốt|Trung Hưng", c + f)]
print("bài sửa:", len(changed), "| còn sót trong bài đã sửa:", left[:5], "| bài khác còn nhắc:", others[:10])
if WRITE:
    with con:
        for slug, cols in changed.items():
            con.execute(f"update Article set {', '.join(k+' = ?' for k in cols)}, updatedAt = ? where slug = ?", [*cols.values(), NOW, slug])
        row = con.execute("select value from SiteSetting where key='article_redirects'").fetchone()
        red = json.loads(row[0]) if row else {}
        red.update(HIDE)
        con.execute("insert into SiteSetting (key, value, updatedAt) values ('article_redirects', ?, ?) on conflict(key) do update set value=excluded.value, updatedAt=excluded.updatedAt", (json.dumps(red, ensure_ascii=False), NOW))
    print("ĐÃ GHI")
