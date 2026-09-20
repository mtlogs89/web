import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { EMPTY_BODY } from "@/lib/articles";
import { TUYEN_HANG } from "@/lib/hang-tuyen";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = ["", "/gioi-thieu", "/gui-hang", "/nhap-hang", "/thu-vien", "/tin-tuc", "/tra-cuu", "/lien-he", "/hang-gui-duoc"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const hangRoutes = TUYEN_HANG.map((t) => ({
    url: `${site.url}/hang-gui-duoc/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${site.url}/dich-vu/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { published: true, NOT: { content: EMPTY_BODY } },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    articleRoutes = articles.map((a) => ({
      url: `${site.url}/tin-tuc/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB chưa sẵn sàng (vd lúc build) — bỏ qua, vẫn có route tĩnh
  }

  // Trang chuyên mục (/tin-tuc?cat=) là trang trụ cột của từng tuyến — cho Google/AI biết.
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const cats = await prisma.article.groupBy({
      by: ["category"],
      where: { published: true },
      _max: { updatedAt: true },
      _count: { _all: true },
    });
    categoryRoutes = cats
      .filter((c) => c._count._all >= 3)
      .map((c) => ({
        url: `${site.url}/tin-tuc?cat=${encodeURIComponent(c.category)}`,
        lastModified: c._max.updatedAt ?? now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // như trên
  }

  return [...staticRoutes, ...hangRoutes, ...serviceRoutes, ...categoryRoutes, ...articleRoutes];
}
