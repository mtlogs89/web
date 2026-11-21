#!/usr/bin/env python3
"""Bài viết: giờ làm 8:00–17:30, bỏ "hỗ trợ 24/7", "hơn 10 năm" là của ĐỘI NGŨ (chủ chốt 21/11/2026).

Vì sao: audit SEO/AI 21/11/2026 thấy web tự mâu thuẫn — header/schema ghi 8:00–21:00, bài trang Mỹ ghi
8h–17h30; trang Giới thiệu ghi "Công ty có hơn 10 năm" trong khi MST 0319241592 cấp 30/10/2025. Chủ chốt:
  - Giờ làm thật: T2–CN 8:00–17:30 (src/lib/site.ts đổi cùng lúc).
  - "Hơn 10 năm kinh nghiệm" là của đội ngũ, không phải của công ty; vẫn KHÔNG ghi năm thành lập.
Hotline mà ghi "hỗ trợ 24/7" thì trái giờ làm → bỏ. "tracking/theo dõi 24/7" (tra đơn trên web) giữ nguyên.

Cách đổi: thay NGUYÊN CỤM, khớp từng chữ, chỉ bài đang hiện (published=1). Cột: content, excerpt,
metaDescription, faqJson, title, h1, metaTitle. faqJson sửa thẳng trên chữ (không dựng lại JSON), có kiểm JSON
còn hợp lệ. KHÔNG đổi updatedAt: sửa giờ làm không phải cập nhật nội dung, khỏi báo Google đọc lại cả trăm bài.
Cuối cùng quét lại, in chỗ còn sót để người xem tay. Trước khi ghi tự sao lưu DB ra
<db>.bak-gio-lam-10-nam-<giờ chạy>. Chạy lại không sao (đã đổi thì không khớp mẫu cũ). KHÔNG xoá bài.

Chạy:  python3 scripts/gio-lam-va-10-nam-trong-bai-20261121.py <dev.db>             (chạy thử, đếm)
       python3 scripts/gio-lam-va-10-nam-trong-bai-20261121.py <dev.db> --chi-tiet  (in câu trước/sau)
       python3 scripts/gio-lam-va-10-nam-trong-bai-20261121.py <dev.db> --ghi       (ghi thật)
"""
import html
import json
import re
import sqlite3
import sys
from collections import Counter
from datetime import datetime

DOI_SO = [a for a in sys.argv[1:] if not a.startswith("--")]
if len(DOI_SO) != 1:
    sys.exit(__doc__)
DB = DOI_SO[0]
GHI = "--ghi" in sys.argv
CHI_TIET = "--chi-tiet" in sys.argv
COT = ["content", "excerpt", "metaDescription", "faqJson", "title", "h1", "metaTitle"]

