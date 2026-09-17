import json, re, sqlite3, sys, importlib.util, collections
spec = importlib.util.spec_from_file_location("gen", __file__.replace("faq.py", "gen.py")); g = importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
DB = sys.argv[1]; OUT = sys.argv[2] if len(sys.argv) > 2 else "faq-drafts.json"
ROUTE_TEXT = {  # giống ROUTE_TRANSIT trong code web
 "my": "đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày",
 "canada": "đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày",
 "uc": "đi nhanh 3–5 ngày làm việc, đi tiết kiệm 8–12 ngày làm việc; vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày",
 "chau-au": "đi nhanh 5–7 ngày làm việc, đi tiết kiệm 8–15 ngày làm việc, tuỳ quốc gia",
 "nhat": "chỉ có dịch vụ đi nhanh, 5–7 ngày làm việc", "han": "chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc",
 "singapore": "đi nhanh 1 ngày làm việc, đi tiết kiệm 4 ngày làm việc", "malaysia": "chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc",
 "thai-lan": "chỉ có dịch vụ đi nhanh, 5–7 ngày làm việc"}
Q_DUOC = re.compile(r"được không|có được|gửi được|có nhận", re.I)
Q_TIME = re.compile(r"bao lâu|mấy ngày|bao nhiêu ngày|thời gian (vận chuyển|giao|gửi|nhận|chuyển)", re.I)
Q_BAN = re.compile(r"(những|các|loại|mặt hàng|thực phẩm)[^?]{0,30}(bị cấm|cấm gửi|cấm)", re.I)
Q_PRICE = re.compile(r"bao nhiêu tiền|giá cước|cước phí|bảng giá|chi phí gửi|giá gửi|giá bao nhiêu|bao nhiêu 1 ?kg|hết bao nhiêu", re.I)
SKIP_PRICE = re.compile(r"thuế|đăng ký|bảo hiểm|bồi thường|phụ thu|đóng gói|kiểm dịch|lưu kho|biển|LCL|FCL|container|CBM|khối", re.I)
SKIP_TIME = g_keep = re.compile(r"yến|hải quan.*giữ|bị giữ|về việt nam|trước bao lâu|giữ lạnh|lưu kho|lưu bãi|biển|LCL|FCL|kiểm dịch ngẫu nhiên|đăng ký|thông quan mất|hạn sử dụng|bảo quản|xử lý", re.I)
EXCLUDE = {"gui-yen-sao-di-my-fda-2026"}
NOTE = g.NOTE_GIA

def price_answer(route, name, item_note):
    if route in g.PRICE:
        p1, p5, bt = g.PRICE[route]
        a = f"Giá gửi hàng đi {name}: 1kg {g.vnd(p1)}, 5kg {g.vnd(p5)}{' đã bao thuế' if bt else ''} ({NOTE}). Hàng cồng kềnh tính theo cân quy đổi (Dài × Rộng × Cao)/5000; có thể tự tính bằng công cụ tính cước trên web."
    else:
        a = f"Giá gửi hàng đi {name} tính theo kg ({NOTE}). Hàng cồng kềnh tính theo cân quy đổi (Dài × Rộng × Cao)/5000."
    if item_note: a += f" Riêng mặt hàng này: {item_note}."
    return a

