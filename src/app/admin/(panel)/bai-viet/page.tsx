import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink">Bài viết ({articles.length})</h1>
        <Link href="/admin/bai-viet/moi" className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">
          <Plus className="h-5 w-5" /> Viết bài mới
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50/60 text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Tiêu đề</th>
              <th className="px-5 py-3 font-semibold">Danh mục</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-3">
                  <div className="font-semibold text-ink">{a.title}</div>
                  <div className="text-xs text-ink-muted">/{a.slug}</div>
                </td>
                <td className="px-5 py-3 text-ink-soft">{a.category}</td>
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
        {articles.length === 0 && <p className="px-5 py-10 text-center text-ink-muted">Chưa có bài viết.</p>}
      </div>
    </div>
  );
}
