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
    select: { slug: true, title: true, excerpt: true, category: true, publishedAt: true },
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

/** Link tới slug không còn tồn tại → tìm bài đang có gần nghĩa nhất (cùng tuyến) để 301. */
export async function findSimilarSlug(slug: string): Promise<string | null> {
  const rows = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, title: true, category: true },
  });
  return bestSlugMatch(slug, rows);
}
