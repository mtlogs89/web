import { prisma } from "./prisma";
import { bestSlugMatch, overlap, slugTokens } from "./legacy-urls";

/** Thân bài trống do robot đăng lỗi — không đưa vào sitemap / llms.txt / bài liên quan. */
export const EMPTY_BODY = "<p></p>";

export type FaqItem = { q: string; a: string };

export function parseFaq(faqJson: string | null): FaqItem[] {
  if (!faqJson) return [];
  try {
    const parsed = JSON.parse(faqJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getPublishedArticles(opts?: {
  category?: string;
  take?: number;
  skip?: number;
}) {
  return prisma.article.findMany({
    where: { published: true, ...(opts?.category ? { category: opts.category } : {}) },
    orderBy: { publishedAt: "desc" },
    take: opts?.take,
    skip: opts?.skip,
  });
}

export async function countPublishedArticles(category?: string) {
  return prisma.article.count({
    where: { published: true, ...(category ? { category } : {}) },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

export async function getCategories() {
  const rows = await prisma.article.groupBy({
    by: ["category"],
    where: { published: true },
    _count: { _all: true },
  });
  return rows.map((r) => ({ name: r.category, count: r._count._all }));
}

/**
 * Bài liên quan: ưu tiên cùng chuyên mục, xếp theo số từ khoá trùng trong slug.
 * Thiếu thì bù bằng bài "Kiến thức" gần nghĩa. Không kéo cột content (nặng).
 */
export async function getRelatedArticles(
  article: { id: string; slug: string; category: string },
  take = 6
) {
  const rows = await prisma.article.findMany({
    where: {
      published: true,
      id: { not: article.id },
      category: { in: [article.category, "Kiến thức"] },
      NOT: { content: EMPTY_BODY },
    },
    select: { slug: true, title: true, excerpt: true, metaDescription: true, coverImage: true, category: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
  });
  const mine = slugTokens(article.slug);
  return rows
    .map((r) => ({ r, score: overlap(mine, slugTokens(r.slug)) + (r.category === article.category ? 10 : 0) }))
    .filter((x) => x.r.category === article.category || x.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map((x) => x.r);
}

/**
 * Bài cùng chuyên mục đăng NGAY TRƯỚC và NGAY SAU bài này (theo ngày đăng).
 * "Bài liên quan" chọn theo độ trùng từ khoá nên bài giống nhiều bài được link mãi, bài khác
 * không ai trỏ tới (đo 16/11/2026: 52 bài 0 link vào, 188 bài ≤2). Khối này nối các bài thành
 * chuỗi nên BÀI NÀO cũng có ít nhất 2 bài khác trỏ vào — Google lần theo được hết.
 */
export async function getNeighborArticles(
  article: { id: string; category: string; publishedAt: Date },
  each = 2,
) {
  const base = { published: true, category: article.category, id: { not: article.id }, NOT: { content: EMPTY_BODY } };
  const select = { slug: true, title: true } as const;
  const [older, newer] = await Promise.all([
    prisma.article.findMany({ where: { ...base, publishedAt: { lt: article.publishedAt } }, orderBy: { publishedAt: "desc" }, take: each, select }),
    prisma.article.findMany({ where: { ...base, publishedAt: { gt: article.publishedAt } }, orderBy: { publishedAt: "asc" }, take: each, select }),
  ]);
  return { older, newer };
}

/** Toàn bộ tiêu đề bài của 1 chuyên mục (nhẹ, chỉ slug + title) cho danh sách trên trang chuyên mục. */
export async function getCategoryTitles(category: string) {
  return prisma.article.findMany({
    where: { published: true, category, NOT: { content: EMPTY_BODY } },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true },
  });
}

/**
 * Bài đã gộp vào bài khác (ẩn, không xoá): SiteSetting "article_redirects" = {"slug-cũ": "slug-chính"}.
 * Ghi bởi script gộp bài — xem scripts/sua-noi-dung-20260916.py.
 */
export async function getArticleRedirect(slug: string): Promise<string | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key: "article_redirects" } });
  if (!row) return null;
  try {
    const map = JSON.parse(row.value) as Record<string, string>;
    return typeof map[slug] === "string" ? map[slug] : null;
  } catch {
    return null;
  }
}

/** Link tới slug không còn tồn tại → tìm bài đang có gần nghĩa nhất (cùng tuyến) để 301. */
export async function findSimilarSlug(slug: string): Promise<string | null> {
  const rows = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, title: true, category: true },
  });
  return bestSlugMatch(slug, rows);
}

/**
 * Tóm tắt ngắn cho THẺ bài (lưới "Bài viết liên quan", danh sách tin tức).
 *
 * Ô `excerpt` là bản tóm tắt đầu bài chủ duyệt 17/09/2026, có đủ nhãn "Thời gian: …" và
 * "Giá: …". Ở đầu bài thì đúng, nhưng trên thẻ thì mọi bài cùng tuyến có thời gian và giá
 * y hệt nhau ⇒ 6 thẻ đọc như một. Thẻ chỉ lấy câu đầu — câu nói riêng về mặt hàng của bài
 * đó — và bỏ phần nhãn. Ngắn quá thì lấy mô tả SEO thay, vì nó viết riêng cho từng bài.
 */
export function tomTatThe(excerpt?: string | null, metaDescription?: string | null): string {
  const cat = (excerpt ?? "").split(/\s(?=Thời gian:|Giá:|Nội dung bài:)/)[0].trim();
  const meta = (metaDescription ?? "").trim();
  // Bài tổng quan có câu đầu dùng chung cho cả tuyến — dùng mô tả SEO cho thẻ đỡ trùng.
  const dungChung = /lấy hàng tận nơi, đóng gói miễn phí/.test(cat);
  if (cat.length >= 40 && !(dungChung && meta)) return cat;
  return meta || cat;
}
