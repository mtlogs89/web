import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminArticles({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const activeCat = cat && cat.trim() ? cat.trim() : null;

  const [articles, catCounts] = await Promise.all([
    prisma.article.findMany({
      where: activeCat ? { category: activeCat } : {},
      orderBy: { publishedAt: "desc" },
    }),
    prisma.article.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);

  const total = catCounts.reduce((s, c) => s + c._count._all, 0);
  const missingThumb = articles.filter((a) => !a.coverImage).length;
  // Chuyên mục sắp theo số bài giảm dần để mục nhiều bài lên trước.
  const cats = [...catCounts].sort((a, b) => b._count._all - a._count._all);

  const chipCls = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
      active
        ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
        : "border border-brand-100 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink">
          Bài viết ({articles.length}
          {activeCat ? `/${total}` : ""})
          {missingThumb > 0 && (
            <span className="ml-2 align-middle text-sm font-semibold text-amber-600">· {missingThumb} bài chưa có ảnh</span>
          )}
        </h1>
        <Link href="/admin/bai-viet/moi" className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">
          <Plus className="h-5 w-5" /> Viết bài mới
        </Link>
      </div>

      {/* Thanh lọc theo chuyên mục */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link href="/admin/bai-viet" className={chipCls(!activeCat)}>
          Tất cả ({total})
        </Link>
        {cats.map((c) => (
          <Link
            key={c.category}
            href={`/admin/bai-viet?cat=${encodeURIComponent(c.category)}`}
            className={chipCls(activeCat === c.category)}
          >
            {c.category} ({c._count._all})
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50/60 text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Ảnh</th>
              <th className="px-5 py-3 font-semibold">Tiêu đề</th>
              <th className="px-5 py-3 font-semibold">Danh mục</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {articles.map((a) => (
              <tr key={a.id} className={a.coverImage ? "" : "bg-amber-50/40"}>
                <td className="px-5 py-3">
                  {a.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.coverImage} alt="" className="h-12 w-16 shrink-0 rounded-lg border border-brand-50 object-cover" />
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 text-center text-[10px] font-semibold leading-tight text-amber-600">
                      Chưa<br />có ảnh
                    </div>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="font-semibold text-ink">{a.title}</div>
                  <div className="text-xs text-ink-muted">/{a.slug}</div>
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/bai-viet?cat=${encodeURIComponent(a.category)}`}
                    className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                    title={`Lọc bài chuyên mục ${a.category}`}
                  >
                    {a.category}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  {a.published ? (
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Hiển thị</span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-muted">Nháp</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/tin-tuc/${a.slug}`} target="_blank" className="rounded-lg p-2 text-ink-muted hover:bg-brand-50 hover:text-brand-600" title="Xem">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/bai-viet/${a.id}`} className="rounded-lg p-2 text-ink-muted hover:bg-brand-50 hover:text-brand-600" title="Sửa">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-coral-600 hover:bg-coral-50">Xóa</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && <p className="px-5 py-10 text-center text-ink-muted">Chưa có bài viết trong chuyên mục này.</p>}
      </div>
    </div>
  );
}
