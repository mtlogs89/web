#!/usr/bin/env python3
"""
Sửa nội dung 16/09/2026 (chủ đã chốt):
  1. Gộp bài trùng câu hỏi: bài phụ -> ẨN (published=0, KHÔNG xoá) + chuyển hướng 301 sang bài chính
     (SiteSetting "article_redirects"); FAQ không trùng của bài phụ gộp vào bài chính.
  2. Thời gian vận chuyển Mỹ / Canada / Úc: đi nhanh 3–5 ngày, tiết kiệm 8–12 ngày làm việc,
     vùng sâu vùng xa +2–3 ngày. Sửa FAQ, các bài trụ cột, tiêu đề/mô tả SEO.

Dùng:  python3 sua-noi-dung-20260916.py <đường-dẫn-dev.db>          (chạy thử, không ghi)
       python3 sua-noi-dung-20260916.py <đường-dẫn-dev.db> --ghi    (ghi thật)
"""
import json, re, sqlite3, sys
from datetime import datetime, timezone

DB = sys.argv[1]
WRITE = "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"

# (bài chính, [bài gộp vào])
MERGES = [
    ("gui-nuoc-mam-di-my-thu-tuc-fda-va-cach-dong-goi-chuan-khong-bi-tra-ve", [  # đang chạy Google Ads
        "gui-nuoc-mam-di-my-thu-tuc-fda-va-quy-trinh-dong-goi-chuan",
        "huong-dan-gui-nuoc-mam-di-my-khai-bao-fda-va-dong-goi-chuan-air",
        "gui-nuoc-mam-di-my-fda",
        "cach-gui-nuoc-mam-di-my-hop-phap-thu-tuc-fda-va-dong-goi-chuan",
    ]),
    ("gui-hang-di-thai-lan-bao-nhieu-tien-1kg-bang-gia-moi-nhat", [
        "cuoc-phi-gui-hang-di-thai-lan-bang-gia-va-thu-tuc-thong-quan",
        "gui-hang-di-thai-lan-gia-re-thu-tuc-hai-quan-quy-trinh-tu-a-z",
    ]),
    ("gui-hang-di-han-quoc-bao-nhieu-tien-1kg-bang-gia-moi-nhat", [
        "gui-hang-di-han-quoc-gia-re-bang-gia-va-thu-tuc-tu-a-z",
        "cuoc-gui-hang-di-han-quoc-bao-nhieu-1kg-bang-gia-moi-nhat",
    ]),
    ("gui-hang-di-singapore-bao-nhieu-tien-1kg-bang-gia-va-thu-tuc-moi-nhat", [
        "cuoc-phi-gui-hang-di-singapore-2025-bao-gia-thu-tuc-thong-quan",
        "gui-hang-di-singapore-gia-re-hai-quan-thue-dong-goi-tu-a-z",
    ]),
    ("cuoc-phi-gui-hang-di-malaysia-2025-bang-gia-thu-tuc-hai-quan", [
        "gui-hang-di-malaysia-gia-re-bang-gia-va-thu-tuc-hai-quan-2024",
    ]),
    ("cuoc-phi-gui-hang-di-uc-2025-bang-gia-va-thu-tuc-thong-quan-tu-a-z", [
        "gui-hang-di-uc-gia-re-cach-dong-goi-va-khai-quan-chuan-100",
    ]),
    ("cuoc-phi-gui-hang-di-canada-2025-bang-gia-va-thu-tuc-hai-quan", [
        "gui-hang-di-canada-gia-re-quy-trinh-hai-quan-dong-goi-chuan-2025",
    ]),
    ("gui-hang-di-uc-mat-bao-lau", [
        "gui-hang-di-uc-mat-bao-lau-tien-do-thong-quan-thuc-te-nam-2024",
        "gui-hang-di-uc-nhanh-nhat-bi-quyet-thong-quan-toc-hanh-2-4-ngay",
    ]),
    ("gui-hang-di-canada-mat-bao-lau", ["gui-hang-di-canada-nhanh-nhat-bi-quyet-van-chuyen-2-4-ngay"]),
    ("gui-hang-di-han-mat-bao-lau", ["gui-hang-di-han-quoc-nhanh-nhat-gia-cuoc-va-thu-tuc-hai-quan"]),
    ("gui-hang-di-malaysia-mat-bao-lau-lich-trinh-va-thu-tuc-chi-tiet", ["gui-hang-di-malaysia-nhanh-nhat-cam-nang-van-chuyen-hoa-toc"]),
    ("gui-hang-di-thai-lan-mat-bao-lau-thoi-gian-va-thu-tuc-tu-a-z", ["gui-hang-di-thai-lan-nhanh-nhat-quy-trinh-hai-quan-va-boc-hang-chuan-air-cargo"]),
    ("gui-thuc-pham-di-han-quoc-thu-tuc-hai-quan-cach-dong-goi", ["gui-do-an-di-han-quoc-thu-tuc-hai-quan-va-cach-dong-goi-chuan"]),
    ("gui-thuc-pham-di-singapore-quy-dinh-sfa-va-cam-nang-thong-quan-tu-minh-thien-logistics", ["gui-do-an-di-singapore-thu-tuc-hai-quan-sfa-cach-dong-goi"]),
    ("gui-do-an-di-malaysia-huong-dan-dong-goi-va-hai-quan-tu-chuyen-gia", ["huong-dan-gui-thuc-pham-di-malaysia-thue-quan-va-quy-trinh-2024"]),
    ("gui-thuc-pham-di-thai-lan-quy-dinh-hai-quan-va-bang-gia", ["gui-do-an-di-thai-lan-thu-tuc-hai-quan-cach-dong-goi-tu-a-z"]),
    ("dich-vu-gui-thuc-pham-di-duc-tu-viet-nam-bang-gia-quy-dinh-kinh-nghiem-2025", ["gui-thuc-pham-di-duc-tu-viet-nam-bang-gia-quy-dinh-va-quy-trinh"]),
]

