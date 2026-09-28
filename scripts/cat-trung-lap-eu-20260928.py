#!/usr/bin/env python3
"""
28/09/2026 — cắt phần trùng lặp giữa các trang nước Châu Âu.

VÌ SAO: sáng nay dày 8 trang EU bằng một khối chữ dùng chung → đo ra **77% số câu
trùng nhau giữa các cặp trang**. Google không phạt bài dài, nhưng nhiều trang na ná
nhau thì nó gộp lại coi như một và không xếp hạng trang nào. Chủ nhắc đúng chỗ này.

CÁCH SỬA: giữ phần RIÊNG của từng nước (thành phố, thời gian, lịch bay có tên nước),
cắt các khối giống hệt nhau ở mọi trang — đóng gói, gửi từ tỉnh khác, ghi địa chỉ —
thay bằng một đoạn ngắn dẫn về trang gốc /hang-gui-duoc/chau-au.

Bảng mặt hàng giữ lại nhưng rút gọn: nêu nhóm không nhận + dẫn link, thay vì liệt kê
toàn bộ ở cả 27 trang.

Dùng: python3 scripts/cat-trung-lap-eu-20260928.py <dev.db> [--ghi]
"""
import html, re, sqlite3, sys

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
HL = "0589.77.89.89"

# Các mục lặp y hệt ở mọi trang — cắt hẳn
CAT_MUC = [
    "Đóng gói: bốn nhóm cần làm khác nhau",
    "Gửi từ tỉnh khác có được không?",
]


def cat_muc(html_bai: str, tieu_de: str) -> str:
    """Xoá từ <h2>tiêu đề</h2> tới ngay trước <h2> kế tiếp."""
    i = html_bai.find(f"<h2>{tieu_de}")
    if i < 0:
        return html_bai
    j = html_bai.find("<h2>", i + 4)
    return html_bai[:i] + (html_bai[j:] if j > 0 else "")


con = sqlite3.connect(DB, timeout=30)
dem = lambda c: len(html.unescape(re.sub(r"<[^>]+>", " ", c or "")).split())
rows = con.execute(
    "select slug, title, content from Article where published=1 and metaTitle like 'Gửi Thực Phẩm, Hàng Đi%'"
).fetchall()

for slug, title, c in rows:
    m = re.match(r"^Gửi Hàng Đi (.+?):", title or "")
    vn = m.group(1).strip() if m else slug
    moi = c
    for t in CAT_MUC:
        moi = cat_muc(moi, t)

    # Rút gọn bảng mặt hàng: bỏ đoạn liệt kê dài, giữ phần không nhận + link
    i = moi.find(f"<h3>Nhận gửi bình thường</h3>")
    j = moi.find("<p>Danh sách đầy đủ 41 nhóm mặt hàng")
    if i > 0 and j > i:
        gon = (f"<p>Nhóm gửi bình thường gồm đồ khô và đặc sản quê, hải sản khô, bánh kẹo, mứt Tết, cà phê, trà, "
               f"yến sào, sâm, mỹ phẩm, quần áo và hàng kinh doanh. Nhóm có phụ thu hoặc có rủi ro bị giữ gồm sản phẩm "
               f"từ thịt, sữa trứng, thuốc và thực phẩm chức năng, hàng lỏng đóng chai, đồ điện tử có pin. "
               f"<strong>Không nhận đi {vn}:</strong> rau củ và trái cây tươi, pin rời và sạc dự phòng, rượu bia, thuốc lá.</p>\n")
        moi = moi[:i] + gon + moi[j:]

    # Ghi địa chỉ: rút còn 2 ý, phần chi tiết để ở trang gốc
    i2 = moi.find(f"<h2>Ghi địa chỉ người nhận ở {vn}</h2>")
    if i2 > 0:
        j2 = moi.find("<h2>", i2 + 4)
        gon2 = (f"<h2>Ghi địa chỉ người nhận ở {vn}</h2>\n"
                f"<p>Địa chỉ phải có <strong>mã bưu chính</strong> và <strong>số điện thoại người nhận kèm mã quốc gia</strong> — "
                f"thiếu một trong hai là hàng dễ nằm kho. Ở chung cư thì ghi rõ tầng, số căn và tên trên chuông cửa, "
                f"vì bưu tá châu Âu thường tìm theo tên chuông. Viết đúng chính tả bản địa, không bỏ dấu.</p>\n")
        moi = moi[:i2] + gon2 + (moi[j2:] if j2 > 0 else "")

    print(f"{slug} ({vn}): {dem(c)} → {dem(moi)} chữ")
    if WRITE:
        con.execute("update Article set content=? where slug=?", (moi, slug))
        con.commit()

if WRITE:
    con.commit()
    print("\nĐÃ GHI")
else:
    print("\n(chạy thử — thêm --ghi để ghi thật)")
