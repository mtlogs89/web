import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * Bảng theo dõi trên trang chủ admin: khách đến từ đâu, làm gì, dừng ở đâu, AI đọc gì.
 * Nguồn: Visit / VisitEvent (bộ đo SiteAnalytics), QuoteLog / QuoteAction (công cụ tính cước),
 * AiCrawl (log nginx, scripts/ai-crawl-sync.py).
 */

const SOURCE_LABEL: Record<string, string> = {
  "google-ads": "Quảng cáo Google",
  google: "Google tìm kiếm",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
  copilot: "Bing / Copilot",
  claude: "Claude",
  facebook: "Facebook",
  zalo: "Zalo",
  coccoc: "Cốc Cốc",
  direct: "Gõ thẳng / không rõ",
  other: "Web khác",
};
const AI_SOURCES = new Set(["chatgpt", "perplexity", "gemini", "copilot", "claude"]);
const CONTACT = new Set(["call", "copy-phone", "zalo", "form"]);
const EVENT_LABEL: Record<string, string> = {
  call: "Bấm gọi",
  "copy-phone": "Sao chép số (máy tính)",
  zalo: "Bấm Zalo",
  form: "Gửi form",
  "link-out": "Bấm link ra ngoài",
};
const KIND_LABEL: Record<string, string> = {
  user: "Có người hỏi AI → AI mở trang",
  search: "Lập chỉ mục để trích dẫn",
  training: "Lấy dữ liệu huấn luyện",
};

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
const mmss = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}p${String(Math.round(s % 60)).padStart(2, "0")}` : `${Math.round(s)}s`);
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const shortPath = (p: string) => (p === "/" ? "Trang chủ" : decodeURIComponent(p).replace(/^\/tin-tuc\//, "bài: ").replace(/^\/dich-vu\//, "dịch vụ: "));
const giờ = (d: Date) =>
  d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
      <h2 className="font-black text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-50">
      <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(pct(value, max), value > 0 ? 3 : 0)}%` }} />
    </div>
  );
}

const th = "px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted";
const td = "px-2 py-2 align-top";

/** Mốc bắt đầu kỳ xem (tách hàm: component không được gọi Date.now trực tiếp). */
function startOf(days: number) {
  return new Date(Date.now() - days * 86_400_000);
}

