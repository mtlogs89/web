#!/usr/bin/env python3
"""
Tuyến Úc — chủ xác nhận 17/09/2026: thịt khô, giò chả, sữa, trứng Minh Thiện VẪN NHẬN (phụ thu theo kg),
có rủi ro bị giữ / tiêu huỷ ở đầu Úc. Hạt giống KHÔNG nhận.
Sửa các câu nói "Minh Thiện không nhận / không gửi được"; giữ nguyên câu nói về luật Úc.

Dùng:  python3 sua-uc-thit-trung-sua-20260917.py <dev.db>          (chạy thử)
       python3 sua-uc-thit-trung-sua-20260917.py <dev.db> --ghi
"""
import json, sqlite3, sys
from datetime import datetime, timezone

DB, WRITE = sys.argv[1], "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
RUI_RO = "Riêng thịt, trứng, sữa: Minh Thiện vẫn nhận gửi (phụ thu theo kg) nhưng có rủi ro hàng bị giữ hoặc tiêu huỷ ở đầu Úc — hỏi Ms Min trước khi gửi."

# (slug, cột, chuỗi cũ, chuỗi mới)
TEXT = [
    ("gui-thuc-pham-kho-di-uc-kiem-dich", "content",
     "<strong>❌ Không nhận — sản phẩm động vật trên cạn:</strong> khô bò, khô gà, lạp xưởng, nem, chả, ruốc thịt, trứng muối, sản phẩm sữa. Kiểm dịch Úc chặn nhóm này gần như tuyệt đối với kiện cá nhân — đừng phí tiền thử.",
     "<strong>⚠️ Nhận nhưng có rủi ro — sản phẩm động vật trên cạn:</strong> khô bò, khô gà, lạp xưởng, nem, chả, ruốc thịt, trứng muối, sản phẩm sữa. Minh Thiện vẫn nhận gửi (phụ thu theo kg), nhưng kiểm dịch Úc siết nhóm này rất chặt với kiện cá nhân nên hàng có thể bị giữ hoặc tiêu huỷ ở đầu Úc — hỏi Ms Min trước khi gửi."),
    ("gui-thuc-pham-kho-di-uc-kiem-dich", "excerpt",
     "khô bò, nem chả thì tuyệt đối không.",
     "khô bò, nem chả Minh Thiện vẫn nhận nhưng có rủi ro kiểm dịch đầu Úc."),
    ("gui-qua-tet-di-uc", "metaDescription",
     "bánh chưng nhân thịt thì không.",
     "bánh chưng nhân thịt vẫn nhận nhưng có rủi ro kiểm dịch."),
    ("gui-qua-tet-di-uc", "content",
     "— sản phẩm thịt bị cấm tuyệt đối</li>",
     "— Úc cấm sản phẩm thịt với kiện cá nhân; Minh Thiện vẫn nhận nhưng có rủi ro bị giữ</li>"),
    ("gui-hang-di-uc-can-luu-y-gi", "content",
     "<strong>❌ Cấm với kiện cá nhân:</strong> sản phẩm thịt (nem, chả lụa, lạp xưởng, khô bò), trứng và chế phẩm trứng, sữa tươi, mắm tự làm không nhãn, trái cây rau củ tươi, hạt giống, mật ong số lượng lớn, đồ gỗ còn vỏ cây, vật phẩm dính đất cát.</li>",
     "<strong>❌ Luật Úc cấm với kiện cá nhân:</strong> sản phẩm thịt (nem, chả lụa, lạp xưởng, khô bò), trứng và chế phẩm trứng, sữa tươi, mắm tự làm không nhãn, trái cây rau củ tươi, hạt giống, mật ong số lượng lớn, đồ gỗ còn vỏ cây, vật phẩm dính đất cát. <em>Thịt, trứng, sữa Minh Thiện vẫn nhận gửi (phụ thu theo kg) nhưng có rủi ro bị giữ ở đầu Úc; hạt giống thì không nhận.</em></li>"),
]