# (tên, mẫu cũ, chữ mới, regex?)
LUAT = [
    # ── Giờ làm ──
    ("giờ 8:00 đến 21:00", "8:00 đến 21:00", "8:00 đến 17:30", False),
    ("giờ 8:00–21:00", "8:00–21:00", "8:00–17:30", False),
    ("giờ 8:00 tới 21:00", "8:00 tới 21:00", "8:00 tới 17:30", False),
    ("giờ 8 giờ đến 21 giờ", "8 giờ đến 21 giờ", "8 giờ đến 17 giờ 30", False),
    # ── Hotline "24/7" trái giờ làm ──
    ("24/7 (hỗ trợ 24/7)", " (hỗ trợ 24/7)", "", False),
    ("24/7 Ms Min (24/7)", "Ms Min (24/7)", "Ms Min", False),
    ("24/7 Hotline hỗ trợ 24/7:", "Hotline hỗ trợ 24/7:", "Hotline:", False),
    ("24/7 tư vấn 24/7:", "tư vấn 24/7:", "tư vấn:", False),
    ("24/7 qua Zalo 24/7", "(hỗ trợ qua Zalo 24/7)", "(hỗ trợ qua Zalo)", False),
    ("24/7 Hotline/Zalo/Viber hỗ trợ", "Hotline/Zalo/Viber hỗ trợ 24/7:", "Hotline/Zalo/Viber:", False),
    ("24/7 Hotline/Zalo hỗ trợ", "Hotline/Zalo hỗ trợ 24/7:", "Hotline/Zalo:", False),
    ("24/7 (Ms Min) hỗ trợ", "(Ms Min) hỗ trợ 24/7", "(Ms Min)", False),
    ("24/7 Ms Min hỗ trợ", "Ms Min hỗ trợ 24/7", "Ms Min", False),
    ("24/7 đường dây nóng", "đường dây nóng hỗ trợ 24/7", "đường dây nóng", False),
    ("24/7 hỗ trợ báo giá", "để được hỗ trợ báo giá 24/7", "để được hỗ trợ báo giá", False),
    ("24/7 tư vấn trực tuyến", "qua hệ thống tư vấn trực tuyến hoạt động 24/7", "qua Zalo hoặc hotline", False),
    ("24/7 nhóm Zalo riêng", "chuyên viên điều phối trực tiếp vận hành 24/7", "chuyên viên điều phối trực tiếp vận hành", False),
    ("24/7 túc trực", "túc trực hỗ trợ 24/7", "hỗ trợ trong giờ làm việc", False),
    ("24/7 tại Tân Sơn Nhất", ", hỗ trợ 24/7 tại Tân Sơn Nhất", ", văn phòng tại Tân Sơn Nhất", False),
    ("24/7 tư vấn miễn phí", "tư vấn miễn phí 24/7", "tư vấn miễn phí", False),
    ("24/7 hotline trạng thái", "hotline hỗ trợ 24/7 trạng thái", "hotline hỗ trợ tra trạng thái", False),
    # ── "Hơn 10 năm" là của đội ngũ ──
    ("10n mẫu châu Âu", "Hơn 10 năm kinh nghiệm tuyến châu Âu", "Đội ngũ hơn 10 năm kinh nghiệm tuyến châu Âu", False),
    ("10n thực tế tại MT", "Với kinh nghiệm thực tế hơn 10 năm tại Minh Thiện Logistics, chúng tôi",
     "Với kinh nghiệm thực tế hơn 10 năm của đội ngũ, chúng tôi", False),
    ("10n khai báo tại MT", "Hơn 10 năm kinh nghiệm điều phối vận hành và trực tiếp khai báo hải quan tại Minh Thiện Logistics, tôi đã",
     "Hơn 10 năm kinh nghiệm điều phối vận hành và trực tiếp khai báo hải quan, tôi đã", False),
    ("10n thực chiến tại MT", "Với hơn 10 năm kinh nghiệm thực chiến tại Minh Thiện Logistics (",
     "Với hơn 10 năm kinh nghiệm thực chiến trong nghề, nay làm tại Minh Thiện Logistics (", False),
    ("10n chúng tôi có", "vì chúng tôi có hơn 10 năm kinh nghiệm thực tế",
     "vì đội ngũ chúng tôi có hơn 10 năm kinh nghiệm thực tế", False),
    ("10n hơn 10 năm qua", "Hơn 10 năm qua, Minh Thiện Logistics đã xây dựng",
     "Với đội ngũ hơn 10 năm trong nghề, Minh Thiện Logistics đã xây dựng", False),
    ("10n năng lực … trong ngành", "Với năng lực điều phối vận hành hơn 10 năm trong ngành logistics, Minh Thiện Logistics",
     "Với đội ngũ điều phối vận hành hơn 10 năm trong ngành logistics, Minh Thiện Logistics", False),
    ("10n năng lực … tại MT", "Với năng lực điều phối vận hành hơn 10 năm tại Minh Thiện Logistics (",
     "Với đội ngũ điều phối vận hành hơn 10 năm kinh nghiệm của Minh Thiện Logistics (", False),
    ("10n đơn vị uy tín có", "là đơn vị vận tải uy tín có hơn 10 năm kinh nghiệm",
     "là đơn vị vận tải uy tín, đội ngũ hơn 10 năm kinh nghiệm", False),
    ("10n MT với hơn", "Minh Thiện Logistics với hơn 10 năm kinh nghiệm điều phối",
     "Minh Thiện Logistics với đội ngũ hơn 10 năm kinh nghiệm điều phối", False),
    ("10n Với hơn …, MT", r"Với hơn 10 năm (kinh nghiệm [^,.<]{3,110}), Minh Thiện Logistics",
     r"Với đội ngũ hơn 10 năm \1, Minh Thiện Logistics", True),
]


