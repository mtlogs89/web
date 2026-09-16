import { NextResponse, type NextRequest } from "next/server";

/**
 * Link của web CMS cũ (vd /gui-hang-di-my/...-149.html, /thong-tin/..., /author/...)
 * vẫn còn trong Google và trên Facebook/Zalo cũ; trước đây đều ra 404.
 * Chuyển nội bộ sang /api/chuyen-huong — nơi dò bài mới tương ứng rồi trả 301.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.searchParams.set("p", request.nextUrl.pathname);
  url.pathname = "/api/chuyen-huong";
  return NextResponse.rewrite(url);
}

export const config = {
  // Chỉ chạy trên các tiền tố của web cũ — không đụng trang mới.
  matcher: [
    "/(gui-hang-di-.*|ui-hang-di-.*|gui-hang/.+|nhap-hang-.*|thong-tin|thong-tin/.*|huong-dan|huong-dan/.*|kien-thuc|kien-thuc/.*|kinh-nghiem|kinh-nghiem/.*|bang-gia|bang-gia/.*|author/.*|index\\.html|sitemap\\.html|login\\.html|admin\\.html|lien-he\\.html)",
    "/dich-vu/:slug/:rest+",
  ],
};
