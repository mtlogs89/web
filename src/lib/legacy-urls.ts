import { detectTopic, toSlugWords } from "./topics";

/** Link web CMS cũ (vd /gui-hang-di-my/gui-sua-di-my-142.html) → phần slug để dò bài mới. */
export function legacySlug(path: string): string {
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/\.html?$/i, "").replace(/-\d+$/, "");
}

/** Không tìm được bài tương ứng → trang tuyến / trang mục gần nghĩa nhất. */
export function legacyFallback(path: string): string {
  const p = path.toLowerCase();
  if (p.startsWith("/author/") || /^\/(index|sitemap|login|admin)\.html$/.test(p)) return "/";
  if (p === "/lien-he.html") return "/lien-he";
  if (p.startsWith("/nhap-hang-") || p.includes("nhap-hang")) return "/nhap-hang";
  if (/^\/(huong-dan|kinh-nghiem|kien-thuc)\//.test(p) && /taobao|1688|wechat|trung-quoc|quang-chau|order/.test(p)) {
    return "/nhap-hang";
  }
  // /dich-vu/gui-hang-di-canada/a → bỏ phần thừa phía sau
  const svc = p.match(/^\/dich-vu\/([^/]+)\/.+/);
  if (svc) return `/dich-vu/${svc[1]}`;

  const topic = detectTopic(p);
  if (topic) return topic.hub;
  if (p.startsWith("/bang-gia") || /^\/(ui-)?gui-hang/.test(p)) return "/gui-hang";
  return "/tin-tuc";
}

// Từ quá chung, không giúp phân biệt bài.
const STOP = new Set(
  [
    "gui hang di va cho cua voi tu tai the nao nhat moi 2020 2024 2025 2026 a z bang gia thu tuc hai quan",
    "cach dong goi chuan quy dinh quy trinh chi tiet huong dan cap nhat van chuyen tphcm",
    // chữ quảng cáo của web cũ
    "nhanh chong an toan re tot uy tin dich vu minh thien logistics logs sieu tiet kiem",
  ].join(" ").split(" ")
);

export function slugTokens(slug: string): Set<string> {
  // "mỹ phẩm", "thực phẩm" là 1 từ — tách ra thì "phẩm" làm 2 bài khác hẳn nhau thành giống.
  const s = toSlugWords(slug).replace(/(^|-)(my|thuc)-pham($|-)/g, "$1$2pham$3");
  return new Set(s.split("-").filter((w) => w && !STOP.has(w)));
}

export function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const w of a) if (b.has(w)) n++;
  return n;
}

/**
 * Chọn bài gần nghĩa nhất cho 1 slug cũ. Bắt buộc CÙNG TUYẾN (nếu slug có tên nước):
 * "gửi hàng đi Úc bao nhiêu 1kg" không được ghép sang bài Canada chỉ vì trùng "bao nhiêu 1kg".
 * Tên nước bị loại khỏi phép đếm để không tự thổi điểm.
 */
export function bestSlugMatch(
  slug: string,
  rows: { slug: string; title: string; category: string }[]
): string | null {
  const topic = detectTopic(slug);
  const country = new Set(topic ? slugTokens(topic.label) : []);
  const strip = (t: Set<string>) => new Set([...t].filter((w) => !country.has(w)));
  const want = strip(slugTokens(slug));
  if (want.size < 2) return null;

  let best: { slug: string; score: number } | null = null;
  for (const r of rows) {
    const rTopic = detectTopic(r.title) ?? detectTopic(r.slug);
    if (topic ? rTopic?.category !== topic.category : rTopic) continue;
    const have = strip(slugTokens(r.slug));
    const common = overlap(want, have);
    if (common < 2) continue;
    const score = common / Math.max(want.size, have.size);
    if (!best || score > best.score) best = { slug: r.slug, score };
  }
  return best && best.score >= 0.5 ? best.slug : null;
}
