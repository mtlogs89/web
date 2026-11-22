import { site } from "@/lib/site";
import { htmlToMarkdown } from "@/lib/html-md";
import { GET as llms } from "../llms.txt/route";

export const dynamic = "force-dynamic";

/** Trang nào được trả Markdown (khớp MD_PATH trong proxy.ts). */
const CHO_PHEP = /^\/(|dich-vu\/[^/.]+|tin-tuc\/[^/.]+|hang-gui-duoc(\/[^/.]+)?|kien-thuc(\/[^/.]+)?|gioi-thieu|thoi-gian-giao-thuc-te)$/;

const md = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      // Bản Markdown chỉ cho tác tử AI xin "Accept: text/markdown"; không cho bộ đệm chung giữ.
      "cache-control": "private, no-store",
      vary: "Accept",
    },
  });

/**
 * Trang dạng Markdown cho tác tử AI (proxy.ts chuyển yêu cầu có "Accept: text/markdown" về đây).
 * Trang chủ = llms.txt. Trang khác: tự lấy chính trang HTML của web rồi đổi phần <main> sang
 * Markdown — cùng nội dung người đọc thấy, không viết riêng cho AI.
 */
export async function GET(request: Request) {
  // Tuỳ bản Next, request.url là URL sau rewrite (?p=) hoặc URL gốc (bản đang dùng: URL gốc).
  const u = new URL(request.url);
  const p = u.searchParams.get("p") || u.pathname;
  if (!CHO_PHEP.test(p)) return md("Không có bản Markdown cho đường dẫn này.\n", 404);
  if (p === "/") return md(await (await llms()).text());

  const goc = process.env.PORT ? `http://127.0.0.1:${process.env.PORT}` : new URL(request.url).origin;
  let res: Response;
  try {
    res = await fetch(`${goc}${p}`, { headers: { accept: "text/html" }, cache: "no-store", signal: AbortSignal.timeout(15000) });
  } catch {
    return md("Trang tạm thời không đọc được.\n", 503);
  }
  if (!res.ok) return md(`Không tìm thấy trang ${p}.\n`, res.status === 404 ? 404 : 502);
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? site.name;
  const desc = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "";
  const nguon = `${site.url}${p}`;
  const dau = [`<!-- Bản Markdown của ${nguon} -->`, desc ? `> ${desc}` : "", `Nguồn: ${nguon} · ${site.name} · Hotline/Zalo ${site.phoneDisplay}`]
    .filter(Boolean)
    .join("\n\n");
  return md(`${dau}\n\n${htmlToMarkdown(html, site.url)}`.replace(/^/, `<!-- ${title.replace(/--/g, "–")} -->\n`));
}