# (slug, câu hỏi hiện tại, câu hỏi mới hoặc None, hàm đổi câu trả lời)
FAQ = [
    ("gui-thuc-pham-kho-di-uc-kiem-dich", "Gửi cá khô, tôm khô đi Úc được không?", None,
     lambda a: a.replace("Khác với sản phẩm thịt trên cạn (khô bò, lạp xưởng) là nhóm bị cấm.",
                         "Khác với sản phẩm thịt trên cạn (khô bò, lạp xưởng): Úc kiểm dịch rất chặt, Minh Thiện vẫn nhận nhưng có rủi ro bị giữ ở đầu Úc.")),
    ("gui-thuc-pham-kho-di-uc-kiem-dich", "Vì sao khô bò bị cấm mà cá khô lại được gửi đi Úc?", "Vì sao gửi khô bò đi Úc rủi ro hơn cá khô?",
     lambda a: a.replace("nên cấm với kiện cá nhân;", "nên Úc cấm với kiện cá nhân;")
                + " Minh Thiện vẫn nhận gửi khô bò, lạp xưởng (phụ thu theo kg), nhưng hàng có rủi ro bị giữ hoặc tiêu huỷ ở đầu Úc."),
    ("gui-hang-cam-di-uc-danh-sach", "Nem, chả lụa gửi đi Úc được không?", None,
     lambda a: "Minh Thiện vẫn nhận gửi nem, chả lụa đi Úc (phụ thu theo kg). Tuy nhiên luật biosecurity Úc cấm sản phẩm thịt trên cạn với kiện cá nhân, kể cả hút chân không hay đông lạnh, nên hàng có rủi ro bị giữ, tiêu huỷ và người nhận có thể bị phạt. Đây là điểm khác lớn nhất giữa tuyến Úc và tuyến Mỹ — hỏi Ms Min trước khi gửi."),
    ("gui-hang-cam-di-uc-danh-sach", "Bánh chưng, bánh tét gửi đi Úc được không?", None,
     lambda a: a.replace("Nhân thịt: không.", "Nhân thịt: Minh Thiện vẫn nhận nhưng có rủi ro bị giữ ở đầu Úc (sản phẩm thịt bị kiểm dịch rất chặt).")),
    ("gui-qua-tet-di-uc", "Bánh chưng gửi đi Úc được không?", None,
     lambda a: a.replace("Nhân thịt: không — sản phẩm thịt bị biosecurity Úc cấm tuyệt đối.",
                         "Nhân thịt: Minh Thiện vẫn nhận (phụ thu theo kg) nhưng có rủi ro bị giữ hoặc tiêu huỷ, vì sản phẩm thịt bị biosecurity Úc cấm với kiện cá nhân.")),
    ("gui-hang-di-uc-mat-bao-lau", "Những mặt hàng nào bị cấm gửi đi Úc?", None, lambda a: a + " " + RUI_RO),
    ("cuoc-phi-gui-hang-di-uc-2025-bang-gia-va-thu-tuc-thong-quan-tu-a-z", "Những loại thực phẩm nào bị cấm gửi đi Úc hoàn toàn?", None, lambda a: a + " " + RUI_RO),
    ("gui-hang-di-perth-quy-dinh-hai-quan-va-bang-gia-moi-nhat", "Các loại thực phẩm nào bị cấm hoàn toàn khi gửi đi Perth?", None, lambda a: a + " " + RUI_RO),
]


def main():
    con = sqlite3.connect(DB, timeout=30)
    changed, missing = {}, []
    get = lambda slug, col: (changed.get(slug, {}).get(col) or con.execute(f"select {col} from Article where slug=?", (slug,)).fetchone()[0])
    for slug, col, old, new in TEXT:
        v = get(slug, col) or ""
        if new in v:
            continue  # đã sửa
        if old not in v:
            missing.append(f"{slug} [{col}] {old[:60]}"); continue
        changed.setdefault(slug, {})[col] = v.replace(old, new)
    for slug, q, newq, fn in FAQ:
        faqs = json.loads(get(slug, "faqJson") or "[]")
        hit = False
        for f in faqs:
            if f["q"] == q or (newq and f["q"] == newq):
                if f["q"] == newq or RUI_RO in f["a"] or "vẫn nhận" in f["a"]:
                    hit = True; break  # đã sửa
                f["a"] = fn(f["a"]); f["q"] = newq or q; hit = True
                changed.setdefault(slug, {})["faqJson"] = json.dumps(faqs, ensure_ascii=False)
        if not hit:
            missing.append(f"{slug} [faq] {q}")
    for slug, cols in changed.items():
        print(f"sửa {slug}: {', '.join(cols)}")
    if missing:
        print("KHÔNG TÌM THẤY:\n  " + "\n  ".join(missing))
    if not WRITE:
        print("(chạy thử)"); return
    with con:
        for slug, cols in changed.items():
            con.execute(f"update Article set {', '.join(c + ' = ?' for c in cols)}, updatedAt = ? where slug = ?", [*cols.values(), NOW, slug])
    print("ĐÃ GHI.")


if __name__ == "__main__":
    main()
