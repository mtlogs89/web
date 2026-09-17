import json, sqlite3, sys
from datetime import datetime, timezone
DB, drafts, WRITE = sys.argv[1], json.load(open(sys.argv[2])), "--ghi" in sys.argv
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "000+00:00"
con = sqlite3.connect(DB, timeout=30); ok, skip = [], []
for x in drafts:
    row = con.execute("select faqJson, published from Article where slug=?", (x["slug"],)).fetchone()
    if not row or not row[1]: skip.append((x["slug"], "không hiển thị")); continue
    if row[0] == x["new"]: continue
    if row[0] != x["old"]: skip.append((x["slug"], "FAQ đã bị sửa sau khi soạn")); continue
    ok.append(x)
print("sẽ sửa", len(ok), "| bỏ qua", len(skip)); [print("  bỏ", s) for s in skip]
if WRITE:
    with con:
        for x in ok: con.execute("update Article set faqJson=?, updatedAt=? where slug=?", (x["new"], NOW, x["slug"]))
    print("ĐÃ GHI")
