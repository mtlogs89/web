import { NextResponse, type NextRequest } from "next/server";

/**
 * Link của web CMS cũ (vd /gui-hang-di-my/...-149.html, /thong-tin/..., /author/...)
 * vẫn còn trong Google và trên Facebook/Zalo cũ; trước đây đều ra 404.
 * Chuyển nội bộ sang /api/chuyen-huong — nơi dò bài mới tương ứng rồi trả 301.
 */
/**
 * Trang nội dung có bản Markdown cho tác tử AI (route /md). Không chứa dấu chấm để không
 * đụng link web cũ dạng /kien-thuc/....html (vẫn đi /api/chuyen-huong như trước).
 */
const MD_PATH = /^\/(|dich-vu\/[^/.]+|tin-tuc\/[^/.]+|hang-gui-duoc(\/[^/.]+)?|kien-thuc(\/[^/.]+)?|gioi-thieu|thoi-gian-giao-thuc-te)$/;

/** Đúng các tiền tố web cũ ở matcher gốc — chỉ những đường này mới đi /api/chuyen-huong. */
const WEB_CU =
  /^\/(gui-hang-di-.*|ui-hang-di-.*|gui-hang\/.+|nhap-hang-.*|thong-tin|thong-tin\/.*|huong-dan|huong-dan\/.*|kien-thuc\/.+\.html|kinh-nghiem|kinh-nghiem\/.*|bang-gia|bang-gia\/.*|author\/.*|index\.html|sitemap\.html|login\.html|admin\.html|lien-he\.html|page\/.+|tracking|tracking\/.*|tuyen-dung|dich-vu)$|^\/dich-vu\/[^/]+\/.+$/;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Tác tử AI xin "Accept: text/markdown" → bản Markdown của đúng trang đó (route /md).
  // Trình duyệt thường không gửi header này nên vẫn nhận trang HTML như cũ.
  if (MD_PATH.test(path)) {
    if ((request.headers.get("accept") ?? "").includes("text/markdown")) {
      const md = request.nextUrl.clone();
      md.pathname = "/md";
      md.search = "";
      md.searchParams.set("p", path);
      return NextResponse.rewrite(md);
    }
    return NextResponse.next();
  }
  if (!WEB_CU.test(path)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.searchParams.set("p", request.nextUrl.pathname);
  url.pathname = "/api/chuyen-huong";
  return NextResponse.rewrite(url);
}

export const config = {
  // Chỉ chạy trên các tiền tố của web cũ — không đụng trang mới.
  matcher: [
    // Trang có bản Markdown cho tác tử AI (xem MD_PATH).
    "/",
    "/dich-vu/:slug",
    "/tin-tuc/:slug",
    "/hang-gui-duoc",
    "/hang-gui-duoc/:tuyen",
    "/kien-thuc",
    "/kien-thuc/:cat",
    "/gioi-thieu",
    "/thoi-gian-giao-thuc-te",
    "/(gui-hang-di-.*|ui-hang-di-.*|gui-hang/.+|nhap-hang-.*|thong-tin|thong-tin/.*|huong-dan|huong-dan/.*|kien-thuc/.+\\.html|kinh-nghiem|kinh-nghiem/.*|bang-gia|bang-gia/.*|author/.*|index\\.html|sitemap\\.html|login\\.html|admin\\.html|lien-he\\.html|page/.+|tracking|tracking/.*|tuyen-dung|dich-vu)",
    "/dich-vu/:slug/:rest+",
  ],
};
