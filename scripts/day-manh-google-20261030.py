#!/usr/bin/env python3
"""
30/10/2026 — đẩy lượt bấm Google tự nhiên (sau mốc 200 bấm/28 ngày).

LÝ DO (số Search Console 02/10–29/10, không đoán):
  A. 4 bài đang đứng TOP 3–8 mà 0 lượt bấm — dòng hiện trên Google không trả lời
     đúng câu khách gõ ("gửi mắm đi úc", "gửi bánh tráng đi canada"...).
     → chỉ sửa metaTitle + metaDescription, KHÔNG đụng thân bài.
     (Bỏ bài quà Tết Hàn: chủ cấm sửa bài Hàn cũ. Bỏ bài thuốc Canada: khách gõ
      "thuốc LÁ" nhưng bài nói thuốc tây — đổi tiêu đề là lừa khách.)
  B. Các bài hạng 10–25 (hàng mẫu Mỹ, bánh kẹo Mỹ, khô Canada, sách Canada,
     Litva, Slovenia, Estonia...) không có MỘT link nội bộ nào trỏ tới trong thân bài.
     → chèn 1 dòng "Đọc thêm" (3 link cùng cụm chủ đề) trước thẻ <h2> thứ hai.
     Chỉ THÊM, không xoá chữ nào. Có dấu <!--doc-them-20261030--> nên chạy lại không trùng.

Dùng: python3 scripts/day-manh-google-20261030.py <dev.db> [--ghi]
"""
import sqlite3, sys

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
DAU = "<!--doc-them-20261030-->"

# ---- A. tiêu đề + mô tả --------------------------------------------------
# metaTitle không kèm tên công ty: layout tự thêm "| Minh Thiện Logistics".
TIEU_DE = {
    "gui-nuoc-mam-di-uc-thu-tuc-hai-quan-cach-dong-goi-va-bang-gia": (
        "Gửi Mắm Đi Úc Được Không? Loại Nào Qua Kiểm Dịch",
        "Mắm, nước mắm đóng chai có nhãn gửi đi Úc được; mắm nhà làm bị huỷ ngay ở cửa khẩu. "
        "Cách gói không rò, không bay mùi. Gọi 0589.77.89.89 / 039.779.0199 (Ms Vy).",
    ),
    "gui-nuoc-mam-di-my-thu-tuc-fda-va-cach-dong-goi-chuan-khong-bi-tra-ve": (
        "Gửi Mắm Đi Mỹ Được Không? Cần FDA, Đóng Gói Ra Sao",
        "Mắm, nước mắm gửi đi Mỹ được nếu khai FDA và Prior Notice — Minh Thiện làm miễn phí. "
        "Đóng gói chống đổ, chống bay mùi, giao tận nhà ở Mỹ. Hotline 0589.77.89.89.",
    ),
    "huong-dan-gui-do-lam-nail-di-canada-an-toan-dung-chuan-hai-quan-quoc-te": (
        "Gửi Dụng Cụ Làm Nail Đi Canada: Món Nào Được, Món Nào Bị Giữ",
        "Máy mài, đèn UV, gel, sơn, bột đắp gửi đi Canada được; acetone, pin rời, lọ lớn dễ bị giữ. "
        "Xem danh sách, cách đóng gói và khai báo. Hotline 0589.77.89.89.",
    ),
    "gui-banh-trang-di-canada-an-toan-va-dung-luat-huong-dan-thuc-te-cho-tung-buoc": (
        "Gửi Bánh Tráng Đi Canada Được Không? Cách Gói Không Bị Giữ",
        "Bánh tráng Trảng Bàng, bánh tráng dẻo, phơi sương gửi đi Canada được. Cần nhãn thành phần, "
        "gói kín, không gửi chung thịt, hải sản. Hotline 0589.77.89.89.",
    ),
}