def thay(text: str, dem: Counter, vet: list, slug: str, cot: str) -> str:
    for ten, cu, moi, la_regex in LUAT:
        if la_regex:
            text, n = re.subn(cu, moi, text)
        else:
            n = text.count(cu)
            text = text.replace(cu, moi)
        if n:
            dem[ten] += n
            if CHI_TIET:
                vet.append(f"  {slug} [{cot}] {ten} ×{n}")
    return text


def chu(s: str) -> str:
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s or "")))


con = sqlite3.connect(DB)
rows = con.execute(f"select id, slug, {', '.join(COT)} from Article where published = 1").fetchall()
dem: Counter = Counter()
vet: list = []
doi: list = []  # (id, {cot: moi})
for r in rows:
    aid, slug, vals = r[0], r[1], dict(zip(COT, r[2:]))
    moi = {}
    for cot, v in vals.items():
        if not v:
            continue
        v2 = thay(v, dem, vet, slug, cot)
        if v2 != v:
            if cot == "faqJson":
                json.loads(v2)  # lỗi thì dừng luôn, không ghi gì
            moi[cot] = v2
    if moi:
        doi.append((aid, slug, moi))

print(f"Bài đang hiện: {len(rows)} · bài sẽ sửa: {len(doi)}")
for ten, *_ in LUAT:
    print(f"  {dem[ten]:4d}  {ten}")
if CHI_TIET:
    print("\n".join(vet))

# Quét chỗ còn sót (trên bản ĐÃ thay) để xem tay
sau = {aid: moi for aid, _, moi in doi}
sot = Counter()
mau_sot = [
    ("giờ 21", re.compile(r".{0,60}\b(?:21:00|21h|21 giờ)\b.{0,30}")),
    ("hotline 24/7", re.compile(r".{0,40}(?:hỗ trợ|tư vấn|[Hh]otline|Zalo|trực(?! tuyến))(?:(?![Tt]racking)[^.|]){0,25}24/7.{0,20}")),
    ("10 năm của công ty", re.compile(r".{0,50}(?:[Cc]ông ty|Minh Thiện Logistics)(?! với đội ngũ)[^.|]{0,20}(?:có )?hơn 10 năm.{0,30}")),
]
for r in rows:
    aid, slug = r[0], r[1]
    vals = dict(zip(COT, r[2:]))
    vals.update(sau.get(aid, {}))
    t = chu(" | ".join(v or "" for v in vals.values()))
    for ten, p in mau_sot:
        for m in p.finditer(t):
            sot[ten] += 1
            if sot[ten] <= 6:
                print(f"CÒN SÓT [{ten}] {slug}: …{m.group(0)}…")
print("Còn sót:", dict(sot) or "không")

if not doi:
    sys.exit(0)
if not GHI:
    print("\nChạy thử. Thêm --ghi để ghi thật.")
    sys.exit(0)

bak = f"{DB}.bak-gio-lam-10-nam-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
with sqlite3.connect(bak) as dich:
    con.backup(dich)
print(f"\nĐã sao lưu: {bak}")
with con:
    for aid, slug, moi in doi:
        sets = ", ".join(f'"{c}" = ?' for c in moi)
        con.execute(f"update Article set {sets} where id = ?", (*moi.values(), aid))
print(f"Đã ghi {len(doi)} bài.")
