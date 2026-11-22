import { site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { EMPTY_BODY } from "@/lib/articles";
import { getServicePageConfigs } from "@/lib/service-pages";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * RSS 2.0 — 60 bài mới nhất. Bài đang nhúng vào trang dịch vụ (canonical về /dich-vu/...)
 * thì trỏ link về trang dịch vụ, để không đưa ra 2 địa chỉ cho cùng một nội dung.
 */
export async function GET() {
  let items = "";
  try {
    const [rows, cfgs] = await Promise.all([
      prisma.article.findMany({
        where: { published: true, NOT: { content: EMPTY_BODY } },
        select: { slug: true, title: true, excerpt: true, metaDescription: true, category: true, publishedAt: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
        take: 60,
      }),
      getServicePageConfigs(),
    ]);
    const nhung = new Map(Object.entries(cfgs).map(([svc, c]) => [c.article, svc]));
    items = rows
      .map((a) => {
        const svc = nhung.get(a.slug);
        const link = svc ? `${site.url}/dich-vu/${svc}` : `${site.url}/tin-tuc/${a.slug}`;
        const mo = a.excerpt || a.metaDescription || "";
        return [
          "    <item>",
          `      <title>${esc(a.title)}</title>`,
          `      <link>${link}</link>`,
          `      <guid isPermaLink="true">${link}</guid>`,
          `      <category>${esc(a.category)}</category>`,
          `      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>`,
          mo ? `      <description>${esc(mo)}</description>` : "",
          "    </item>",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n");
  } catch {
    items = "";
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Kiến thức gửi hàng quốc tế</title>
    <link>${site.url}</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Bài mới của ${esc(site.name)}: thời gian, hàng gửi được, thủ tục và kinh nghiệm gửi hàng từ Việt Nam đi Mỹ, Úc, Canada, Hàn Quốc, Nhật Bản, Châu Âu.</description>
    <language>vi-VN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=900",
    },
  });
}
