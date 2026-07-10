import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveCategory, deleteCategory } from "../../actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [cats, counts] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.article.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  const countMap = new Map(counts.map((c) => [c.category, c._count._all]));

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-black text-ink">
        <FolderOpen className="h-6 w-6 text-brand-500" /> Chuyên mục
      </h1>
      <p className="mb-6 text-sm text-ink-muted">
        Tạo chuyên mục mới tại đây, sau đó khi viết bài chọn chuyên mục trong ô &quot;Danh mục&quot;.
      </p>

      <form action={saveCategory} className="mb-8 flex gap-3">
        <input
          name="name"
          required
          placeholder="Tên chuyên mục mới, vd: Gửi hàng đi Đài Loan"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500"
        />
        <button className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600">
          <Plus className="h-4 w-4" /> Thêm
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-50 bg-brand-50/50 text-left text-xs font-bold uppercase text-ink-muted">
              <th className="px-5 py-3">Chuyên mục</th>
              <th className="px-5 py-3">Số bài viết</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => {
              const n = countMap.get(c.name) ?? 0;
              return (
                <tr key={c.id} className="border-b border-brand-50/60 last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-ink">{c.name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{n} bài</td>
                  <td className="px-5 py-3.5 text-right">
                    {n === 0 ? (
                      <form action={deleteCategory} className="inline">
                        <input type="hidden" name="id" value={c.id} />
                        <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-coral-600 hover:bg-coral-50">
                          <Trash2 className="h-3.5 w-3.5" /> Xoá
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-ink-muted">Đang có bài viết</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {cats.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-ink-muted">
                  Chưa có chuyên mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
