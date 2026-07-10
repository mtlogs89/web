import Link from "next/link";
import { Newspaper, Inbox, Package, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [articles, published, leadsNew, orders, recentLeads] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.lead.count({ where: { status: "Mới" } }),
    prisma.order.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Bài viết", value: `${published}/${articles}`, sub: "đang hiển thị / tổng", icon: Newspaper, href: "/admin/bai-viet", color: "text-brand-600 bg-brand-50" },
    { label: "Yêu cầu báo giá mới", value: leadsNew, sub: "cần xử lý", icon: Inbox, href: "/admin/lead", color: "text-coral-500 bg-coral-50" },
    { label: "Đơn hàng", value: orders, sub: "tổng đơn", icon: Package, href: "/admin/don-hang", color: "text-sun-500 bg-sun-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink">Tổng quan</h1>
        <Link href="/admin/bai-viet/moi" className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">
          <Plus className="h-5 w-5" /> Viết bài mới
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm transition hover:shadow-lg">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.color}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <div className="mt-4 text-3xl font-black text-ink">{c.value}</div>
            <div className="text-sm text-ink-muted">{c.label} · {c.sub}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <h2 className="font-black text-ink">Yêu cầu báo giá gần đây</h2>
        {recentLeads.length === 0 ? (
          <p className="mt-3 text-ink-muted">Chưa có yêu cầu nào.</p>
        ) : (
          <ul className="mt-4 divide-y divide-brand-50">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-semibold text-ink">{l.name}</span>{" "}
                  <span className="text-ink-muted">· {l.phone}</span>
                  {l.route && <span className="text-ink-muted"> · {l.route}</span>}
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{l.status}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/lead" className="mt-4 inline-block text-sm font-semibold text-brand-600">Xem tất cả →</Link>
      </div>
    </div>
  );
}
