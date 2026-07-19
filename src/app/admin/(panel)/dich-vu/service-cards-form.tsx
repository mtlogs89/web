"use client";

import { useActionState } from "react";
import { Save, Check, EyeOff } from "lucide-react";
import { saveServiceCards, type FormState } from "../../actions";
import type { SystemCardAdmin } from "@/lib/service-cards";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500";

export function ServiceCardsForm({ cards }: { cards: SystemCardAdmin[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveServiceCards, null);

  return (
    <form action={formAction} className="space-y-4">
      {cards.map((c, i) => (
        <section key={c.slug} className="rounded-3xl border border-brand-50 bg-white p-5 shadow-sm">
          <input type="hidden" name="slug" value={c.slug} />
          <div className="flex items-center gap-3">
            {c.flag && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/images/flags/${c.flag}.png`} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-brand-50" />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs text-ink-muted">/dich-vu/{c.slug}</div>
            </div>
            <label className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink-soft">
              <input type="checkbox" name={`hidden_${c.slug}`} defaultChecked={c.hidden} className="h-4 w-4" />
              <EyeOff className="h-4 w-4" /> Ẩn thẻ
            </label>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="text-sm font-semibold text-ink-soft">Tên hiển thị</label>
              <input name={`title_${c.slug}`} defaultValue={c.title} className={inputCls} />
            </div>
            <div className="sm:w-24">
              <label className="text-sm font-semibold text-ink-soft">Thứ tự</label>
              <input
                name={`order_${c.slug}`}
                type="number"
                defaultValue={c.order}
                className={`${inputCls} text-center`}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-sm font-semibold text-ink-soft">Mô tả ngắn</label>
            <textarea name={`short_${c.slug}`} rows={2} defaultValue={c.short} className={inputCls} />
          </div>
        </section>
      ))}

      {state && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            state.ok ? "bg-brand-50 text-brand-700" : "bg-coral-50 text-coral-600"
          }`}
        >
          {state.ok ? <Check className="mr-1 inline h-4 w-4" /> : null}
          {state.message}
        </p>
      )}

      <div className="sticky bottom-4">
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
        >
          <Save className="h-5 w-5" /> {pending ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
