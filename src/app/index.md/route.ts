import { GET as llms } from "../llms.txt/route";

export const dynamic = "force-dynamic";

/**
 * Trang chủ dạng Markdown cho tác tử AI xin "Accept: text/markdown" (proxy.ts chuyển "/" sang đây).
 * Nội dung = llms.txt (dữ kiện công ty, tuyến, giá đã công bố, danh mục bài) — không lệnh cho AI.
 * Không cho bộ đệm chung giữ bản này, để trình duyệt thường luôn nhận trang HTML.
 */
export async function GET() {
  const res = await llms();
  return new Response(await res.text(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "private, no-store",
      vary: "Accept",
    },
  });
}
