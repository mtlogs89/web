"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save, Check, ExternalLink, Pencil } from "lucide-react";
import { saveServicePages, type FormState } from "../../actions";
import type { ServicePageConfig } from "@/lib/service-pages";

type ArticleLite = { id: string; slug: string; title: string; category: string };
type PageLite = { slug: string; country: string; destKey: string; label: string };

const selectCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium outline-none focus:border-brand-500";

/** Gom bài theo chuyên mục để danh sách 200+ bài còn tìm được. */
function grouped(articles: ArticleLite[]) {
  const map = new Map<string, ArticleLite[]>();
  for (const a of articles) {
    const list = map.get(a.category) ?? [];
    list.push(a);
    map.set(a.category, list);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "vi"));
}

function ArticleSelect({
  name,
  defaultValue,
  articles,
  onChange,
}: {
  name: string;
  defaultValue: string;
  articles: ArticleLite[];
  onChange?: (slug: string) => void;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      className={selectCls}
    >
      <option value="">— Không chọn —</option>
      {grouped(articles).map(([cat, list]) => (
        <optgroup key={cat} label={cat}>
          {list.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.title}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function PageBlock({
  page,
  config,
  articles,
}: {
  page: PageLite;
  config: ServicePageConfig;
  articles: ArticleLite[];
}) {
  // Theo dõi bài chính đang chọn để nút "Sửa nội dung" trỏ đúng bài, kể cả khi
  // vừa đổi trong ô chọn mà chưa bấm Lưu.
  const [mainSlug, setMainSlug] = useState(config.article);
  const mainArticle = articles.find((a) => a.slug === mainSlug);
  const related = [0, 1, 2].map((i) => config.related[i] ?? "");

  return (
    <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-ink">{page.label}</h2>
        <Link
          href={`/dich-vu/${page.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Xem trang <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold text-ink-soft">
          Bài chính (hiện ở giữa trang)
        </label>
        <ArticleSelect
          name={`article_${page.slug}`}
          defaultValue={config.article}
          articles={articles}
          onChange={setMainSlug}
        />
        {mainArticle ? (
          <Link
            href={`/admin/bai-viet/${mainArticle.id}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-coral-500 hover:text-coral-600"
          >
            <Pencil className="h-3.5 w-3.5" /> Sửa nội dung bài này
          </Link>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            Bài đang chọn không còn hoặc chưa đăng — trang sẽ thiếu phần nội dung giữa.
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold text-ink-soft">
          3 bài liên quan (hiện ở cuối trang)
        </label>
        <p className="text-xs text-ink-muted">
          Bài nào trùng với bài chính sẽ tự được bỏ qua để không hiện hai lần.
        </p>
        <div className="mt-2 space-y-3">
          {related.map((slug, i) => (
            <ArticleSelect
              key={i}
              name={`related_${page.slug}`}
              defaultValue={slug}
              articles={articles}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicePagesForm({
  pages,
  configs,
  articles,
}: {
  pages: PageLite[];
  configs: Record<string, ServicePageConfig>;
  articles: ArticleLite[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveServicePages,
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {pages.map((p) => (
        <PageBlock key={p.slug} page={p} config={configs[p.slug]} articles={articles} />
      ))}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-brand-50 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
        >
          <Save className="h-5 w-5" /> {pending ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        {state?.ok && (
          <span className="flex items-center gap-1.5 font-semibold text-brand-600">
            <Check className="h-5 w-5" /> {state.message}
          </span>
        )}
        {state && !state.ok && (
          <span className="font-semibold text-coral-500">{state.message}</span>
        )}
      </div>
    </form>
  );
}
