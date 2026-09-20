#!/usr/bin/env python3
"""
Kéo số liệu Google Search Console → bảng SearchQuery: khách gõ câu gì trên Google, trang nào của web hiện ra,
bao nhiêu lượt hiện / bấm, hạng mấy. Mỗi dòng = 1 ngày × 1 câu × 1 trang; riêng dòng page="*" (query rỗng) là TỔNG cả ngày.

Đăng nhập bằng TÀI KHOẢN MÁY chỉ-xem (doc-search-console@minhthien-seo.iam.gserviceaccount.com, quyền
"Restricted" trong Search Console). File khoá nằm ở /root/secrets/ (chmod 600), KHÔNG để trong repo.

Google chậm 2–3 ngày và còn sửa số của mấy ngày gần nhất → mỗi lần chạy lấy lại N ngày cuối rồi GHI ĐÈ
các ngày đó, chạy lại bao nhiêu lần cũng đúng.

Dùng:  python3 gsc-sync.py                 (5 ngày gần nhất — cron hằng ngày)
       python3 gsc-sync.py --days 490      (lần đầu: kéo hết 16 tháng Google còn giữ)
       python3 gsc-sync.py --db <file> --key <file>
Cron:  17 6 * * * nice -n 19 /usr/bin/python3 /var/www/minhthien-web/scripts/gsc-sync.py >> /var/log/gsc-sync.log 2>&1
"""
import argparse, base64, json, re, secrets, sqlite3, time, urllib.parse, urllib.request
from datetime import date, datetime, timedelta, timezone

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

SITE = "sc-domain:minhthienlogs.com"
# Google trả cả link bản www. lẫn không www. — cắt tên miền để hai bản gộp về cùng một đường dẫn.
HOST_RE = re.compile(r"^https?://(www\.)?minhthienlogs\.com")
API = "https://www.googleapis.com/webmasters/v3/sites/" + urllib.parse.quote(SITE, safe="")

ap = argparse.ArgumentParser()
ap.add_argument("--db", default="/var/www/minhthien-web/prisma/dev.db")
ap.add_argument("--key", default="/root/secrets/gsc-minhthien-seo.json")
ap.add_argument("--days", type=int, default=5)
args = ap.parse_args()


def access_token(key_file):
    k = json.load(open(key_file))
    b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=")
    now = int(time.time())
    head = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claim = b64(json.dumps({"iss": k["client_email"], "scope": "https://www.googleapis.com/auth/webmasters.readonly",
                            "aud": k["token_uri"], "iat": now, "exp": now + 3600}).encode())
    pk = serialization.load_pem_private_key(k["private_key"].encode(), None)
    sig = b64(pk.sign(head + b"." + claim, padding.PKCS1v15(), hashes.SHA256()))
    body = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                   "assertion": (head + b"." + claim + b"." + sig).decode()}).encode()
    return json.load(urllib.request.urlopen(k["token_uri"], body, timeout=30))["access_token"]


def fetch(token, start, end, dimensions):
    """Tất cả dòng trong khoảng — lật trang 25.000 dòng/lần."""
    rows, offset = [], 0
    while True:
        req = urllib.request.Request(API + "/searchAnalytics/query", json.dumps({
            "startDate": start, "endDate": end, "dimensions": dimensions,
            "rowLimit": 25000, "startRow": offset, "dataState": "all"}).encode(),
            {"Authorization": "Bearer " + token, "Content-Type": "application/json"})
        batch = json.load(urllib.request.urlopen(req, timeout=120)).get("rows", [])
        rows += batch
        if len(batch) < 25000:
            return rows
        offset += 25000


def main():
    end = date.today()
    start = end - timedelta(days=args.days)
    token = access_token(args.key)
    rows = fetch(token, start.isoformat(), end.isoformat(), ["date", "query", "page"])
    # Tổng cả ngày (kể cả các câu Google giấu vì quá ít người gõ): lưu thành dòng query="", page="*".
    totals = fetch(token, start.isoformat(), end.isoformat(), ["date"])
    data = [("g" + secrets.token_hex(12), r["keys"][0], "", "*", int(r["clicks"]), int(r["impressions"]), float(r["position"]))
            for r in totals]
    # Bỏ tên miền rồi gộp: bản www. và không www. của cùng một trang phải cộng làm một dòng
    # (hạng lấy trung bình theo số lượt hiện), nếu không sẽ đụng khoá (ngày, câu, trang).
    merged = {}
    for r in rows:
        day, query, page = r["keys"]
        key = (day, query.strip(), HOST_RE.sub("", page) or "/")
        c, i, pos_sum = merged.get(key, (0, 0, 0.0))
        merged[key] = (c + int(r["clicks"]), i + int(r["impressions"]),
                       pos_sum + float(r["position"]) * int(r["impressions"]))
    for (day, query, path), (c, i, pos_sum) in merged.items():
        data.append(("g" + secrets.token_hex(12), day, query, path, c, i, pos_sum / i if i else 0.0))
    days = sorted({d[1] for d in data})
    con = sqlite3.connect(args.db, timeout=60)
    with con:
        # Chỉ ghi đè các ngày Google có trả số liệu (ngày chưa có số thì giữ nguyên dòng cũ).
        con.executemany('delete from "SearchQuery" where day = ?', [(d,) for d in days])
        con.executemany('insert into "SearchQuery" (id, day, query, page, clicks, impressions, position) values (?,?,?,?,?,?,?)', data)
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000+00:00")
        info = json.dumps({"at": now, "from": days[0] if days else None, "to": days[-1] if days else None, "rows": len(data)})
        con.execute("insert into SiteSetting (key, value, updatedAt) values ('gsc_last_sync', ?, ?) "
                    "on conflict(key) do update set value = excluded.value, updatedAt = excluded.updatedAt", (info, now))
    print(f"{datetime.now():%Y-%m-%d %H:%M} gsc-sync: {len(data)} dòng, {len(days)} ngày ({days[0] if days else '-'} → {days[-1] if days else '-'})")


if __name__ == "__main__":
    main()
