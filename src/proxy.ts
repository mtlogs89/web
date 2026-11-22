import { NextResponse, type NextRequest } from "next/server";

/**
 * Link của web CMS cũ (vd /gui-hang-di-my/...-149.html, /thong-tin/..., /author/...)
 * vẫn còn trong Google và trên Facebook/Zalo cũ; trước đây đều ra 404.
 * Chuyển nội bộ sang /api/chuyen-huong — nơi dò bài mới tương ứng rồi trả 301.
 */
export function proxy(request: NextRequest) {
  // Tác tử AI xin trang chủ dạng Markdown ("Accept: text/markdown") → trả bản llms.txt
  // dạng Markdown ở /index.md. Trình duyệt thường không gửi header này nên vẫn nhận HTML.
  if (request.nextUrl.pathname === "/") {
    if ((request.headers.get("accept") ?? "").includes("text/markdown")) {
      const md = request.nextUrl.clone();
      md.pathname = "/index.md";
      return NextResponse.rewrite(md);
    }
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.searchParams.set("p", request.nextUrl.pathname);
  url.pathname = "/api/chuyen-huong";
  return NextResponse.rewrite(url);
}

export const config = {
  // Chỉ chạy trên các tiền tố của web cũ — không đụng trang mới.
  matcher: [
    "/",
    "/(gui-hang-di-.*|ui-hang-di-.*|gui-hang/.+|nhap-hang-.*|thong-tin|thong-tin/.*|huong-dan|huong-dan/.*|kien-thuc/.+\\.html|kinh-nghiem|kinh-nghiem/.*|bang-gia|bang-gia/.*|author/.*|index\\.html|sitemap\\.html|login\\.html|admin\\.html|lien-he\\.html|page/.+|tracking|tracking/.*|tuyen-dung|dich-vu)",
    "/dich-vu/:slug/:rest+",
  ],
};
