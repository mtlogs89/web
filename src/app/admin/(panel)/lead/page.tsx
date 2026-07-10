import { prisma } from "@/lib/prisma";
import { updateLeadStatus } from "../../actions";

export const dynamic = "force-dynamic";

const statuses = ["Mới", "Đã gọi", "Đã báo giá", "Chốt đơn", "Bỏ qua"];

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-black text-ink">Yêu cầu báo giá ({leads.length})</h1>

      <div className="mt-6 space-y-3">
        {leads.length === 0 && (
          <p className="rounded-3xl border border-brand-50 bg-white p-10 text-center text-ink-muted">Chưa có yêu cầu nào.</p>
        )}
        {leads.map((l) => (
          <div key={l.id} className="rounded-3xl border border-brand-50 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-ink">{l.name}</span>
                  <a href={`tel:${l.phone}`} className="font-semibold text-brand-600">{l.phone}</a>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                  {l.route && <span>Tuyến: {l.route}</span>}
                  {l.weight && <span>Cân nặng: {l.weight}</span>}
                  {l.cargoType && <span>Loại: {l.cargoType}</span>}
                  <span className="text-ink-muted">{new Date(l.createdAt).toLocaleString("vi-VN")}</span>
                </div>
                {l.message && <p className="mt-2 rounded-xl bg-brand-50/60 px-3 py-2 text-sm text-ink-soft">{l.message}</p>}
              </div>
              <form action={updateLeadStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={l.id} />
                <select name="status" defaultValue={l.status} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-brand-500">
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">Cập nhật</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