LEAD = re.compile(r"^(được|có|hoàn toàn (có thể|được)|có thể)\b[\s,.:—–-]*", re.I)
QUAL = re.compile(r"không (có )?nhãn|handmade|tự làm|tự ủ|tự nấu|tự sao|tự phơi|tự bào chế|thủ công|thủy tinh|fake|nhái|hàng giả|thô|còn lông|PCCC|chung|gộp|kèm|ngâm rượu|không có mã|số lượng|bán buôn|tận nơi|tận nhà|lấy hàng|lấy .{0,20} tận|đường biển|bánh chưng|bánh tét|dạng lỏng|bảo hiểm|bồi thường|thất lạc|dễ vỡ|đồ cũ|dính đất", re.I)
STRIP_NEG = re.compile(r"^(tuyệt đối không( được)?|không được phép|không được khuyến khích|không thể gửi được|không thể|không được|không nên|không)[\s.,:—–-]*", re.I)
ITEMS2 = [("sua-trung", r"\bsua\b|trung muoi|\btrung\b(?! quoc| thu)|nhan trung", "sữa, trứng"), ("rau-trai-tuoi", r"trai cay|rau cu|tuoi song|hoa qua", "rau củ, trái cây tươi"),
          ("thit-kho", r"thit|kho bo|lap xuong|cha bong|ruoc|mo heo|top mo", "thịt khô, lạp xưởng, sản phẩm từ thịt"), ("hat-giong", r"hat giong|cay canh", "hạt giống, cây cảnh")] + [x for x in g.ITEMS if x[0] not in ("thit-kho",)]
NEG = re.compile(r"^(không|tuyệt đối không)|cấm tuyệt đối|không (được|nhận|thể) gửi|không nhận", re.I)

def fix_malformed(raw):
    try: v = json.loads(raw)
    except Exception: return None
    if isinstance(v, dict) and "mainEntity" in v:
        return [{"q": e.get("name", ""), "a": (e.get("acceptedAnswer") or {}).get("text", "")} for e in v["mainEntity"]]
    if isinstance(v, list) and v and isinstance(v[0], dict) and "q" not in v[0]:
        out = []
        for e in v:
            q = e.get("question") or e.get("title") or e.get("heading"); a = e.get("answer") or e.get("text") or e.get("content") or e.get("description")
            if q and a: out.append({"q": q, "a": a})
        return out
    return v

