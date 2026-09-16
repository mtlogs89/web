import { findSimilarSlug } from "@/lib/articles";
import { legacyFallback, legacySlug } from "@/lib/legacy-urls";

export const dynamic = "force-dynamic";

/** Đích của proxy.ts cho link web cũ: bài mới gần nghĩa nhất, không có thì trang tuyến. 301. */
export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  // Tuỳ bản Next, req.url là URL sau rewrite (?p=) hoặc URL gốc.
  let path = reqUrl.searchParams.get("p") || reqUrl.pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    // giữ nguyên nếu URL mã hoá hỏng
  }
  const similar = /^\/dich-vu\//.test(path) ? null : await findSimilarSlug(legacySlug(path));
  const target = similar ? `/tin-tuc/${similar}` : legacyFallback(path);
  // Location tương đối: sau nginx, req.url là 127.0.0.1:3001 chứ không phải tên miền thật.
  return new Response(null, { status: 301, headers: { Location: target } });
}
