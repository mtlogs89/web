"use client";

import { useActionState } from "react";
import { Save, Check } from "lucide-react";
import { saveHomeSettings, type FormState } from "../../actions";
import { ImageUpload } from "@/components/site/image-upload";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500";

type ArticleLite = { slug: string; title: string; category: string };

export function HomeForm({
  settings,
  articles,
}: {
  settings: Record<string, string>;
  articles: ArticleLite[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveHomeSettings, null);
  const featured = new Set((settings.home_featured_slugs || "").split(",").map((s) => s.trim()).filter(Boolean));

  return (
    <form action={formAction} className="space-y-8">
      {/* Ảnh Hero */}
      <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-ink">Ảnh lớn đầu trang (Hero)</h2>
        <p className="mb-4 text-sm text-ink-muted">
          Ảnh to nhất ngay khi khách vào web. Đổi theo mùa: Noel, Tết, Vu Lan… Nên dùng ảnh ngang, rõ nét.
        </p>
        <ImageUpload name="home_hero_image" defaultValue={settings.home_hero_image} />
      </section>

      {/* Chữ Hero */}
      <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-ink">Chữ trên đầu trang</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink-soft">Dòng nhãn nhỏ (badge)</label>
            <input name="home_hero_badge" defaultValue={settings.home_hero_badge} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-soft">Tiêu đề lớn</label>
            <input name="home_hero_title" defaultValue={settings.home_hero_title} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-soft">Mô tả ngắn</label>
            <textarea name="home_hero_subtitle" rows={3} defaultValue={settings.home_hero_subtitle} className={inputCls} />
          </div>
        </div>
      </section>

      {/* Bài viết nổi bật */}
      <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-ink">Bài viết nổi bật trên trang chủ</h2>
        <p className="mb-4 text-sm text-ink-muted">
          Tích chọn tối đa 3 bài để hiện ở trang chủ. Không chọn bài nào = tự lấy 3 bài mới nhất.
        </p>
        <FeaturedPicker articles={articles} initial={featured} />
      </section>

      {/* Ảnh phụ */}
      <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-ink">Ảnh phụ trang chủ</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <ImageUpload
            name="home_whyus_image"
            defaultValue={settings.home_whyus_image}
            label="Ảnh mục “Vì sao chọn Minh Thiện”"
          />
          <ImageUpload
            name="home_cta_image"
            defaultValue={settings.home_cta_image}
            label="Ảnh nền dải kêu gọi (CTA)"
          />
        </div>
      </section>

      {/* Lưu */}
      <div className="sticky bottom-4 flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
        >
          <Save className="h-5 w-5" /> {pending ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        {state?.ok && (
          <span className="flex items-center gap-1.5 font-semibold text-brand-600">
            <Check className="h-5 w-5" /> {state.message}
          </span>
        )}
        {state && !state.ok && <span className="font-medium text-coral-600">{state.message}</span>}
      </div>
    </form>
  );
}

function FeaturedPicker({ articles, initial }: { articles: ArticleLite[]; initial: Set<string> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {articles.map((a) => (
        <label
          key={a.slug}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 px-3 py-2.5 transition hover:border-brand-200 hover:bg-brand-50/40"
        >
          <input
            type="checkbox"
            name="featured"
            value={a.slug}
            defaultChecked={initial.has(a.slug)}
            className="mt-1 h-4 w-4 shrink-0 accent-brand-500"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">{a.title}</span>
            <span className="text-xs text-ink-muted">{a.category}</span>
          </span>
        </label>
      ))}
      {articles.length === 0 && <p className="text-sm text-ink-muted">Chưa có bài viết nào.</p>}
    </div>
  );
}
