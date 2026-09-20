import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TOPICS, detectTopic, toSlugWords } from "@/lib/topics";

export const dynamic = "force-dynamic";

/**
 * Khách gõ gì trên Google mà ra web mình — số liệu Search Console do scripts/gsc-sync.py kéo về hằng ngày.
 * Dòng page="*" là tổng cả ngày (gồm cả câu Google giấu vì quá ít người gõ).
 */

const PERIODS = [7, 28, 90];

type Row = { clicks: number; impressions: number; posSum: number };
type Agg = Row & { pages: Map<string, number>; queries: Map<string, number> };

const add = (m: Map<string, Agg>, key: string, r: { clicks: number; impressions: number; position: number }) => {
  let a = m.get(key);
  if (!a) m.set(key, (a = { clicks: 0, impressions: 0, posSum: 0, pages: new Map(), queries: new Map() }));
  a.clicks += r.clicks;
  a.impressions += r.impressions;
  a.posSum += r.position * r.impressions;
  return a;
};
const pos = (a: Row) => (a.impressions ? a.posSum / a.impressions : 0);
const ctr = (a: Row) => (a.impressions ? a.clicks / a.impressions : 0);
const top = (m: Map<string, number>) => [...m.entries()].sort((x, y) => y[1] - x[1])[0]?.[0];
const shiftDay = (day: string, n: number) => {
  const d = new Date(day + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const vnDay = (day: string) => day.split("-").reverse().slice(0, 2).join("/");
const fmt = (n: number) => n.toLocaleString("vi-VN");
const pctText = (x: number) => `${(x * 100).toFixed(x < 0.1 ? 1 : 0)}%`;
// Google trả cả link bản www. lẫn không www. — cắt tên miền cho gọn, giống nhau thì gộp về một đường dẫn.
const cleanPath = (p: string) => p.replace(/^https?:\/\/(www\.)?minhthienlogs\.com/, "") || "/";
const shortPath = (raw: string) => {
  const p = cleanPath(raw);
  // Tên miền khác (beta.minhthienlogs.com hồi tháng 7–8) thì ghi rõ để khỏi tưởng là trang chính.
  const other = p.match(/^https?:\/\/([^/]+)(\/.*)?$/);
  const path = other ? other[2] || "/" : p;
  const prefix = other ? `${other[1].split(".")[0]} · ` : "";
  if (path === "/") return prefix + "Trang chủ";
  return prefix + decodeURIComponent(path).replace(/^\/tin-tuc\//, "bài: ").replace(/^\/dich-vu\//, "dịch vụ: ");
};
// Máy quét SEO gõ kèm "-site:reddit.com…" — không phải khách thật.
const junk = (q: string) => /-site:|site:/.test(q);
const brand = (q: string) => /minh-?thien|minhthien/.test(toSlugWords(q));

function Delta({ now, before }: { now: number; before: number }) {
  if (!before) return now ? <span className="text-xs font-semibold text-brand-600">mới</span> : null;
  const d = Math.round(((now - before) / before) * 100);
  if (d === 0) return <span className="text-xs text-ink-muted">=</span>;
  return <span className={`text-xs font-semibold ${d > 0 ? "text-brand-600" : "text-coral-500"}`}>{d > 0 ? "▲" : "▼"} {Math.abs(d)}%</span>;
}

type Hint = { label: string; cls: string; why: string };
function hintFor(a: Row, min: number, isBrand: boolean): Hint | null {
  if (isBrand) return null;
  const p = pos(a);
  if (p <= 10 && a.impressions >= 2 * min && ctr(a) < 0.03)
    return { label: "Sửa tiêu đề", cls: "bg-sun-50 text-sun-600", why: "Đã lên trang 1 mà ít người bấm — tiêu đề/mô tả chưa hấp dẫn bằng đối thủ" };
  if (p > 8 && p <= 20 && a.impressions >= min)
    return { label: "Sắp lên top", cls: "bg-brand-50 text-brand-700", why: "Đang hạng 8–20: thêm hỏi đáp, link nội bộ, ảnh thật là lên được top 3" };
  if (p > 20 && a.impressions >= min)
    return { label: "Cần bài riêng", cls: "bg-coral-50 text-coral-600", why: "Có người hỏi nhưng web chỉ đứng sau trang 2 — chưa có bài trả lời thẳng câu này" };
  return null;
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
      <h2 className="font-black text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const th = "px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted";
const thR = th.replace("text-left", "text-right");
const td = "px-2 py-2 align-top";
const tdR = td + " text-right tabular-nums";

export default async function TuKhoaPage({ searchParams }: { searchParams: Promise<{ d?: string; t?: string }> }) {
  const sp = await searchParams;
  const days = PERIODS.includes(Number(sp.d)) ? Number(sp.d) : 28;
  const topicKey = sp.t ?? "";

  const [last, first, sync] = await Promise.all([
    prisma.searchQuery.findFirst({ where: { page: "*" }, orderBy: { day: "desc" }, select: { day: true } }),
    prisma.searchQuery.findFirst({ where: { page: "*" }, orderBy: { day: "asc" }, select: { day: true } }),
    prisma.siteSetting.findUnique({ where: { key: "gsc_last_sync" } }),
  ]);

  if (!last) {
    return (
      <div>
        <h1 className="text-2xl font-black text-ink">Từ khoá Google</h1>
        <p className="mt-4 text-ink-muted">Chưa có số liệu — máy chủ chưa kéo lần nào từ Google Search Console (scripts/gsc-sync.py).</p>
      </div>
    );
  }

  // Kỳ xem tính theo ngày cuối Google đã có số (Google chậm 2–3 ngày), kỳ trước = cùng số ngày liền trước.
  const end = last.day;
  const firstDay = first?.day ?? end;
  // Web mới chạy Search Console nên kỳ xem không lùi quá ngày đầu tiên có số.
  const start = [shiftDay(end, -(days - 1)), firstDay].sort().at(-1) as string;
  const prevStart = [shiftDay(start, -days), firstDay].sort().at(-1) as string;
  const hasPrev = start > firstDay;
  const rows = await prisma.searchQuery.findMany({ where: { day: { gte: prevStart, lte: end } } });

  const topicOf = (q: string) => (brand(q) ? "thuong-hieu" : toSlugWords(detectTopic(q)?.label ?? "chua-ro"));
  const topicName = new Map<string, string>([
    ["", "Tất cả"],
    ["thuong-hieu", "Tên Minh Thiện"],
    ...TOPICS.map((t) => [toSlugWords(t.label), t.label] as [string, string]),
    ["chua-ro", "Chưa rõ tuyến"],
  ]);

  const totalNow: Row = { clicks: 0, impressions: 0, posSum: 0 };
  const totalPrev: Row = { clicks: 0, impressions: 0, posSum: 0 };
  const qNow = new Map<string, Agg>();
  const qPrev = new Map<string, Agg>();
  const pNow = new Map<string, Agg>();
  const topicCount = new Map<string, number>();

  for (const r of rows) {
    const cur = r.day >= start;
    if (r.page === "*") {
      const t = cur ? totalNow : totalPrev;
      t.clicks += r.clicks;
      t.impressions += r.impressions;
      t.posSum += r.position * r.impressions;
      continue;
    }
    if (junk(r.query)) continue;
    const tk = topicOf(r.query);
    if (cur) topicCount.set(tk, (topicCount.get(tk) ?? 0) + r.impressions);
    if (topicKey && tk !== topicKey) continue;
    if (!cur) {
      add(qPrev, r.query, r);
      continue;
    }
    const q = add(qNow, r.query, r);
    const path = cleanPath(r.page);
    q.pages.set(path, (q.pages.get(path) ?? 0) + r.impressions);
    const p = add(pNow, path, r);
    p.queries.set(r.query, (p.queries.get(r.query) ?? 0) + r.impressions);
  }

  const min = days <= 7 ? 3 : days <= 28 ? 5 : 10;
  const queries = [...qNow.entries()].sort((a, b) => b[1].impressions - a[1].impressions).slice(0, 300);
  const pages = [...pNow.entries()].sort((a, b) => b[1].impressions - a[1].impressions).slice(0, 50);
  const hintCount = new Map<string, number>();
  for (const [q, a] of queries) {
    const h = hintFor(a, min, brand(q));
    if (h) hintCount.set(h.label, (hintCount.get(h.label) ?? 0) + 1);
  }
  const shown = queries.reduce((s, [, a]) => s + a.impressions, 0);
  const syncInfo = sync ? (JSON.parse(sync.value) as { at: string }) : null;
  const link = (d: number, t: string) => `/admin/tu-khoa?d=${d}${t ? `&t=${t}` : ""}`;

  const kpis = [
    { label: "Lượt web hiện trên Google", now: totalNow.impressions, prev: totalPrev.impressions, text: fmt(totalNow.impressions) },
    { label: "Lượt bấm vào web", now: totalNow.clicks, prev: totalPrev.clicks, text: fmt(totalNow.clicks) },
    { label: "Tỉ lệ bấm", now: ctr(totalNow), prev: ctr(totalPrev), text: pctText(ctr(totalNow)) },
    // Hạng: số nhỏ là tốt → đảo chiều so sánh.
    { label: "Hạng trung bình", now: pos(totalPrev), prev: pos(totalNow), text: pos(totalNow).toFixed(1) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink">Từ khoá Google</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Khách gõ gì trên Google mà thấy web mình. Số liệu từ {vnDay(start)} đến {vnDay(end)} (Google chậm 2–3 ngày)
            {!hasPrev && ` · Google chỉ có số từ ${vnDay(firstDay)} nên chưa so được với kỳ trước`}
            {syncInfo && ` · máy chủ kéo lần cuối ${new Date(syncInfo.at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm">
          {PERIODS.map((d) => (
            <Link key={d} href={link(d, topicKey)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${d === days ? "bg-brand-500 text-white" : "text-ink-soft hover:bg-brand-50"}`}>
              {d} ngày
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-3xl border border-brand-50 bg-white p-5 shadow-sm">
            <div className="text-2xl font-black text-ink">{k.text}</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
              {k.label} {hasPrev && <Delta now={k.now} before={k.prev} />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[...topicName.entries()]
          .filter(([k]) => k === "" || topicCount.get(k))
          .map(([k, name]) => (
            <Link key={k} href={link(days, k)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${k === topicKey ? "bg-ink text-white" : "bg-white text-ink-soft shadow-sm hover:bg-brand-50"}`}>
              {name}
              {k && <span className="ml-1 font-normal opacity-70">{fmt(topicCount.get(k) ?? 0)}</span>}
            </Link>
          ))}
      </div>

      <Card
        title="Khách gõ gì trên Google"
        hint={`${fmt(queries.length)} câu, ${fmt(shown)} lượt hiện. Google giấu các câu quá ít người gõ nên cộng lại luôn thấp hơn tổng ở trên.${[...hintCount.entries()].map(([l, n]) => ` · ${n} câu “${l}”`).join("")}`}
      >
        {queries.length === 0 ? (
          <p className="text-ink-muted">Chưa có câu nào trong kỳ này.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-brand-50">
                  <th className={th}>Câu khách gõ</th>
                  <th className={thR}>Hiện</th>
                  <th className={thR}>Bấm</th>
                  <th className={thR}>Tỉ lệ</th>
                  <th className={thR}>Hạng</th>
                  <th className={thR}>So kỳ trước</th>
                  <th className={th}>Trang hiện ra</th>
                  <th className={th}>Nên làm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {queries.map(([q, a]) => {
                  const h = hintFor(a, min, brand(q));
                  const page = top(a.pages);
                  return (
                    <tr key={q}>
                      <td className={td + " font-medium text-ink"}>{q}</td>
                      <td className={tdR}>{fmt(a.impressions)}</td>
                      <td className={tdR}>{fmt(a.clicks)}</td>
                      <td className={tdR}>{pctText(ctr(a))}</td>
                      <td className={tdR}>{pos(a).toFixed(1)}</td>
                      <td className={tdR}>
                        {hasPrev ? <Delta now={a.impressions} before={qPrev.get(q)?.impressions ?? 0} /> : <span className="text-xs text-ink-muted">—</span>}
                      </td>
                      <td className={td + " max-w-[260px] text-ink-soft"}>
                        {page && (
                          <a href={page} target="_blank" rel="noreferrer" className="hover:text-brand-600 hover:underline">
                            {shortPath(page)}
                          </a>
                        )}
                        {a.pages.size > 1 && <span className="text-xs text-ink-muted"> (+{a.pages.size - 1} trang)</span>}
                      </td>
                      <td className={td}>
                        {h && (
                          <span title={h.why} className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${h.cls}`}>
                            {h.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <ul className="mt-4 space-y-1 text-xs text-ink-muted">
          <li><b className="text-sun-600">Sửa tiêu đề</b>: đã lên trang 1 mà ít người bấm — tiêu đề/mô tả chưa hấp dẫn bằng đối thủ.</li>
          <li><b className="text-brand-700">Sắp lên top</b>: đang hạng 8–20 — thêm hỏi đáp, link từ bài khác, ảnh thật là lên được top 3.</li>
          <li><b className="text-coral-600">Cần bài riêng</b>: có người hỏi nhưng web đứng sau trang 2 — chưa có bài trả lời thẳng câu này.</li>
        </ul>
      </Card>

      <Card title="Trang nào của web hiện nhiều trên Google" hint="Trang hiện nhiều mà tỉ lệ bấm thấp là trang nên sửa tiêu đề trước.">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-brand-50">
                <th className={th}>Trang</th>
                <th className={thR}>Hiện</th>
                <th className={thR}>Bấm</th>
                <th className={thR}>Tỉ lệ</th>
                <th className={thR}>Hạng</th>
                <th className={th}>Câu gõ nhiều nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {pages.map(([p, a]) => (
                <tr key={p}>
                  <td className={td + " max-w-[320px] font-medium text-ink"}>
                    <a href={p} target="_blank" rel="noreferrer" className="hover:text-brand-600 hover:underline">
                      {shortPath(p)}
                    </a>
                  </td>
                  <td className={tdR}>{fmt(a.impressions)}</td>
                  <td className={tdR}>{fmt(a.clicks)}</td>
                  <td className={tdR}>{pctText(ctr(a))}</td>
                  <td className={tdR}>{pos(a).toFixed(1)}</td>
                  <td className={td + " text-ink-soft"}>{top(a.queries)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