# ---- B. cụm link nội bộ --------------------------------------------------
# (slug, chữ gắn link). Bài ĐẦU danh sách "dich" là bài cần đẩy, được ưu tiên nhận link.
CUM = {
    "my": {
        "dich": [
            ("gui-hang-sample-thu-nghiem-di-my", "gửi hàng mẫu đi Mỹ"),
            ("gui-banh-keo-di-my-fda", "gửi bánh kẹo đi Mỹ"),
            ("gui-kho-tom-di-my", "gửi tôm khô đi Mỹ"),
        ],
        "nguon": [
            "gui-nuoc-mam-di-my-thu-tuc-fda-va-cach-dong-goi-chuan-khong-bi-tra-ve",
            "cach-gui-thuc-pham-kho-di-my-khong-bi-giu-hai-quan",
            "gui-cua-kho-tom-kho-hai-san-kho-di-my",
            "gui-gio-cha-di-my-thu-tuc-fda-va-quy-trinh-thong-quan-tu-a-z",
        ],
    },
    "canada": {
        "dich": [
            ("gui-thuc-pham-kho-di-canada", "gửi đồ khô đi Canada"),
            ("kinh-nghiem-gui-sach-vo-di-canada-thu-tuc-luu-y-gia-dich-vu-2024", "gửi sách đi Canada"),
            ("gui-thuoc-di-canada-thu-tuc-hai-quan-luu-y-va-bang-gia-moi-nhat", "gửi thuốc tây đi Canada"),
            ("gui-qua-tet-di-canada", "gửi bánh mứt Tết đi Canada"),
            ("gui-yen-sao-di-canada-thu-tuc-hai-quan-cfia-cach-thong-quan-100", "gửi yến sào đi Canada"),
        ],
        "nguon": [
            "huong-dan-gui-do-lam-nail-di-canada-an-toan-dung-chuan-hai-quan-quoc-te",
            "gui-banh-trang-di-canada-an-toan-va-dung-luat-huong-dan-thuc-te-cho-tung-buoc",
            "gui-qua-tang-di-canada-quy-trinh-thu-tuc-chi-phi-va-luu-y-thuc-te-tu-minh-thien-logistics",
        ],
    },
    "eu": {
        "dich": [
            ("gui-hang-di-lithuania", "gửi hàng đi Litva"),
            ("gui-hang-di-slovenia", "gửi hàng đi Slovenia"),
            ("gui-hang-di-estonia", "gửi hàng đi Estonia"),
            ("gui-hang-di-latvia", "gửi hàng đi Latvia"),
            ("gui-hang-di-austria", "gửi hàng đi Áo"),
        ],
        "nguon": [
            "gui-hang-di-czech-republic",
            "gui-hang-di-croatia",
            "gui-hang-di-hungary",
        ],
    },
}
SO_LINK = 3

con = sqlite3.connect(DB, timeout=30)

print("== A. Tiêu đề + mô tả ==")
for slug, (mt, md) in TIEU_DE.items():
    row = con.execute("select metaTitle, metaDescription from Article where slug=?", (slug,)).fetchone()
    if not row:
        print(f"!! không có bài: {slug}")
        continue
    print(f"{slug}\n   cũ : {row[0]}\n        {row[1]}\n   mới: {mt}  ({len(mt)} ký tự)\n        {md}  ({len(md)} ký tự)\n")
    if WRITE:
        con.execute("update Article set metaTitle=?, metaDescription=?, updatedAt=updatedAt where slug=?",
                    (mt, md, slug))

print("== B. Link nội bộ ==")
nhan = {}
for ten, cum in CUM.items():
    dich = cum["dich"]
    tat_ca = [s for s, _ in dich] + cum["nguon"]
    for i, src in enumerate(tat_ca):
        row = con.execute("select content from Article where slug=? and published=1", (src,)).fetchone()
        if not row:
            print(f"!! không có bài (hoặc chưa đăng): {src}")
            continue
        content = row[0] or ""
        if DAU in content:
            print(f"   đã có, bỏ qua: {src}")
            continue
        # Xoay vòng để mỗi bài đích nhận link từ nhiều bài khác nhau.
        ung_vien = [d for d in dich if d[0] != src]
        k = i % len(ung_vien)
        chon = (ung_vien[k:] + ung_vien[:k])[:SO_LINK]
        links = " · ".join(f'<a href="/tin-tuc/{s}">{a}</a>' for s, a in chon)
        khoi = f"{DAU}<p><strong>Đọc thêm:</strong> {links}</p>"
        h2 = [j for j in range(len(content)) if content.startswith("<h2", j)]
        if len(h2) >= 2:
            moi = content[:h2[1]] + khoi + content[h2[1]:]
        else:
            moi = content + khoi
        for s, _ in chon:
            nhan[s] = nhan.get(s, 0) + 1
        print(f"   {src}\n      → " + ", ".join(a for _, a in chon))
        if WRITE:
            con.execute("update Article set content=? where slug=?", (moi, src))

print("\nSố link mỗi bài đích nhận:")
for s, n in sorted(nhan.items(), key=lambda x: -x[1]):
    print(f"   {n}  {s}")

if WRITE:
    con.commit()
    print("\nĐÃ GHI.")
else:
    print("\n(chạy thử — thêm --ghi để ghi)")