TIME_Q = re.compile(r"bao lâu|mấy ngày|bao nhiêu ngày|thời gian (vận chuyển|giao|gửi|nhận|chuyển phát)|nhanh nhất", re.I)
PRICE_Q = re.compile(r"bao nhiêu tiền|giá|cước|chi phí|bảng giá", re.I)
# Câu hỏi thời gian KHÔNG phải thời gian bay tiêu chuẩn → giữ nguyên câu trả lời.
KEEP_Q = re.compile(r"yến|hải quan.*giữ|bị giữ|về việt nam|trước bao lâu|giữ lạnh|lưu kho|lưu bãi|biển|LCL|FCL|kiểm dịch ngẫu nhiên|mẫu.*tiền|đăng ký", re.I)
MAX_FAQ = 10

ROUTES = {"Gửi hàng đi Mỹ": "Mỹ", "Gửi hàng đi Canada": "Canada", "Gửi hàng đi Úc": "Úc"}


def transit_answer(country):
    return (f"Gửi hàng đi {country} bằng đường bay có 2 lựa chọn: đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc. "
            "Địa chỉ nhận ở vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày làm việc. "
            "Có mã tracking theo dõi tới khi người nhận ký nhận.")


FAST = "đi nhanh 3–5 ngày hoặc tiết kiệm 8–12 ngày làm việc"
# (slug, cột, chuỗi cũ, chuỗi mới) — chuỗi cũ phải có đúng trong dữ liệu, không có thì báo.
EDITS = [
    ("gui-hang-di-my-mat-bao-lau", "content", "<strong>Gửi hàng đi Mỹ mất 8-12 ngày làm việc</strong> bằng đường hàng không",
     "<strong>Gửi hàng đi Mỹ bằng đường hàng không mất 3-5 ngày làm việc nếu đi nhanh, 8-12 ngày làm việc nếu đi tiết kiệm</strong>; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2-3 ngày"),
    ("gui-hang-di-my-mat-bao-lau", "metaTitle", "8-12 Ngày Làm Việc [Chi Tiết 2026]", "Nhanh 3-5 Ngày, Tiết Kiệm 8-12 Ngày [2026]"),
    ("gui-hang-di-my-mat-bao-lau", "metaDescription", "mất 8-12 ngày làm việc bằng đường bay", "bằng đường bay mất 3-5 ngày (đi nhanh) hoặc 8-12 ngày làm việc (tiết kiệm)"),
    ("gui-hang-di-my-mat-bao-lau", "excerpt", "Đường bay 8-12 ngày làm việc.", "Đường bay: đi nhanh 3-5 ngày, đi tiết kiệm 8-12 ngày làm việc; vùng sâu vùng xa cộng thêm 2-3 ngày."),
    ("gui-hang-di-my-tong-quan", "content", "người nhận tại Mỹ trong <strong>8-12 ngày</strong>", "người nhận tại Mỹ trong <strong>3-5 ngày (đi nhanh) hoặc 8-12 ngày làm việc (tiết kiệm)</strong>"),
    ("gui-hang-di-my-tong-quan", "content", "<strong>Bay 8-12 ngày</strong> — bạn theo dõi", "<strong>Bay nhanh 3-5 ngày hoặc tiết kiệm 8-12 ngày</strong> — bạn theo dõi"),
    ("gui-hang-di-my-tong-quan", "metaTitle", "Bao Thuế, 8-12 Ngày", "Bao Thuế, Nhanh 3-5 Ngày"),
    ("gui-hang-di-my-tong-quan", "metaDescription", "bay 8-12 ngày", "bay nhanh 3-5 ngày hoặc tiết kiệm 8-12 ngày"),
    ("gui-hang-di-canada-tong-quan", "content", "thời gian nhận hàng <strong>10–12 ngày</strong>", f"thời gian nhận hàng <strong>{FAST}</strong>"),
    ("gui-hang-di-canada-tong-quan", "content", "thời gian giao thường 10–12 ngày", "thời gian giao thường 8–12 ngày làm việc nếu đi tiết kiệm, 3–5 ngày nếu đi nhanh"),
    ("gui-hang-di-canada-tong-quan", "content", "<h2>Gửi hàng đi Canada thời gian 10–12 ngày</h2>", "<h2>Gửi hàng đi Canada mất bao lâu: nhanh 3–5 ngày, tiết kiệm 8–12 ngày</h2>"),
    ("gui-hang-di-canada-tong-quan", "content", "thời gian giao dự kiến <strong>10–12 ngày</strong>", f"thời gian giao dự kiến <strong>{FAST}</strong>"),
    ("gui-hang-di-canada-tong-quan", "content", "thời gian giao dự kiến 10–12 ngày", f"thời gian giao dự kiến {FAST}"),
    ("gui-hang-di-canada-tong-quan", "metaTitle", "Tận Nhà 5-9 Ngày | Minh Thiện", "Tận Nhà Nhanh 3-5 Ngày"),
    ("gui-hang-di-canada-tong-quan", "metaDescription", "Gửi hàng đi Canada 5-9 ngày", "Gửi hàng đi Canada nhanh 3-5 ngày (tiết kiệm 8-12 ngày)"),
    ("gui-hang-di-uc-tong-quan", "content", "thời gian nhận hàng <strong>7–9 ngày</strong>", f"thời gian nhận hàng <strong>{FAST}</strong>"),
    ("gui-hang-di-uc-tong-quan", "content", "<h2>Gửi hàng đi Úc thời gian 7–9 ngày</h2>", "<h2>Gửi hàng đi Úc mất bao lâu: nhanh 3–5 ngày, tiết kiệm 8–12 ngày</h2>"),
    ("gui-hang-di-uc-tong-quan", "content", "thời gian giao dự kiến <strong>7–9 ngày</strong>", f"thời gian giao dự kiến <strong>{FAST}</strong>"),
    ("gui-hang-di-uc-tong-quan", "content", "thời gian giao dự kiến 7–9 ngày", f"thời gian giao dự kiến {FAST}"),
    ("gui-hang-di-uc-tong-quan", "metaTitle", "Tận Nhà 4-8 Ngày", "Tận Nhà Nhanh 3-5 Ngày"),
    ("gui-hang-di-uc-tong-quan", "metaDescription", "Gửi hàng đi Úc 4-8 ngày", "Gửi hàng đi Úc nhanh 3-5 ngày (tiết kiệm 8-12 ngày)"),
    ("gui-hang-di-canada-mat-bao-lau", "content", "<strong>Gửi hàng đi Canada mất 5-9 ngày làm việc</strong>.", "<strong>Gửi hàng đi Canada bằng đường bay mất 3-5 ngày làm việc nếu đi nhanh, 8-12 ngày làm việc nếu đi tiết kiệm</strong>; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2-3 ngày."),
    ("gui-hang-di-canada-mat-bao-lau", "content", "đường bay <strong>5-9 ngày làm việc</strong> tuỳ thành phố và lịch chuyến.", "đường bay <strong>đi nhanh 3-5 ngày, đi tiết kiệm 8-12 ngày làm việc</strong>; vùng sâu vùng xa cộng thêm 2-3 ngày."),
    ("gui-hang-di-canada-mat-bao-lau", "metaTitle", "5-9 Ngày [Chi Tiết 2026]", "Nhanh 3-5 Ngày, Tiết Kiệm 8-12 Ngày [2026]"),
    ("gui-hang-di-canada-mat-bao-lau", "metaDescription", "mất 5-9 ngày làm việc", "bằng đường bay mất 3-5 ngày (đi nhanh) hoặc 8-12 ngày làm việc (tiết kiệm)"),
    ("gui-hang-di-uc-mat-bao-lau", "content", "<strong>Gửi hàng đi Úc mất 4-8 ngày làm việc</strong> — nhanh hơn tuyến Mỹ nhờ khoảng cách gần và nhiều chuyến bay thẳng.", "<strong>Gửi hàng đi Úc bằng đường bay mất 3-5 ngày làm việc nếu đi nhanh, 8-12 ngày làm việc nếu đi tiết kiệm</strong>; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2-3 ngày."),
    ("gui-hang-di-uc-mat-bao-lau", "content", "hàng tới Úc trong 4-8 ngày", "hàng tới Úc nhanh trong 3-5 ngày"),
    ("gui-hang-di-uc-mat-bao-lau", "content", "đường bay <strong>4-8 ngày làm việc</strong> tới Sydney, Melbourne, Brisbane; các thành phố khác cộng 1-2 ngày chặng cuối.", "đường bay <strong>đi nhanh 3-5 ngày, đi tiết kiệm 8-12 ngày làm việc</strong>; vùng sâu vùng xa cộng thêm 2-3 ngày."),
    ("gui-hang-di-uc-mat-bao-lau", "metaTitle", "4-8 Ngày [Lịch Trình 2026]", "Nhanh 3-5 Ngày, Tiết Kiệm 8-12 Ngày [2026]"),
    ("gui-hang-di-uc-mat-bao-lau", "metaDescription", "mất 4-8 ngày làm việc", "bằng đường bay mất 3-5 ngày (đi nhanh) hoặc 8-12 ngày làm việc (tiết kiệm)"),
    ("gui-hang-di-uc-mat-bao-lau", "excerpt", "bay nhanh hơn — 4-8 ngày", "đi nhanh chỉ 3-5 ngày (tiết kiệm 8-12 ngày)"),
    ("gui-hang-di-toronto-thu-tuc-hai-quan-cbsa-bang-gia-moi-nhat", "metaDescription", "từ 3-7 ngày", "từ 3-5 ngày"),
]