con = sqlite3.connect(DB)
REVIEW = []
drafts = []; stat = collections.Counter(); samples = collections.defaultdict(list)
for slug, title, cat, raw in con.execute("select slug,title,category,faqJson from Article where published=1 and faqJson is not null and faqJson not in ('','[]')"):
    items = fix_malformed(raw)
    if items is None: continue
    malformed = json.dumps(items, ensure_ascii=False) != raw and not isinstance(json.loads(raw), list) or (isinstance(json.loads(raw), list) and json.loads(raw) and "q" not in json.loads(raw)[0])
    if malformed: stat["sửa lỗi định dạng"] += 1
    if cat not in g.CAT or slug in EXCLUDE:
        if malformed: drafts.append({"slug": slug, "old": raw, "new": json.dumps(items, ensure_ascii=False)})
        continue
    route, name = g.CAT[cat]
    if route == "chau-au":
        m = dict(g.EU_BY_SLUG).get(slug.replace("gui-hang-di-", "", 1))
        if m: name = m
    data = g.DATA[route]["items"]; sea = re.search(r"duong bien|lcl|fcl", g.norm(title))
    new = []
    for f in items:
        q, a = f.get("q", ""), f.get("a", "")
        nq = g.norm(q)
        item = next(((k, label) for k, rx, label in g.ITEMS if re.search(rx, nq)), None)
        kind = None
        if Q_BAN.search(q) and not re.search(r"gửi nhầm|bị gì|bị phạt", q, re.I):
            no = [g.ALLNAMES[k] for k, v in data.items() if v.get("s") == "no"]
            dk = [g.ALLNAMES[k] for k, v in data.items() if v.get("s") == "dk"]
            a = a.replace(" Riêng thịt, trứng, sữa: Minh Thiện vẫn nhận gửi (phụ thu theo kg) nhưng có rủi ro hàng bị giữ hoặc tiêu huỷ ở đầu Úc — hỏi Ms Min trước khi gửi.", "")
            if "Với Minh Thiện:" not in a:
                pol = " Với Minh Thiện: " + (f"không nhận {', '.join(no)}" if no else "không có mặt hàng nào bị từ chối")
                if dk: pol += f"; nhận có điều kiện (phụ thu hoặc rủi ro bị giữ ở đầu {name}): {', '.join(dk)}"
                a = a.rstrip() + pol + "; các mặt hàng còn lại nhận bình thường."; kind = "hang-cam"
        elif Q_DUOC.search(q) and not QUAL.search(q):
            found = [(k, label) for k, rx, label in ITEMS2 if re.search(rx, nq)]
            if len(found) == 1:
                k, label = found[0]; st = data.get(k, {}).get("s", ""); notes = g.note_phrase(route, name, data.get(k, {}).get("n"))
                orig = f.get("a", "")
                if orig.startswith(("Được — Minh Thiện", "Được, có điều kiện — Minh Thiện", "Minh Thiện nhận gửi", "Không — Minh Thiện")):
                    pass
                elif route == "my" and k == "yen-sao":
                    a = "Được — Minh Thiện có tuyến riêng gửi yến sào đi Mỹ, bao thông quan, mất hàng đền 30 triệu/kg; chốt hàng ngày 15 và 30 hàng tháng, bay 8–15 ngày. Gọi hotline/Zalo 0589.77.89.89 để biết giá theo lạng."
                    kind = "duoc-khong"
                elif st == "no":
                    a = f"Không — Minh Thiện hiện không nhận gửi {label} đi {name}." + ("" if NEG.search(orig) else "")
                    kind = "duoc-khong"
                elif st in ("ok", "dk"):
                    tail = f" ({', '.join(notes)})" if notes else ""
                    if NEG.search(orig) or re.search(r"không nên|không được khuyến khích|rủi ro cao", orig, re.I):
                        law = STRIP_NEG.sub("", orig).strip()
                        law = law[0].upper() + law[1:] if law else ""
                        warn = "" if "rủi ro" in tail else ", nhưng cần biết trước rủi ro"
                        a = f"Minh Thiện nhận gửi {label} đi {name}{tail}{warn}." + (f" Lưu ý: {law}" if law else "")
                    else:
                        head = f"Được — Minh Thiện nhận gửi {label} đi {name}{tail}." if st == "ok" else f"Được, có điều kiện — Minh Thiện nhận gửi {label} đi {name}{tail}."
                        rest = LEAD.sub("", orig).strip()
                        if rest.lower().startswith("nhưng"):
                            a = head[:-1] + ", " + rest[0].lower() + rest[1:]
                        else:
                            a = head + (" " + rest[0].upper() + rest[1:] if rest else "")
                    kind = "duoc-khong"
                if kind:
                    REVIEW.append((cat[12:], label, st, q, orig[:160], a[:260], bool(NEG.search(orig))))
        elif Q_TIME.search(q) and not SKIP_TIME.search(q) and not sea and route in ROUTE_TEXT:
            na = f"Gửi hàng đi {name} bằng đường bay: {ROUTE_TEXT[route]}. Có mã tracking theo dõi tới khi người nhận ký nhận."
            if na != a: a, kind = na, "thoi-gian"
        elif Q_PRICE.search(q) and not SKIP_PRICE.search(q) and not sea and not (route == "my" and re.search(r"\byen\b", nq)):
            note = ", ".join(g.note_phrase(route, name, data.get(item[0], {}).get("n"))) if item else ""
            na = price_answer(route, name, note)
            if na != a: a, kind = na, "gia"
        if kind:
            stat[kind] += 1
            if len(samples[kind]) < 4: samples[kind].append((cat[12:], q, f.get("a", "")[:140], a))
        new.append({"q": q, "a": a})
    nj = json.dumps(new, ensure_ascii=False)
    if nj != raw: drafts.append({"slug": slug, "old": raw, "new": nj})
json.dump(drafts, open(OUT, "w"), ensure_ascii=False, indent=0)
json.dump(REVIEW, open("faq-review.json","w"), ensure_ascii=False, indent=0)
print("bài đổi:", len(drafts), dict(stat))
for k, v in samples.items():
    print("\n##", k)
    for c, q, old, new in v: print(f"  [{c}] {q}\n    CŨ: {old}\n    MỚI: {new}")
