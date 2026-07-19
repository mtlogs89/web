"use client";

import { useActionState } from "react";
import { Save, Check, Plus, Trash2 } from "lucide-react";
import { saveCustomCards, type FormState } from "../../actions";
import type { CustomCard } from "@/lib/service-cards";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500";
const labelCls = "text-sm font-semibold text-ink-soft";

type ArticleLite = { slug: string; title: string };
type Dest = { key: string; label: string };

function CardFields({
  prefix,
  card,
  articles,
  dests,
}: {
  prefix: string;
  card?: CustomCard;
  articles: ArticleLite[];
  dests: Dest[];
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label className={labelCls}>Tên nước *</label>
          <input
            name={`${prefix}country`}
            defaultValue={card?.country ?? ""}
            placeholder="VD: Đài Loan"
            className={inputCls}
          />
        </div>
        <div className="sm:w-24">
          <label className={labelCls}>Cờ (emoji)</label>
          <input
            name={`${prefix}emoji`}
            defaultValue={card?.emoji ?? ""}
            placeholder="🇹🇼"
            className={`${inputCls} text-center text-xl`}
          />
        </div>
        <div className="sm:w-20">
          <label className={labelCls}>Thứ tự</label>
          <input
            name={`${prefix}order`}
            type="number"
            defaultValue={card?.order ?? 100}
            className={`${inputCls} text-center`}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Mô tả trên thẻ</label>
        <textarea
          name={`${prefix}short`}
          rows={2}
          defaultValue={card?.short ?? ""}
          placeholder="VD: Đài Bắc, Cao Hùng… Gửi đồ ăn, thuốc cho du học sinh, lao động."
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Mô tả đầu trang chi tiết</label>
        <textarea
          name={`${prefix}intro`}
          rows={2}
          defaultValue={card?.intro ?? ""}
          placeholder="Dòng giới thiệu hiện ở đầu trang chi tiết."
          className={inputCls}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Bài viết nhúng vào trang</label>
          <select name={`${prefix}article`} defaultValue={card?.articleSlug ?? ""} className={inputCls}>
            <option value="">— Không nhúng bài —</option>
            {articles.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Nước cho công cụ tính cước</label>
          <select name={`${prefix}dest`} defaultValue={card?.destKey ?? "khac"} className={inputCls}>
            {dests.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function CustomCardsForm({
  cards,
  articles,
  dests,
}: {
  cards: CustomCard[];
  articles: ArticleLite[];
  dests: Dest[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveCustomCards, null);

  return (
    <form action={formAction} className="space-y-4">
      {cards.map((c) => (
        <section key={c.slug} className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm">
          <input type="hidden" name="ccard" value={c.slug} />
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xl">{c.emoji || "🌍"}</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                <input type="checkbox" name={`hidden_${c.slug}`} defaultChecked={c.hidden} className="h-4 w-4" /> Ẩn
              </label>
              <label className="flex items-center gap-1.5 text-sm font-medium text-coral-600">
                <input type="checkbox" name={`remove_${c.slug}`} className="h-4 w-4" />
                <Trash2 className="h-4 w-4" /> Xoá thẻ
              </label>
            </div>
          </div>
          <CardFields prefix={`${c.slug}__`} card={c} articles={articles} dests={dests} />
        </section>
      ))}

      {/* Thẻ mới */}
      <section className="rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-5">
        <div className="mb-3 flex items-center gap-2 font-black text-brand-700">
          <Plus className="h-5 w-5" /> Thêm thẻ nước mới
        </div>
        <CardFields prefix="new_" articles={articles} dests={dests} />
      </section>

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
          <Save className="h-5 w-5" /> {pending ? "Đang lưu…" : "Lưu thẻ dịch vụ"}
        </button>
      </div>
    </form>
  );
}
