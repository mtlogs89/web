import { prisma } from "@/lib/prisma";
import { SERVICE_PAGES, getServicePageConfigs } from "@/lib/service-pages";
import { ServicePagesForm } from "./service-pages-form";

export const dynamic = "force-dynamic";

export default async function TrangDichVuPage() {
  const [configs, articles] = await Promise.all([
    getServicePageConfigs(),
    prisma.article.findMany({
      where: { published: true },
      orderBy: [{ category: "asc" }, { publishedAt: "desc" }],
      select: { id: true, slug: true, title: true, category: true },
    }),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Trang dịch vụ</h1>
        <p className="mt-1 text-ink-muted">
          Chọn bài viết nào hiện trên 6 trang <span className="font-semibold">/dich-vu/…</span> — bài
          chính nằm giữa trang và 3 bài liên quan ở cuối. Đổi ở đây là web đổi theo, không cần sửa code.
        </p>
      </div>
      <ServicePagesForm
        pages={SERVICE_PAGES.map((p) => ({ ...p }))}
        configs={configs}
        articles={articles}
      />
    </div>
  );
}
