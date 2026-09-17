import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SOURCES = new Set([
  "google-ads", "google", "chatgpt", "perplexity", "gemini", "copilot", "claude",
  "facebook", "zalo", "coccoc", "direct", "other",
]);
const EVENTS = new Set(["call", "copy-phone", "zalo", "link-out", "form"]);

const str = (v: unknown, max: number) => (typeof v === "string" && v ? v.slice(0, max) : null);
const int = (v: unknown, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : 0;
};

/**
 * Nhận số liệu từ bộ đo SiteAnalytics. Route công khai: chỉ nhận đúng trường cần,
 * cắt độ dài, không lưu IP. Luôn trả 204 — hỏng thì mất thống kê, khách không biết gì.
 */
// Bot chạy được JavaScript (crawler Facebook, trình duyệt tự động…) — không phải khách.
const BOT_UA = /bot|crawl|spider|slurp|meta-externalagent|facebookexternalhit|headless|lighthouse|preview|python|curl|wget/i;

export async function POST(req: Request) {
  if (BOT_UA.test(req.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });
  try {
    const b = JSON.parse(await req.text()) as Record<string, unknown>;
    const sid = str(b.sid, 64);
    if (!sid) return new Response(null, { status: 204 });

    if (b.k === "view") {
      const id = str(b.id, 64);
      const path = str(b.path, 300);
      if (id && path && !path.startsWith("/admin")) {
        await prisma.visit.create({
          data: {
            id,
            sessionId: sid,
            visitorId: str(b.vis, 64),
            path,
            title: str(b.title, 160),
            source: SOURCES.has(String(b.source)) ? String(b.source) : "other",
            refHost: str(b.refHost, 100),
            landing: b.landing === true,
            device: b.device === "mobile" ? "mobile" : "desktop",
          },
        });
      }
    } else if (b.k === "update") {
      const id = str(b.id, 64);
      if (id) {
        await prisma.visit.updateMany({
          where: { id, sessionId: sid },
          data: { durationSec: int(b.d, 3600), maxScroll: int(b.s, 100), lastSection: str(b.sec, 120) },
        });
      }
    } else if (b.k === "event" && EVENTS.has(String(b.type))) {
      await prisma.visitEvent.create({
        data: {
          sessionId: sid,
          visitId: str(b.vid, 64),
          path: str(b.path, 300) ?? "",
          type: String(b.type),
          label: str(b.label, 80),
        },
      });
    }
  } catch (e) {
    // id trùng (gửi lại), body hỏng… — bỏ qua
    if (!(e instanceof SyntaxError)) console.error("analytics:", (e as Error).message);
  }
  return new Response(null, { status: 204 });
}
