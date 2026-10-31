"""XOÁ số Ms Min (0589.77.89.89) khỏi mọi bài chuyên mục "Gửi hàng đi Úc", chỉ giữ số Ms Vy
(chủ yêu cầu 31/10/2026). Ngược với doi-so-bai-uc-ms-vy-20261019.py (bản đó chỉ chèn thêm số Vy).

- "0589… (Zalo Ms Min) hoặc 039.779.0199 (Ms Vy)" -> "039.779.0199 (Ms Vy)".
- Số 0589… còn sót (đứng một mình) -> 039.779.0199; tên "Ms Min" còn sót -> "Ms Vy";
  link tel:/zalo.me 0589778989 -> 0397790199.
- Cột: content, faqJson, excerpt, metaDescription, metaTitle, title, h1. Article.phone giữ nguyên
  (đã là số Ms Vy từ 19/10). Chạy lại nhiều lần không sao. KHÔNG xoá bài, KHÔNG đổi updatedAt.

Chạy:  python3 xoa-so-min-bai-uc-20261031.py <dev.db>            (chạy thử, không ghi)
       python3 xoa-so-min-bai-uc-20261031.py <dev.db> --ghi     (ghi thật)
"""
import re
import sqlite3
import sys

CHUYEN_MUC = "Gửi hàng đi Úc"
VY = "039.779.0199"
SO_MIN = r"0589[ .]?77[ .]?89[ .]?89"
# Phần ghi tên ngay sau số Min: " (Zalo Ms Min)", " (Ms Min)", " — Ms Min".
TEN_MIN = r"(?: \([^()<>]{0,20}Min\)| — Ms Min)"
THAY = [
    # Số Min + tên + "hoặc" số Vy -> chỉ còn số Vy.
    (re.compile(SO_MIN + TEN_MIN + r"? hoặc " + re.escape(VY) + r" \(Ms Vy\)"), VY + " (Ms Vy)"),
    # "Ms Min 039.779.0199 (Ms Vy)" / "Ms Min (039.779.0199 (Ms Vy))" -> bỏ tên Vy lặp.
    (re.compile(r"Ms Min \(" + re.escape(VY) + r" \(Ms Vy\)\)"), "Ms Vy (" + VY + ")"),
    (re.compile(r"Ms Min " + re.escape(VY) + r" \(Ms Vy\)"), "Ms Vy " + VY),
    # Số Min đứng một mình (kèm tên thì đổi tên luôn).
    (re.compile(SO_MIN + TEN_MIN), VY + " (Ms Vy)"),
    (re.compile(SO_MIN), VY),
    (re.compile(r"0589778989"), "0397790199"),
    (re.compile(r"Ms\.? Min\b"), "Ms Vy"),
]
COT = ["content", "faqJson", "excerpt", "metaDescription", "metaTitle", "title", "h1"]


def doi(text):
    if not text:
        return text, 0
    n = 0
    for mau, moi in THAY:
        text, k = mau.subn(moi, text)
        n += k
    return text, n


def main():
    db, ghi = sys.argv[1], "--ghi" in sys.argv
    con = sqlite3.connect(db)
    rows = con.execute(
        f"SELECT id, slug, {', '.join(COT)} FROM Article WHERE category = ?", (CHUYEN_MUC,)
    ).fetchall()
    tong, bai = 0, 0
    for r in rows:
        id_, slug = r[0], r[1]
        moi, dem = {}, 0
        for i, cot in enumerate(COT):
            moi[cot], n = doi(r[2 + i])
            dem += n
        if not dem:
            continue
        bai += 1
        tong += dem
        print(f"{slug[:70]:70} doi {dem} cho")
        if ghi:
            con.execute(
                f"UPDATE Article SET {', '.join(c + ' = ?' for c in COT)} WHERE id = ?",
                (*[moi[c] for c in COT], id_),
            )
    if ghi:
        con.commit()
    print(f"\n{len(rows)} bai Uc | {bai} bai co so Ms Min | doi {tong} cho"
          f" | {'DA GHI' if ghi else 'CHAY THU, CHUA GHI'}")
    con.close()


if __name__ == "__main__":
    main()
