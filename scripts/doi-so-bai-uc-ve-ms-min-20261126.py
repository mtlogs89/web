"""ĐỔI số Ms Vy (039.779.0199) về hotline chung Ms Min (0589.77.89.89) trong mọi bài chuyên mục
"Gửi hàng đi Úc" (chủ yêu cầu 26/11/2026). Ngược với xoa-so-min-bai-uc-20261031.py.

- Số Vy mọi kiểu viết (039.779.0199, 039 7790 199, 0397 790 199…) -> 0589.77.89.89;
  dạng liền 0397790199 (link tel:/zalo.me) -> 0589778989; tên "Ms Vy" / "Ms. Vy" -> "Ms Min".
- Article.phone đang là số Ms Vy -> số Ms Min (giống bài robot đăng), để nút Gọi/Zalo cuối bài
  và Zalo nổi về Ms Min.
- Không đụng ảnh nhúng base64 (data:…). Cột: content, faqJson, excerpt, metaDescription,
  metaTitle, title, h1. Chạy lại nhiều lần không sao. KHÔNG xoá bài, KHÔNG đổi updatedAt.

Chạy:  python3 doi-so-bai-uc-ve-ms-min-20261126.py <dev.db>            (chạy thử, không ghi)
       python3 doi-so-bai-uc-ve-ms-min-20261126.py <dev.db> --ghi     (ghi thật)
"""
import re
import sqlite3
import sys

CHUYEN_MUC = "Gửi hàng đi Úc"
SO_VY = "0397790199"
SO_MIN, SO_MIN_HIEN = "0589778989", "0589.77.89.89"
THAY = [
    # Số Vy viết có dấu chấm / cách: 039.779.0199, 039 7790 199, 0397 790 199, 0397.79.01.99…
    (re.compile(r"(?<!\d)0\s?3\s?9[ .]?7[ .]?7[ .]?9[ .]?0[ .]?1[ .]?9[ .]?9(?!\d)"), SO_MIN_HIEN),
    # Tên (có dấu cách giữa Ms và Vy nên không khớp nhầm trong chuỗi base64).
    (re.compile(r"\bMs\.? Vy\b"), "Ms Min"),
]
# Dạng liền (trong link tel:/zalo.me) giữ dạng liền.
LIEN = re.compile(r"(?<!\d)" + SO_VY + r"(?!\d)")
# Sau khi đổi, bỏ số/tên bị lặp (bài từng ghi 2 số, hoặc đã có tên Vy đứng ngay cạnh số Vy).
H = re.escape(SO_MIN_HIEN)
GON = [
    # "0589.77.89.89 / 0589.77.89.89 (Ms Min)" -> "0589.77.89.89 (Ms Min)"
    (re.compile(H + r" ?/ ?(" + H + r")"), r"\1"),
    # "Hotline: 0589.77.89.89 (Ms Min) – Ms Min." -> "Hotline: 0589.77.89.89 (Ms Min)."
    (re.compile(r"(" + H + r" \(Ms Min\)) ?[–—-] ?Ms Min\b"), r"\1"),
    # "cho Ms Min qua số 0589.77.89.89 (Ms Min)" -> "cho Ms Min qua số 0589.77.89.89"
    (re.compile(r"(Ms Min[^<>()]{0,20}" + H + r") \(Ms Min\)"), r"\1"),
]
DATA = re.compile(r"(data:[a-z]+/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+)", re.I)
COT = ["content", "faqJson", "excerpt", "metaDescription", "metaTitle", "title", "h1"]
CON_SOT = re.compile(r"(?<!\d)0\s?3\s?9[ .]?7[ .]?7[ .]?9[ .]?0[ .]?1[ .]?9[ .]?9(?!\d)|\bMs\.? Vy\b")


def doi_doan(text):
    n = 0
    text, k = LIEN.subn(SO_MIN, text)
    n += k
    for mau, moi in THAY:
        text, k = mau.subn(moi, text)
        n += k
    for mau, moi in GON:
        text, k = mau.subn(moi, text)
        n += k
    return text, n


def doi(text):
    """Đổi ngoài các đoạn ảnh base64."""
    if not text:
        return text, 0
    phan = DATA.split(text)
    n = 0
    for i in range(0, len(phan), 2):  # phần chẵn = chữ thường, phần lẻ = data:…base64
        phan[i], k = doi_doan(phan[i])
        n += k
    return "".join(phan), n


def main():
    db, ghi = sys.argv[1], "--ghi" in sys.argv
    con = sqlite3.connect(db)
    rows = con.execute(
        f"SELECT id, slug, phone, {', '.join(COT)} FROM Article WHERE category = ? OR phone = ?",
        (CHUYEN_MUC, SO_VY),
    ).fetchall()
    tong, bai, sot = 0, 0, []
    for r in rows:
        id_, slug, phone = r[0], r[1], r[2]
        moi, dem = {}, 0
        for i, cot in enumerate(COT):
            moi[cot], n = doi(r[3 + i])
            dem += n
            if moi[cot] and CON_SOT.search(DATA.sub("", moi[cot])):
                sot.append(f"{slug} · {cot}")
        if phone == SO_VY:
            phone = SO_MIN
            dem += 1
        if not dem:
            continue
        bai += 1
        tong += dem
        print(f"{slug[:70]:70} doi {dem} cho")
        if ghi:
            con.execute(
                f"UPDATE Article SET phone = ?, {', '.join(c + ' = ?' for c in COT)} WHERE id = ?",
                (phone, *[moi[c] for c in COT], id_),
            )
    if ghi:
        con.commit()
    print(f"\n{len(rows)} bai Uc | {bai} bai co so/ten Ms Vy | doi {tong} cho"
          f" | {'DA GHI' if ghi else 'CHAY THU, CHUA GHI'}")
    print("Con sot:", sot or "khong")
    con.close()


if __name__ == "__main__":
    main()
