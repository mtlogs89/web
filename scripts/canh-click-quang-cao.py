#!/usr/bin/env python3
"""
Canh click tặc Google Ads: mỗi ngày đếm số cú bấm quảng cáo theo từng IP, IP nào vượt
ngưỡng thì bắn tin Telegram để chủ đưa vào danh sách loại trừ IP trong Google Ads.

CÁCH ĐẾM: mỗi cú bấm quảng cáo Google gắn một mã `gclid` riêng vào link. Đếm số gclid
KHÁC NHAU của một IP = số cú bấm bị TÍNH TIỀN. Cùng một gclid tải lại nhiều lần thì
Google không tính tiền thêm, nên không đếm trùng.

BỎ QUA (không phải khách bấm quảng cáo):
  - Dải IP của chính Google đi kiểm tra trang đích (2001:4860:… và các dải khác).
  - Máy người nhà: IP từng mở được trang quản trị thật (/admin/<mục>, mã 200).
    Nhận ra tự động nên chủ đổi mạng, đổi IP vẫn không bị báo nhầm.
  - IP ghi trong /root/secrets/ip-bo-qua.txt (mỗi dòng 1 IP, sau dấu # là ghi chú).

Dùng:  python3 scripts/canh-click-quang-cao.py                  (hôm nay, ngưỡng 8)
       python3 scripts/canh-click-quang-cao.py --nguong 5
       python3 scripts/canh-click-quang-cao.py --ngay 19/Sep/2026 --thu    (xem thử, không gửi tin)
Cron:  5 22 * * * nice -n 19 /usr/bin/python3 /var/www/minhthien-web/scripts/canh-click-quang-cao.py >> /var/log/canh-click.log 2>&1
"""
import argparse, glob, gzip, json, os, re, urllib.parse, urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone

ap = argparse.ArgumentParser()
ap.add_argument("--log", default="/var/log/nginx/access.log")
ap.add_argument("--env", default="/var/www/minhthien-web/.env")
ap.add_argument("--bo-qua", default="/root/secrets/ip-bo-qua.txt")
ap.add_argument("--nguong", type=int, default=8, help="bao nhiêu cú bấm/ngày thì báo")
ap.add_argument("--ngay", help="dạng 20/Sep/2026, mặc định là hôm nay")
ap.add_argument("--thu", action="store_true", help="chỉ in ra, không gửi Telegram")
args = ap.parse_args()

VN = timezone(timedelta(hours=7))
NGAY = args.ngay or datetime.now(VN).strftime("%d/%b/%Y")
# Log nginx ghi tháng kiểu Anh (20/Sep/2026); tin nhắn cho chủ đọc thì viết kiểu Việt.
NGAY_VN = datetime.strptime(NGAY, "%d/%b/%Y").strftime("%d/%m/%Y")

# Dải IP Google dùng để tự kiểm tra trang đích quảng cáo — không phải khách, không tính tiền.
GOOGLE = ("2001:4860:", "66.249.", "64.233.", "72.14.", "74.125.", "209.85.", "216.239.", "142.250.", "172.217.")

DONG = re.compile(r'^(\S+) \S+ \S+ \[([^:]+):\S+ [^\]]+\] "(?:GET|POST) (\S+) [^"]*" (\d{3}) ')
GCLID = re.compile(r"[?&]gclid=([^&\s]+)")
# Trang quản trị thật: /admin/bai-viet, /admin/lead… Máy dò lỗ hổng xin /admin/.env nên
# có dấu chấm — mẫu dưới không khớp, khỏi bị coi nhầm là người nhà.
ADMIN = re.compile(r"^/admin/[a-z0-9-]+(?:\?|$)")


def doc_log():
    """Đọc access.log + các bản đã xoay vòng, đủ để bao trọn một ngày."""
    for f in [args.log, args.log + ".1"] + sorted(glob.glob(args.log + ".2.gz")):
        if not os.path.exists(f):
            continue
        mo = gzip.open if f.endswith(".gz") else open
        with mo(f, "rt", errors="replace") as fh:
            for line in fh:
                yield line


def bo_qua_thu_cong():
    ips = set()
    if os.path.exists(args.bo_qua):
        for d in open(args.bo_qua, encoding="utf-8"):
            d = d.split("#")[0].strip()
            if d:
                ips.add(d)
    return ips


def main():
    bam = defaultdict(set)      # ip -> {gclid}
    trang = defaultdict(set)    # ip -> {đường dẫn}
    nguoi_nha = set()

    for line in doc_log():
        m = DONG.match(line)
        if not m:
            continue
        ip, ngay, duong_dan, ma = m.group(1), m.group(2), m.group(3), m.group(4)
        if ngay != NGAY:
            continue
        if ma == "200" and ADMIN.match(duong_dan) and not duong_dan.startswith("/admin/login"):
            nguoi_nha.add(ip)
        if "_rsc=" in duong_dan:      # Next.js nạp trước, không phải người bấm
            continue
        g = GCLID.search(duong_dan)
        if g:
            bam[ip].add(g.group(1))
            trang[ip].add(urllib.parse.urlparse(duong_dan).path)

    tay = bo_qua_thu_cong()
    nghi_ngo = sorted(
        ((len(v), ip) for ip, v in bam.items()
         if len(v) >= args.nguong and not ip.startswith(GOOGLE) and ip not in nguoi_nha and ip not in tay),
        reverse=True)
    tong = sum(len(v) for ip, v in bam.items() if not ip.startswith(GOOGLE))
    gio = datetime.now(VN).strftime("%Y-%m-%d %H:%M")
    print(f"{gio} canh-click {NGAY}: {tong} cú bấm, {len(bam)} IP, "
          f"bỏ qua {len(nguoi_nha)} IP người nhà + {len(tay)} IP khai tay — "
          f"{len(nghi_ngo) or 'không có'} IP vượt ngưỡng {args.nguong}")

    if not nghi_ngo:
        return
    dong = [f"⚠️ <b>Nghi click tặc Google Ads</b> — ngày {NGAY_VN}", ""]
    for so, ip in nghi_ngo[:10]:
        duong = " · ".join(f"<code>{p}</code>" for p in sorted(trang[ip])[:2])
        dong.append(f"• <code>{ip}</code> — <b>{so}</b> cú bấm → {duong}")
    dong += ["", f"Tổng hôm nay: {tong} cú bấm từ {len(bam)} IP.",
             "Chặn: Google Ads → Cài đặt chiến dịch → Loại trừ IP."]
    tin = "\n".join(dong)
    print(tin.replace("<b>", "").replace("</b>", "").replace("<code>", "").replace("</code>", ""))
    if args.thu:
        return

    env = {}
    for d in open(args.env, encoding="utf-8"):
        if "=" in d and not d.strip().startswith("#"):
            k, v = d.split("=", 1)
            env[k.strip()] = v.strip().strip("\"'")
    token, chat = env.get("TELEGRAM_BOT_TOKEN"), env.get("TELEGRAM_LEAD_CHAT_ID")
    if not token or not chat:
        print("!! thiếu TELEGRAM_BOT_TOKEN / TELEGRAM_LEAD_CHAT_ID trong .env — không gửi được")
        return
    body = urllib.parse.urlencode({"chat_id": chat, "text": tin, "parse_mode": "HTML"}).encode()
    try:
        r = urllib.request.urlopen(f"https://api.telegram.org/bot{token}/sendMessage", body, timeout=15)
        print("đã gửi Telegram:", json.load(r).get("ok"))
    except Exception as e:
        print("!! gửi Telegram hỏng:", e)


if __name__ == "__main__":
    main()
