import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OrderForm } from "./order-form";
import { addOrderEvent, deleteOrder } from "../../actions";

export const dynamic = "force-dynamic";

const statuses = ["Đã tiếp nhận", "Đã xuất kho", "Đang vận chuyển", "Đang giao", "Đã giao", "Sự cố"];

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { events: { orderBy: { at: "desc" } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-ink">Đơn hàng ({orders.length})</h1>

      <div className="mt-6">
        <OrderForm />
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-3xl border border-brand-50 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-brand-700">{o.trackingCode}</span>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{o.status}</span>
                </div>
                <div className="mt-1 text-sm text-ink-soft">
                  {o.senderName} → {o.receiverName} · {o.origin} → {o.destination}
                  {o.weight ? ` · ${o.weight} kg` : ""}
                </div>
              </div>
              <form action={deleteOrder}>
                <input type="hidden" name="id" value={o.id} />
                <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-coral-600 hover:bg-coral-50">Xóa đơn</button>
              </form>
            </div>

            {o.events.length > 0 && (
              <ol className="mt-4 ml-2 space-y-2 border-l-2 border-brand-100 pl-4">
                {o.events.map((e) => (
                  <li key={e.id} className="text-sm">
                    <span className="font-semibold text-ink">{e.status}</span>
                    <span className="text-ink-muted">
                      {e.location ? ` · ${e.location}` : ""} · {new Date(e.at).toLocaleString("vi-VN")}
                    </span>
                    {e.note && <span className="text-ink-soft"> — {e.note}</span>}
                  </li>
                ))}
              </ol>
            )}

            <form action={addOrderEvent} className="mt-4 flex flex-wrap items-end gap-2">
              <input type="hidden" name="orderId" value={o.id} />
              <div>
                <label className="text-xs font-medium text-ink-muted">Trạng thái mới</label>
                <select name="status" className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-brand-500">
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Vị trí</label>
                <input name="location" placeholder="VD: Sân bay TSN" className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="flex items-center gap-1 text-ink-muted">
                <MapPin className="h-4 w-4" />
              </div>
              <input name="note" placeholder="Ghi chú (tùy chọn)" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500" />
              <button className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">Thêm chặng</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
