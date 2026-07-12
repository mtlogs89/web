import { prisma } from "@/lib/prisma";
import { getHomeSettings } from "@/lib/settings";
import { HomeForm } from "./home-form";

export const dynamic = "force-dynamic";

export default async function GiaoDienPage() {
  const [settings, articles] = await Promise.all([
    getHomeSettings(),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, category: true },
    }),
  ]);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Giao diện trang chủ</h1>
        <p className="mt-1 text-ink-muted">
          Đổi ảnh lớn (Hero), chữ, ảnh phụ và bài viết nổi bật hiện trên trang chủ — không cần biết code.
        </p>
      </div>
      <HomeForm settings={settings} articles={articles} />
    </div>
  );
}
