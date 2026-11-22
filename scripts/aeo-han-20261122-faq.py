#!/usr/bin/env python3
"""
AEO tuyến Hàn 22/11/2026 (vòng 2) — thêm hỏi–đáp cho 2 bài Hàn chưa có (công cụ geo-optimizer
báo "Add FAQPage schema"). Hỏi–đáp hiện trên trang và vào schema (trang bài tự vẽ từ faqJson).
Câu trả lời CHỈ dùng dữ kiện đã có: tuyến Hàn chỉ đi bay 3–5 ngày làm việc (lib/transit.ts),
lịch bay cả tuần, chốt 4 giờ chiều hôm trước (lib/lich-bay.ts), cách ghi địa chỉ từ bài số liệu
125 đơn thật, nội dung PCCC/ARC có sẵn trong chính bài. Chỉ ghi khi faqJson đang trống.

Dùng: python3 aeo-han-20261122-faq.py --db prisma/dev.db [--ghi]
"""
import argparse
import json
import sqlite3
from datetime import datetime, timezone

FAQ = {
    "gui-hang-di-han-quoc-duong-bien-quy-trinh-hai-quan-va-bang-gia-lclfcl": [
        {"q": "Minh Thiện Logistics có gửi hàng đi Hàn Quốc bằng đường biển không?",
         "a": "Tuyến Hàn của Minh Thiện Logistics hiện chỉ có dịch vụ đi nhanh bằng đường bay, 3–5 ngày làm việc, bay cả tuần. Lô hàng lớn muốn đi đường biển, gọi hotline 0589.77.89.89 để được tư vấn trước khi đóng hàng."},
        {"q": "Gửi hàng đi Hàn Quốc đường biển mất bao lâu?",
         "a": "Đường biển LCL/FCL từ Việt Nam đi Hàn nói chung mất khoảng 5–9 ngày chạy tàu, chưa kể thời gian gom hàng, làm thủ tục và thông quan, nên chỉ hợp lô hàng lớn. Thùng quà, đồ ăn, hàng cá nhân đi đường bay 3–5 ngày làm việc nhanh và gọn hơn."},
        {"q": "Gửi vài thùng hàng đi Hàn nên đi biển hay đi bay?",
         "a": "Vài thùng hàng cá nhân hoặc vài chục ký nên đi bay: 3–5 ngày làm việc, giao tận nhà người nhận, cước đồng giá theo kg. Đường biển chỉ đáng tính khi hàng từ vài mét khối trở lên."},
    ],
    "gui-hang-cho-nguoi-viet-o-han-quoc-thu-tuc-ma-pccc-va-luu-y-khai-hai-quan": [
        {"q": "Người nhận ở Hàn có cần mã PCCC không?",
         "a": "Nên chuẩn bị. Mã thông quan cá nhân PCCC (개인통관고유부호) gồm 13 ký tự, người nhận tự đăng ký bằng số điện thoại chính chủ ở Hàn hoặc thẻ cư trú ARC. Thiếu mã hoặc sai thông tin, kiện có thể bị giữ chờ bổ sung và kéo dài thêm vài ngày."},
        {"q": "Gửi hàng cho người Việt ở Hàn mất bao lâu?",
         "a": "Tuyến Hàn của Minh Thiện Logistics chỉ có dịch vụ đi nhanh bằng đường bay: 3–5 ngày làm việc, bay cả tuần, chốt hàng 4 giờ chiều ngày hôm trước."},
        {"q": "Ghi địa chỉ người nhận ở Hàn thế nào cho khỏi bị hoàn?",
         "a": "Chép nguyên địa chỉ tiếng Hàn người nhận gửi qua (đừng tự dịch), kèm tên đúng giấy tờ và số điện thoại Hàn 010. Người ở ký túc xá công ty ghi rõ tên công ty và số phòng."},
    ],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True)
    ap.add_argument("--ghi", action="store_true")
    a = ap.parse_args()
    con = sqlite3.connect(a.db)
    doi = []
    for slug, faqs in FAQ.items():
        row = con.execute("select id, faqJson from Article where slug = ?", (slug,)).fetchone()
        if not row:
            print("KHÔNG THẤY", slug)
            continue
        if row[1] not in (None, "", "[]"):
            print("đã có hỏi–đáp, bỏ qua:", slug)
            continue
        doi.append((row[0], slug, json.dumps(faqs, ensure_ascii=False)))
    print(f"{len(doi)} bài sẽ thêm hỏi–đáp:", [d[1] for d in doi])
    if a.ghi and doi:
        ts = datetime.now().strftime("%Y%m%d-%H%M%S")
        bk = f"{a.db}.bak-aeo-han-faq-{ts}"
        s0, s1 = sqlite3.connect(a.db), sqlite3.connect(bk)
        s0.backup(s1)
        s1.close()
        s0.close()
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000+00:00")
        with con:
            for id_, _, js in doi:
                con.execute("update Article set faqJson = ?, updatedAt = ? where id = ?", (js, now, id_))
        print(f"ĐÃ GHI. Sao lưu: {bk}")


if __name__ == "__main__":
    main()