# Khối chuẩn lặp lại trong ~27 bài tuyến Mỹ.
MY_BLOCK = [
    ("bay <strong>8-12 ngày làm việc</strong>:", "bay <strong>nhanh 3-5 ngày hoặc tiết kiệm 8-12 ngày làm việc</strong>:"),
    ("✈️ <strong>8-12 ngày làm việc</strong>, tracking", "✈️ <strong>Nhanh 3-5 ngày, tiết kiệm 8-12 ngày làm việc</strong>, tracking"),
]


def main():
    con = sqlite3.connect(DB, timeout=30)
    con.row_factory = sqlite3.Row
    arts = {r["slug"]: dict(r) for r in con.execute("select slug,title,metaTitle,metaDescription,excerpt,content,faqJson,category,published from Article")}
    changed = {}  # slug -> {col: value}
    log = []

    def setcol(slug, col, val):
        if arts[slug][col] != val:
            arts[slug][col] = val
            changed.setdefault(slug, {})[col] = val

    # ---------- 1. Gộp ----------
    redirects = {}
    row = con.execute("select value from SiteSetting where key='article_redirects'").fetchone()
    if row:
        redirects = json.loads(row["value"])
    for main, subs in MERGES:
        if main not in arts or not arts[main]["published"]:
            log.append(f"!! bài chính không có / đang ẩn: {main}")
            continue
        faqs = json.loads(arts[main]["faqJson"] or "[]")
        seen = {re.sub(r"\W+", " ", f["q"].lower()).strip() for f in faqs}
        has_time = any(TIME_Q.search(f["q"]) for f in faqs)
        has_price = any(PRICE_Q.search(f["q"]) for f in faqs)
        for sub in subs:
            if sub not in arts:
                log.append(f"!! không có bài: {sub}")
                continue
            for f in json.loads(arts[sub]["faqJson"] or "[]"):
                key = re.sub(r"\W+", " ", f.get("q", "").lower()).strip()
                if not key or len(faqs) >= MAX_FAQ:
                    continue
                words = set(key.split())
                # Gần giống một câu đã có (trùng ≥ 55% từ) thì bỏ.
                if any(len(words & set(k.split())) / max(len(words | set(k.split())), 1) >= 0.55 for k in seen):
                    continue
                if TIME_Q.search(f["q"]) and has_time or PRICE_Q.search(f["q"]) and has_price:
                    continue  # bài chính đã trả lời ý này
                faqs.append({"q": f["q"], "a": f["a"]})
                seen.add(key)
            if arts[sub]["published"]:
                setcol(sub, "published", 0)
            redirects[sub] = main
            log.append(f"gộp  {sub}\n   -> {main}")
        setcol(main, "faqJson", json.dumps(faqs, ensure_ascii=False))
        for col in ("title", "metaTitle"):
            if arts[main][col]:
                setcol(main, col, re.sub(r"\b202[45]\b", "2026", arts[main][col]))

    # ---------- 2. Thời gian vận chuyển ----------
    missing = []
    for slug, col, old, new in EDITS:
        a = arts.get(slug)
        if not a or not a[col] or old not in a[col]:
            if not (a and a[col] and new in a[col]):
                missing.append(f"{slug} [{col}] {old[:60]}")
            continue
        setcol(slug, col, a[col].replace(old, new))
    for slug, a in arts.items():
        if not a["published"] or a["category"] not in ROUTES:
            continue
        if a["category"] == "Gửi hàng đi Mỹ":
            c = a["content"]
            for old, new in MY_BLOCK:
                c = c.replace(old, new)
            setcol(slug, "content", c)
        try:
            faqs = json.loads(a["faqJson"] or "[]")
        except ValueError:
            continue
        new_faqs = []
        for f in faqs:
            q = f.get("q", "")
            if TIME_Q.search(q) and not KEEP_Q.search(q):
                f = {"q": q, "a": transit_answer(ROUTES[a["category"]])}
            new_faqs.append(f)
        if new_faqs != faqs:
            setcol(slug, "faqJson", json.dumps(new_faqs, ensure_ascii=False))

    # ---------- báo cáo ----------
    print("\n".join(log))
    print(f"\nBài bị sửa: {len(changed)}  |  Bài ẩn (gộp): {sum(1 for c in changed.values() if c.get('published') == 0)}")
    for slug, cols in sorted(changed.items()):
        print(f"  {slug}: {', '.join(cols)}")
    if missing:
        print("\nKHÔNG TÌM THẤY chuỗi cũ (bỏ qua):")
        print("\n".join("  " + m for m in missing))

    if not WRITE:
        print("\n(chạy thử — chưa ghi gì)")
        return
    with con:
        for slug, cols in changed.items():
            sets = ", ".join(f"{c} = ?" for c in cols) + ", updatedAt = ?"
            con.execute(f"update Article set {sets} where slug = ?", [*cols.values(), NOW, slug])
        con.execute(
            "insert into SiteSetting (key, value, updatedAt) values ('article_redirects', ?, ?) "
            "on conflict(key) do update set value = excluded.value, updatedAt = excluded.updatedAt",
            (json.dumps(redirects, ensure_ascii=False), NOW),
        )
    print("ĐÃ GHI.")


if __name__ == "__main__":
    main()
