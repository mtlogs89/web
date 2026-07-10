import { prisma } from "./prisma";

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

export async function getPublishedArticles(opts?: { category?: string; take?: number }) {
  return prisma.article.findMany({
    where: { published: true, ...(opts?.category ? { category: opts.category } : {}) },
    orderBy: { publishedAt: "desc" },
    take: opts?.take,
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