export async function TrafficDashboard({ days }: { days: number }) {
  const since = startOf(days);
  const sinceDay = since.toISOString().slice(0, 10);

  const [visits, events, quotes, quoteActions, crawl, firstVisit] = await Promise.all([
    prisma.visit.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "asc" } }),
    prisma.visitEvent.findMany({ where: { createdAt: { gte: since } } }),
    prisma.quoteLog.findMany({ where: { createdAt: { gte: since } }, select: { sessionId: true, page: true } }),
    prisma.quoteAction.findMany({ where: { createdAt: { gte: since } }, select: { sessionId: true, action: true } }),
    prisma.aiCrawl.findMany({ where: { day: { gte: sinceDay } } }),
    prisma.visit.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
  ]);

  // ---- Gom theo phiên ----
  type Session = {
    id: string;
    source: string;
    refHost: string | null;
    device: string;
    visits: typeof visits;
    contacts: string[];
    quoted: boolean;
    duration: number;
  };
  const sessions = new Map<string, Session>();
  for (const v of visits) {
    let s = sessions.get(v.sessionId);
    if (!s) {
      s = { id: v.sessionId, source: v.source, refHost: v.refHost, device: v.device, visits: [], contacts: [], quoted: false, duration: 0 };
      sessions.set(v.sessionId, s);
    }
    s.visits.push(v);
    s.duration += v.durationSec;
  }
  for (const e of events) {
    const s = sessions.get(e.sessionId);
    if (s && CONTACT.has(e.type)) s.contacts.push(e.type);
  }
  for (const a of quoteActions) {
    const s = a.sessionId ? sessions.get(a.sessionId) : undefined;
    if (s) s.contacts.push(a.action === "lead" ? "form" : a.action === "call" ? "call" : "zalo");
  }
  for (const q of quotes) {
    const s = q.sessionId ? sessions.get(q.sessionId) : undefined;
    if (s) s.quoted = true;
  }
  const all = [...sessions.values()];
  const contacted = (s: Session) => s.contacts.length > 0;
  const bounced = (s: Session) => s.visits.length === 1 && s.duration < 10;

  // ---- Theo nguồn ----
  const bySource = new Map<string, Session[]>();
  for (const s of all) bySource.set(s.source, [...(bySource.get(s.source) ?? []), s]);
  const sourceRows = [...bySource.entries()]
    .map(([src, ss]) => ({
      src,
      n: ss.length,
      pages: avg(ss.map((s) => s.visits.length)),
      time: avg(ss.map((s) => s.duration)),
      bounce: pct(ss.filter(bounced).length, ss.length),
      quote: pct(ss.filter((s) => s.quoted).length, ss.length),
      contact: pct(ss.filter(contacted).length, ss.length),
    }))
    .sort((a, b) => b.n - a.n);

  // ---- Theo trang ----
  type PageRow = { path: string; title: string; views: number; landings: number; exits: number; times: number[]; scrolls: number[]; contactSessions: Set<string>; sections: Map<string, number>; readEnd: number };
  const pages = new Map<string, PageRow>();
  for (const s of all) {
    s.visits.forEach((v, i) => {
      let p = pages.get(v.path);
      if (!p) {
        p = { path: v.path, title: v.title || v.path, views: 0, landings: 0, exits: 0, times: [], scrolls: [], contactSessions: new Set(), sections: new Map(), readEnd: 0 };
        pages.set(v.path, p);
      }
      p.views++;
      if (i === 0) p.landings++;
      if (v.durationSec > 0) p.times.push(v.durationSec);
      if (v.maxScroll > 0) p.scrolls.push(v.maxScroll);
      if (v.maxScroll >= 90) p.readEnd++;
      if (i === s.visits.length - 1) {
        p.exits++;
        const sec = v.maxScroll >= 90 ? "✓ Đọc hết trang" : v.lastSection || "(chưa cuộn tới mục nào)";
        p.sections.set(sec, (p.sections.get(sec) ?? 0) + 1);
      }
    });
  }
  for (const e of events) {
    if (CONTACT.has(e.type)) pages.get(e.path)?.contactSessions.add(e.sessionId);
  }
  const pageRows = [...pages.values()].sort((a, b) => b.views - a.views);

  // ---- Bấm gì ----
  const clickMap = new Map<string, number>();
  for (const e of events) {
    const k = `${EVENT_LABEL[e.type] ?? e.type} · ${e.label ?? ""}`;
    clickMap.set(k, (clickMap.get(k) ?? 0) + 1);
  }
  const clicks = [...clickMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  // ---- AI ----
  const crawlByKind = new Map<string, Map<string, number>>();
  const botTotals = new Map<string, { kind: string; hits: number; verified: boolean; pages: Set<string> }>();
  const FILES = new Set(["/robots.txt", "/sitemap.xml", "/llms.txt"]);
  const fileHits = new Map<string, number>();
  for (const c of crawl) {
    if (FILES.has(c.path)) fileHits.set(c.path, (fileHits.get(c.path) ?? 0) + c.hits);
  }
  for (const c of crawl) {
    if (FILES.has(c.path)) continue;
    const m = crawlByKind.get(c.kind) ?? new Map<string, number>();
    m.set(c.path, (m.get(c.path) ?? 0) + c.hits);
    crawlByKind.set(c.kind, m);
    const b = botTotals.get(c.bot) ?? { kind: c.kind, hits: 0, verified: c.verified, pages: new Set<string>() };
    b.hits += c.hits;
    b.pages.add(c.path);
    botTotals.set(c.bot, b);
  }
  const top = (kind: string, n: number) => [...(crawlByKind.get(kind) ?? new Map()).entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  const crawlSlugs = [...new Set(crawl.filter((c) => c.path.startsWith("/tin-tuc/")).map((c) => c.path.slice(9)))];
  const titleBySlug = new Map(
    (await prisma.article.findMany({ where: { slug: { in: crawlSlugs } }, select: { slug: true, title: true } })).map((a) => [`/tin-tuc/${a.slug}`, a.title]),
  );
  const aiSessions = all.filter((s) => AI_SOURCES.has(s.source));

  const totalViews = visits.length;
  const kpis = [
    { label: "Lượt khách (phiên)", value: all.length.toLocaleString("vi-VN") },
    { label: "Lượt xem trang", value: totalViews.toLocaleString("vi-VN") },
    { label: "Thời gian TB / phiên", value: mmss(avg(all.map((s) => s.duration))) },
    { label: "Vào 1 trang rồi thoát < 10s", value: `${pct(all.filter(bounced).length, all.length)}%` },
    { label: "Có tính cước", value: `${pct(all.filter((s) => s.quoted).length, all.length)}%` },
    { label: "Có gọi / Zalo / để số", value: `${pct(all.filter(contacted).length, all.length)}%` },
    { label: "Khách do AI dẫn tới", value: aiSessions.length.toLocaleString("vi-VN") },
  ];

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-ink">Khách & AI trên web</h2>
          {firstVisit && (
            <p className="text-sm text-ink-muted">
              Bắt đầu đo từ {giờ(firstVisit.createdAt)}. Không lưu IP / tên / số điện thoại của khách.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {[1, 7, 30].map((d) => (
            <Link
              key={d}
              href={`/admin?d=${d}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${d === days ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700"}`}
            >
              {d === 1 ? "24 giờ" : `${d} ngày`}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-brand-50 bg-white p-4 shadow-sm">
            <div className="text-2xl font-black text-ink">{k.value}</div>
            <div className="text-xs text-ink-muted">{k.label}</div>
          </div>
        ))}
      </div>

      <Card title="Khách đến từ đâu" hint="Mỗi dòng là một nguồn. So cột cuối để biết nguồn nào ra khách thật.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr><th className={th}>Nguồn</th><th className={th}>Phiên</th><th className={th}>Trang/phiên</th><th className={th}>Thời gian TB</th><th className={th}>Thoát ngay</th><th className={th}>Tính cước</th><th className={th}>Gọi/Zalo/để số</th></tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {sourceRows.map((r) => (
                <tr key={r.src} className={AI_SOURCES.has(r.src) ? "bg-sun-50/60" : ""}>
                  <td className={`${td} font-semibold text-ink`}>{SOURCE_LABEL[r.src] ?? r.src}{AI_SOURCES.has(r.src) && " 🤖"}</td>
                  <td className={td}>{r.n}</td>
                  <td className={td}>{r.pages.toFixed(1)}</td>
                  <td className={td}>{mmss(r.time)}</td>
                  <td className={td}>{r.bounce}%</td>
                  <td className={td}>{r.quote}%</td>
                  <td className={`${td} font-bold text-brand-700`}>{r.contact}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sourceRows.length === 0 && <p className="text-ink-muted">Chưa có số liệu — bộ đo vừa bật, đợi khách vào.</p>}
        </div>
      </Card>

      <Card title="Trang nào được xem, giữ chân được bao lâu" hint="“Thoát ở đây” cao + thời gian thấp = trang làm khách bỏ đi. “Liên hệ” = số phiên bấm gọi/Zalo ngay trên trang đó.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr><th className={th}>Trang</th><th className={th}>Xem</th><th className={th}>Vào đầu tiên</th><th className={th}>Thời gian TB</th><th className={th}>Cuộn TB</th><th className={th}>Đọc hết</th><th className={th}>Thoát ở đây</th><th className={th}>Liên hệ</th></tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {pageRows.slice(0, 20).map((p) => (
                <tr key={p.path}>
                  <td className={`${td} max-w-xs`}>
                    <a href={p.path} target="_blank" rel="noreferrer" className="font-semibold text-ink hover:text-brand-600">{p.title}</a>
                    <div className="truncate text-xs text-ink-muted">{shortPath(p.path)}</div>
                  </td>
                  <td className={td}>{p.views}</td>
                  <td className={td}>{p.landings}</td>
                  <td className={td}>{mmss(avg(p.times))}</td>
                  <td className={td}>{Math.round(avg(p.scrolls))}%</td>
                  <td className={td}>{pct(p.readEnd, p.views)}%</td>
                  <td className={td}>{pct(p.exits, p.views)}%</td>
                  <td className={`${td} font-bold text-brand-700`}>{p.contactSessions.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Khách dừng đọc ở mục nào rồi rời web" hint="Với các trang được xem nhiều nhất: mục (tiêu đề H2) xa nhất khách đọc tới trước khi thoát. Mục nào khách bỏ đi nhiều → nên đưa nút liên hệ / câu trả lời chính lên trước mục đó.">
        <div className="grid gap-5 lg:grid-cols-2">
          {pageRows.filter((p) => p.exits >= 2).slice(0, 8).map((p) => {
            const secs = [...p.sections.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
            return (
              <div key={p.path}>
                <div className="truncate font-semibold text-ink">{p.title}</div>
                <ul className="mt-2 space-y-1.5">
                  {secs.map(([sec, n]) => (
                    <li key={sec}>
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="truncate text-ink-soft">{sec}</span>
                        <span className="shrink-0 font-semibold text-ink">{n}</span>
                      </div>
                      <Bar value={n} max={p.exits} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Khách bấm gì" hint="Nút nằm ở đâu: floating-call/zalo = nút nổi góc màn hình.">
          <ul className="space-y-2 text-sm">
            {clicks.map(([k, n]) => (
              <li key={k} className="flex justify-between gap-3"><span className="truncate text-ink-soft">{k}</span><span className="font-semibold text-ink">{n}</span></li>
            ))}
            {clicks.length === 0 && <li className="text-ink-muted">Chưa có.</li>}
          </ul>
        </Card>

        <Card title="10 lượt khách gần nhất" hint="Đi từ đâu → xem gì → làm gì.">
          <ul className="space-y-3 text-sm">
            {all.slice(-10).reverse().map((s) => (
              <li key={s.id} className="rounded-2xl bg-brand-50/50 p-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  <span>{giờ(s.visits[0].createdAt)}</span>·<span className="font-semibold text-ink">{SOURCE_LABEL[s.source] ?? s.source}</span>·<span>{s.device === "mobile" ? "📱" : "💻"}</span>
                  {s.quoted && <span className="rounded-full bg-sun-100 px-2 font-semibold text-sun-600">tính cước</span>}
                  {s.contacts.length > 0 && <span className="rounded-full bg-coral-100 px-2 font-semibold text-coral-600">{[...new Set(s.contacts.map((c) => EVENT_LABEL[c] ?? c))].join(", ")}</span>}
                </div>
                <div className="mt-1 text-ink-soft">
                  {s.visits.map((v) => `${shortPath(v.path)} (${mmss(v.durationSec)}${v.maxScroll ? `, ${v.maxScroll}%` : ""})`).join(" → ")}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="AI đọc gì trên web" hint="Từ log máy chủ, cập nhật mỗi giờ. Chỉ đếm bot thật (đã lọc máy quét giả danh ChatGPT).">
        <div className="grid gap-6 lg:grid-cols-3">
          {(["user", "search", "training"] as const).map((kind) => (
            <div key={kind}>
              <div className="font-semibold text-ink">{KIND_LABEL[kind]}</div>
              <ul className="mt-2 space-y-1 text-sm">
                {top(kind, 12).map(([path, n]) => (
                  <li key={path} className="flex justify-between gap-3">
                    <a href={path} target="_blank" rel="noreferrer" className="truncate text-ink-soft hover:text-brand-600">{titleBySlug.get(path) ?? shortPath(path)}</a>
                    <span className="font-semibold text-ink">{n}</span>
                  </li>
                ))}
                {top(kind, 1).length === 0 && <li className="text-ink-muted">Chưa có.</li>}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          File dành cho bot: robots.txt {fileHits.get("/robots.txt") ?? 0} lượt · sitemap.xml {fileHits.get("/sitemap.xml") ?? 0} · llms.txt {fileHits.get("/llms.txt") ?? 0}
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className={th}>Bot</th><th className={th}>Làm gì</th><th className={th}>Lượt đọc</th><th className={th}>Số trang</th><th className={th}>Xác minh IP</th></tr></thead>
            <tbody className="divide-y divide-brand-50">
              {[...botTotals.entries()].sort((a, b) => b[1].hits - a[1].hits).map(([bot, b]) => (
                <tr key={bot}>
                  <td className={`${td} font-semibold text-ink`}>{bot}</td>
                  <td className={td}>{KIND_LABEL[b.kind]}</td>
                  <td className={td}>{b.hits}</td>
                  <td className={td}>{b.pages.size}</td>
                  <td className={td}>{b.verified ? "✓" : "hãng không công bố IP"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
