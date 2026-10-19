"""THÊM hotline Ms Vy vào mọi bài chuyên mục "Gửi hàng đi Úc" (chủ yêu cầu 19/10/2026).

Chủ dặn: "chỉ thêm vô, không xoá" — số 0589.77.89.89 và tên Ms Min GIỮ NGUYÊN.
- content / faqJson / excerpt: sau mỗi chỗ ghi số 0589… (kèm ngoặc "(Zalo Ms Min)" hoặc
  "— Ms Min" nếu có) chèn thêm " hoặc 039.779.0199 (Ms Vy)".
  metaDescription để nguyên (Google cắt ở ~160 ký tự, thêm số dễ bị cụt).
- Article.phone = 0397790199: nút Gọi/Zalo cuối bài + Zalo nổi của bài Úc về Ms Vy;
  nút gọi nổi vẫn có đủ 2 số (Ms Min + Ms Vy).
- Chạy lại nhiều lần không bị chèn trùng. KHÔNG xoá bài, KHÔNG đổi updatedAt.

Chạy:  python3 doi-so-bai-uc-ms-vy-20261019.py <dev.db>            (chạy thử, không ghi)
       python3 doi-so-bai-uc-ms-vy-20261019.py <dev.db> --ghi     (ghi thật)
"""
import re
import sqlite3
import sys

CHUYEN_MUC = "Gửi hàng đi Úc"
SO_MOI = "0397790199"
THEM = " hoặc 039.779.0199 (Ms Vy)"
# Số cũ + (tuỳ chọn) phần ghi tên người trực ngay sau nó. Đã có THEM phía sau thì bỏ qua.
MAU = re.compile(
    r"(?:0589\.77\.89\.89|0589\.77\.8989|0589 77 89 89)"
    r"(?: \([^()<>]{0,40}\)| — Ms Min)?"
)
COT = ["content", "faqJson", "excerpt"]


def them(text):
    if not text:
        return text, 0
    n = 0

    def chen(m):
        nonlocal n
        # Đã có số Ms Vy ngay sau thì để nguyên (chạy lại không chèn trùng). Kiểm bằng tay vì
        # lookahead trong regex bị lách khi phần ngoặc tuỳ chọn được bỏ qua.
        if m.string.startswith(THEM, m.end()):
            return m.group(0)
        n += 1
        return m.group(0) + THEM

    return MAU.sub(chen, text), n


def main():
    db, ghi = sys.argv[1], "--ghi" in sys.argv
    con = sqlite3.connect(db)
    rows = con.execute(
        f"SELECT id, slug, phone, {', '.join(COT)} FROM Article WHERE category = ?", (CHUYEN_MUC,)
    ).fetchall()
    tong, bai_doi_so = 0, 0
    for r in rows:
        id_, slug, phone = r[0], r[1], r[2]
        moi, dem = {}, 0
        for i, cot in enumerate(COT):
            moi[cot], n = them(r[3 + i])
            dem += n
        if phone != SO_MOI:
            bai_doi_so += 1
        tong += dem
        print(f"{slug[:60]:60} nut cuoi bai: {phone or '(trong)':12} -> {SO_MOI} | them {dem} cho")
        if ghi:
            con.execute(
                f"UPDATE Article SET phone = ?, {', '.join(c + ' = ?' for c in COT)} WHERE id = ?",
                (SO_MOI, *[moi[c] for c in COT], id_),
            )
    if ghi:
        con.commit()
    print(f"\n{len(rows)} bai Uc | {bai_doi_so} bai doi nut cuoi bai | them so Ms Vy vao {tong} cho"
          f" | {'DA GHI' if ghi else 'CHAY THU, CHUA GHI'}")
    con.close()


if __name__ == "__main__":
    main()
