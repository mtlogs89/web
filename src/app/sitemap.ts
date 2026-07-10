import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = ["", "/gui-hang", "/nhap-hang", "/thu-vien", "/tin-tuc", "/tra-cuu", "/lien-he"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const serviceRoutes = services.map((s) => ({
    url: `${site.url}/dich-vu/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
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

  return [...staticRoutes, ...serviceRoutes, ...articleRoutes];
}
