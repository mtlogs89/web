#!/usr/bin/env python3
"""
Đo thời gian giao hàng THỰC TẾ từ hành trình trong app MT LOGS, ghi ra JSON cho web đọc.

Vì sao có bộ này: đối thủ nào cũng viết "giao nhanh 3–5 ngày" — chữ suông. Số đo được
từ hệ thống của chính mình là thứ không ai làm giả được, và là loại nội dung AI chịu trích.

CÁCH ĐO: từ sự kiện hành trình ĐẦU TIÊN (thường là lúc tạo nhãn) tới lúc giao xong,
tính bằng NGÀY LÀM VIỆC (bỏ thứ Bảy, Chủ nhật) cho khớp cách web công bố.

⚠️ PHÂN NHÓM DỊCH VỤ (chủ đính chính 28/09/2026):
   - Đi nhanh   = Order.service bắt đầu bằng "UPS"
   - Đi tiết kiệm = "US Pri", "US Chậm", "US Hàng Khó"  ← Pri KHÔNG phải Priority nhanh
   Đọc sai chỗ này là kết luận oan rằng web quảng cáo sai thời gian.

⚠️ Chỉ công bố tuyến có từ TOI_THIEU kiện trở lên; ít hơn thì ghi "chưa đủ dữ liệu".
   Không đưa mã đơn, tên khách, địa chỉ hay tên nhà cung cấp ra ngoài — chỉ số tổng hợp.

Dùng: python3 scripts/do-thoi-gian-giao.py [--logistics-db …] [--web-db …] [--in]
"""
import argparse, json, sqlite3, statistics
from datetime import datetime, timedelta, timezone

ap = argparse.ArgumentParser()
ap.add_argument("--logistics-db", default="/var/www/logistics/prisma/dev.db")
ap.add_argument("--web-db", default="/var/www/minhthien-web/prisma/dev.db")
ap.add_argument("--toi-thieu", type=int, default=10, help="số kiện tối thiểu mới công bố")
ap.add_argument("--in", dest="chi_in", action="store_true", help="chỉ in JSON, không ghi vào web")
args = ap.parse_args()

# Tên nước trong đơn nhập tay nên lộn xộn (USA / usa / United States / ÚC…) — chuẩn hoá về một mối.
TUYEN = {"usa": "Mỹ", "united states": "Mỹ", "us": "Mỹ", "my": "Mỹ", "mỹ": "Mỹ",
         "korea": "Hàn Quốc", "south korea": "Hàn Quốc", "hàn quốc": "Hàn Quốc",
         "canada": "Canada", "australia": "Úc", "úc": "Úc", "uc": "Úc",
         "japan": "Nhật Bản", "nhật bản": "Nhật Bản", "singapore": "Singapore",
         "malaysia": "Malaysia", "taiwan": "Đài Loan", "thailand": "Thái Lan"}

# Hành trình liên lục địa không thể xong dưới 2 ngày làm việc. Kiện nào ra số nhỏ hơn
# nghĩa là mã theo dõi chỉ được gắn khi hàng đã tới nơi — hành trình đo được KHÔNG đủ
# chặng, đăng lên là nói sai. Loại ra và báo rõ đã loại bao nhiêu.
TOI_THIEU_NGAY = 2
# Khoảng công bố trên web, tính bằng ngày làm việc
HEN = {"nhanh": (3, 5), "tiet-kiem": (8, 12)}
TEN_NHOM = {"nhanh": "Đi nhanh", "tiet-kiem": "Đi tiết kiệm"}


def ngay_lam_viec(a, b):
    d = datetime.fromisoformat(str(a).replace("Z", "").split(".")[0]).date()
    e = datetime.fromisoformat(str(b).replace("Z", "").split(".")[0]).date()
    if e < d:
        return None
    n = 0
    while d < e:
        d += timedelta(days=1)
        if d.weekday() < 5:
            n += 1
    return n


con = sqlite3.connect(args.logistics_db)
rows = con.execute(
    'select o.destinationCountry, o.service, e.dau, s.lastEventAt '
    'from TrackShipment s join "Order" o on o.id = s.orderId '
    'join (select shipmentId, min(time) dau from TrackEvent group by shipmentId) e on e.shipmentId = s.id '
    'where s.status = ? and s.lastEventAt is not null', ("DELIVERED",)).fetchall()

gom, moc, loai = {}, [], []
for nuoc, dv, dau, cuoi in rows:
    if not dau or not cuoi:
        continue
    n = ngay_lam_viec(dau, cuoi)
    if n is None:
        continue
    if n < TOI_THIEU_NGAY:
        loai.append(TUYEN.get((nuoc or "").strip().lower(), (nuoc or "").strip()))
        continue
    tuyen = TUYEN.get((nuoc or "").strip().lower(), (nuoc or "").strip() or "Khác")
    nhom = "nhanh" if (dv or "").upper().startswith("UPS") else "tiet-kiem"
    gom.setdefault((tuyen, nhom), []).append(n)
    moc += [str(dau)[:10], str(cuoi)[:10]]

ket = []
for (tuyen, nhom), v in sorted(gom.items(), key=lambda x: -len(x[1])):
    lo, hi = HEN[nhom]
    du = len(v) >= args.toi_thieu
    ket.append({
        "tuyen": tuyen, "nhom": nhom, "tenNhom": TEN_NHOM[nhom], "soKien": len(v),
        "duDuLieu": du,
        "trungVi": round(statistics.median(v)) if du else None,
        "trungBinh": round(sum(v) / len(v), 1) if du else None,
        "nhanhNhat": min(v) if du else None, "lauNhat": max(v) if du else None,
        "trongHan": round(100 * sum(1 for x in v if x <= hi) / len(v)) if du else None,
        "henLo": lo, "henHi": hi,
    })

out = {
    "capNhat": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    "kyTu": min(moc) if moc else None, "kyDen": max(moc) if moc else None,
    "tongKien": sum(len(v) for v in gom.values()),
    "loaiThieuHanhTrinh": len(loai),
    "toiThieu": args.toi_thieu,
    "dong": ket,
}
js = json.dumps(out, ensure_ascii=False)
print(js if args.chi_in else json.dumps(out, ensure_ascii=False, indent=1))

if not args.chi_in:
    w = sqlite3.connect(args.web_db, timeout=30)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000+00:00")
    w.execute("insert into SiteSetting (key, value, updatedAt) values ('delivery_stats', ?, ?) "
              "on conflict(key) do update set value = excluded.value, updatedAt = excluded.updatedAt", (js, now))
    w.commit()
    print("\nĐã ghi vào SiteSetting.delivery_stats")
