"use client";

import { useActionState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitLead, type LeadState } from "@/app/actions";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-medium outline-none focus:border-brand-500";

export function LeadForm() {
  const [state, formAction, pending] = useActionState<LeadState, FormData>(submitLead, null);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-brand-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-500" />
        <h3 className="mt-4 text-xl font-black text-ink">Cảm ơn bạn!</h3>
        <p className="mt-2 text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-3xl border border-brand-50 bg-white p-7 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink-soft">Họ và tên *</label>
          <input name="name" required placeholder="Nguyễn Văn A" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-soft">Số điện thoại *</label>
          <input name="phone" required placeholder="09xx xxx xxx" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-soft">Tuyến gửi</label>
          <select name="route" className={inputCls}>
            <option value="">— Chọn điểm đến —</option>
            <option>Gửi đi Mỹ</option>
            <option>Gửi đi Úc</option>
            <option>Gửi đi Canada</option>
            <option>Gửi đi Châu Âu</option>
            <option>Gửi đi Nhật / Hàn</option>
            <option>Nhập hàng Trung Quốc / Thái Lan</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink-soft">Cân nặng ước tính</label>
          <input name="weight" placeholder="VD: 5 kg" className={inputCls} />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium text-ink-soft">Loại hàng / ghi chú</label>
        <textarea
          name="message"
          rows={3}
          placeholder="VD: thực phẩm khô, mỹ phẩm, hàng dễ vỡ…"
          className={inputCls}
        />
      </div>

      {state && !state.ok && (
        <p className="mt-3 text-sm font-medium text-coral-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 py-3.5 font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-600 disabled:opacity-60"
      >
        <Send className="h-5 w-5" /> {pending ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
      </button>
    </form>
  );
}
