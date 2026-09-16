#!/usr/bin/env python3
"""
Gom log nginx → bảng AiCrawl: bot tìm kiếm / AI nào đọc trang nào của minhthienlogs.com, theo ngày.

Chạy trên VPS bằng cron mỗi giờ (xem cuối file). Đọc các file access.log* còn giữ (14 ngày),
tính lại toàn bộ các ngày có trong log rồi GHI ĐÈ các ngày đó → chạy lại bao nhiêu lần cũng đúng.

Xác minh bot thật bằng danh sách IP chính thức (OpenAI, Perplexity, Google, Bing). Log có rất nhiều
máy quét giả danh "GPTBot/ChatGPT-User" để dò /.env, /login… — chỉ đếm bot có IP khớp; bot không công bố
IP (Claude, Apple, Meta…) đánh dấu verified=0 và chỉ đếm trên trang thật của web trả 200.
"""
import gzip, glob, ipaddress, json, re, sqlite3, sys, urllib.request
from collections import Counter
from datetime import datetime

DB = sys.argv[1] if len(sys.argv) > 1 else "/var/www/minhthien-web/prisma/dev.db"
HOST = "minhthienlogs.com"

# (tên hiển thị, mẫu user-agent, loại, file IP chính thức)
BOTS = [
    ("ChatGPT-User", r"ChatGPT-User", "user", "https://openai.com/chatgpt-user.json"),
    ("OAI-SearchBot", r"OAI-SearchBot", "search", "https://openai.com/searchbot.json"),
    ("GPTBot", r"GPTBot", "training", "https://openai.com/gptbot.json"),
    ("Perplexity-User", r"Perplexity-User", "user", "https://www.perplexity.com/perplexity-user.json"),
    ("PerplexityBot", r"PerplexityBot", "search", "https://www.perplexity.com/perplexitybot.json"),
    ("Claude-User", r"Claude-User", "user", None),
    ("Claude-SearchBot", r"Claude-SearchBot", "search", None),
    ("ClaudeBot", r"ClaudeBot", "training", None),
    ("DuckAssistBot", r"DuckAssistBot", "user", None),
    ("Googlebot", r"Googlebot", "search", "https://developers.google.com/static/search/apis/ipranges/googlebot.json"),
    ("Bingbot", r"bingbot", "search", "https://www.bing.com/toolbox/bingbot.json"),
    ("Applebot", r"Applebot", "search", None),
    ("CocCocBot", r"coccocbot", "search", None),
    ("Meta-AI", r"meta-externalagent", "training", None),
    ("Amazonbot", r"Amazonbot", "training", None),
    ("Bytespider", r"Bytespider", "training", None),
]
BOT_RE = [(n, re.compile(p, re.I), k, u) for n, p, k, u in BOTS]

# Trang thật của web (log cũ chưa có tên miền: không đếm "/" vì trùng app khác cùng máy chủ).
WEB_PATH = re.compile(r"^/(tin-tuc|dich-vu|gui-hang|nhap-hang|lien-he|tra-cuu|thu-vien|gioi-thieu|llms\.txt|sitemap\.xml|robots\.txt)(/|$)")
LINE = re.compile(
    r'^(?P<ip>\S+) \S+ \S+ \[(?P<t>[^\]]+)\] "(?:GET|HEAD) (?P<path>\S+) [^"]*" (?P<code>\d{3}) \S+ "[^"]*" "(?P<ua>[^"]*)"(?P<rest>.*)$'
)


def load_nets(url):
    if not url:
        return None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "minhthien-ai-crawl-sync"})
        data = json.load(urllib.request.urlopen(req, timeout=15))
        return [ipaddress.ip_network(p.get("ipv4Prefix") or p.get("ipv6Prefix")) for p in data["prefixes"]]
    except Exception as e:  # mất mạng → bot đó coi như chưa xác minh được lần này
        print("không tải được", url, e, file=sys.stderr)
        return []


def main():
    nets = {n: load_nets(u) for n, _, _, u in BOT_RE}
    counts = Counter()
    for f in sorted(glob.glob("/var/log/nginx/access.log*")):
        opener = gzip.open if f.endswith(".gz") else open
        with opener(f, "rt", errors="ignore") as fh:
            for line in fh:
                m = LINE.match(line)
                if not m or m["code"] not in ("200", "304"):
                    continue
                ua = m["ua"]
                bot = next(((n, k) for n, rx, k, _ in BOT_RE if rx.search(ua)), None)
                if not bot:
                    continue
                host = re.search(r"host=(\S+)", m["rest"])
                path = m["path"].split("?")[0]
                if host:
                    if HOST not in host.group(1):
                        continue
                    if path.startswith(("/_next", "/images", "/uploads", "/api")):
                        continue
                elif not WEB_PATH.match(path):
                    continue
                name, kind = bot
                ok = nets.get(name)
                if ok is not None:
                    if not ok:
                        verified = False  # tải danh sách hỏng
                    else:
                        try:
                            ip = ipaddress.ip_address(m["ip"])
                        except ValueError:
                            continue
                        if not any(ip in n for n in ok):
                            continue  # giả danh
                        verified = True
                else:
                    verified = False
                day = datetime.strptime(m["t"].split()[0], "%d/%b/%Y:%H:%M:%S").strftime("%Y-%m-%d")
                counts[(day, name, kind, path[:300], verified)] += 1

    days = sorted({k[0] for k in counts})
    con = sqlite3.connect(DB, timeout=30)
    with con:
        for d in days:
            con.execute("DELETE FROM AiCrawl WHERE day = ?", (d,))
        merged = Counter()
        flags = {}
        for (day, name, kind, path, ver), hits in counts.items():
            merged[(day, name, kind, path)] += hits
            flags[(day, name, kind, path)] = flags.get((day, name, kind, path), False) or ver
        con.executemany(
            "INSERT INTO AiCrawl (id, day, bot, kind, path, hits, verified) VALUES (lower(hex(randomblob(12))), ?, ?, ?, ?, ?, ?)",
            [(d, n, k, p, h, 1 if flags[(d, n, k, p)] else 0) for (d, n, k, p), h in merged.items()],
        )
    print(f"{len(merged)} dòng, {len(days)} ngày ({days[0] if days else '-'} → {days[-1] if days else '-'})")


if __name__ == "__main__":
    main()

# Cron trên VPS (crontab -e):
# 7 * * * * /usr/bin/python3 /var/www/minhthien-web/scripts/ai-crawl-sync.py >> /var/log/ai-crawl-sync.log 2>&1
