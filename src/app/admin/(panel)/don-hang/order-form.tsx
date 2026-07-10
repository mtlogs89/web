"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { saveOrder, type FormState } from "../../actions";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500";
const labelCls = "text-sm font-medium text-ink-soft";
const statuses = ["Đã tiếp nhận", "Đã xuất kho", "Đang vận chuyển", "Đang giao", "Đã giao", "Sự cố"];

export function OrderForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveOrder, null);
  return (
    <form action={formAction} className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
      <h2 className="font-black text-ink">Tạo đơn hàng mới</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={labelCls}>Mã vận đơn *</label>
          <input name="trackingCode" required placeholder="VD: MT2026XXXX" className={`${inputCls} uppercase`} />
        </div>
        <div>
          <label className={labelCls}>Người gửi *</label>
          <input name="senderName" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Người nhận *</label>
          <input name="receiverName" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Điểm đi</label>
          <input name="origin" defaultValue="Việt Nam" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Điểm đến *</label>
          <input name="destination" required placeholder="VD: Mỹ (California)" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Cân nặng (kg)</label>
          <input name="weight" type="number" step="0.1" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Trạng thái</label>
          <select name="status" className={inputCls}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Ghi chú</label>
          <input name="note" className={inputCls} />
        </div>
      </div>
      {state && !state.ok && (
        <p className="mt-3 rounded-xl bg-coral-50 px-4 py-2.5 text-sm font-medium text-coral-600">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-60"
      >
        <Plus className="h-5 w-5" /> {pending ? "Đang tạo…" : "Tạo đơn"}
      </button>
    </form>
  );
}
