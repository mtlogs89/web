"use client";

import { useActionState, useMemo, useState, useRef } from "react";
import { Save, Wand2 } from "lucide-react";
import { saveArticle, type FormState } from "../../actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/site/image-upload";

type ArticleData = {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags?: string;
  content?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  faqJson?: string | null;
  phone?: string | null;
  published?: boolean;
};

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500";
const labelCls = "text-sm font-medium text-ink-soft";

const fallbackCategories = [
  "Kiến thức", "Kinh nghiệm", "Hướng dẫn", "Gửi hàng đi Mỹ", "Gửi hàng đi Úc",
  "Gửi hàng đi Canada", "Gửi hàng đi Châu Âu", "Gửi hàng đi Nhật Bản", "Gửi hàng đi Hàn Quốc",
  "Nhập hàng Trung Quốc", "Bảng giá",
];

export function ArticleEditor({
  article,
  categories,
}: {
  article?: ArticleData;
  categories?: string[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveArticle, null);
  const [content, setContent] = useState(article?.content ?? "");
  const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);

  // Quét mọi ảnh trong nội dung bài để bấm 1 phát chọn làm ảnh đại diện.
  const bodyImages = useMemo(() => {
    const seen = new Set<string>();
    for (const m of content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
      const src = m[1].trim();
      if (src && !src.startsWith("data:")) seen.add(src);
    }
    return [...seen];
  }, [content]);

  const catList = categories && categories.length > 0 ? categories : fallbackCategories;
  // Bài đang sửa có chuyên mục cũ không còn trong danh sách -> vẫn hiển thị để không mất
  const currentCat = article?.category;
  const options = currentCat && !catList.includes(currentCat) ? [currentCat, ...catList] : catList;

  const handleGenerateThumbnail = async () => {
    const title = titleInputRef.current?.value;
    const category = categorySelectRef.current?.value;

    if (!title || title.trim() === "") {
      setThumbnailError("Vui lòng nhập tiêu đề bài viết trước");
      return;
    }

    setGeneratingThumbnail(true);
    setThumbnailError(null);

    try {
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Tạo thumbnail thất bại");
      }

      const data = await response.json();
      if (data.success && data.thumbnailUrl) {
        setCoverImage(data.thumbnailUrl);
        setThumbnailError(null);
      } else {
        throw new Error("Không nhận được URL ảnh");
      }
    } catch (error) {
      setThumbnailError(
        error instanceof Error ? error.message : "Lỗi tạo thumbnail (kiểm tra API key OpenAI)"
      );
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      <div className="space-y-4 rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <div>
          <label className={labelCls}>Tiêu đề *</label>
          <input ref={titleInputRef} name="title" required defaultValue={article?.title} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Đường dẫn (slug) — để trống sẽ tự tạo từ tiêu đề</label>
          <input name="slug" defaultValue={article?.slug} placeholder="vd: gui-hang-di-my" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Mô tả ngắn</label>
          <textarea name="excerpt" rows={2} defaultValue={article?.excerpt ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Nội dung *</label>
          <RichTextEditor value={content} onChange={setContent} />
          <input type="hidden" name="content" value={content} required />
        </div>
        <div>
          <label className={labelCls}>FAQ (JSON) — cho AEO/GEO</label>
          <textarea
            name="faqJson"
            rows={4}
            defaultValue={article?.faqJson ?? ""}
            placeholder='[{"q":"Câu hỏi?","a":"Trả lời."}]'
            className={`${inputCls} font-mono text-sm`}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-4 rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
          <label className="flex items-center gap-2 font-semibold text-ink">
            <input type="checkbox" name="published" defaultChecked={article?.published ?? true} className="h-4 w-4" />
            Hiển thị công khai
          </label>
          <div>
            <label className={labelCls}>Danh mục</label>
            <select ref={categorySelectRef} name="category" defaultValue={article?.category ?? "Kiến thức"} className={inputCls}>
              {options.map((c) => <option key={c}>{c}</option>)}
            </select>
            <p className="mt-1 text-xs text-ink-muted">
              Cần chuyên mục mới? Tạo trong mục <a href="/admin/chuyen-muc" className="font-semibold text-brand-600">Chuyên mục</a>.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className={labelCls}>Ảnh đại diện bài viết</label>
              <button
                type="button"
                onClick={handleGenerateThumbnail}
                disabled={generatingThumbnail}
                className="flex items-center gap-1.5 rounded-lg bg-brand-100 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-200 disabled:opacity-60 transition"
              >
                <Wand2 className="h-4 w-4" />
                {generatingThumbnail ? "Đang vẽ…" : "Tạo ảnh AI"}
              </button>
            </div>
            {thumbnailError && (
              <p className="mb-2 text-sm text-coral-600">{thumbnailError}</p>
            )}
            <ImageUpload
              name="coverImage"
              defaultValue={coverImage}
              label=""
              hint="Ảnh hiện ở đầu bài và khi chia sẻ link. Đổi theo mùa Noel/Tết/Vu Lan tùy ý."
              suggestions={bodyImages}
            />
          </div>
          <div>
            <label className={labelCls}>Tags (phân cách dấu phẩy)</label>
            <input name="tags" defaultValue={article?.tags ?? ""} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Điện thoại (để trống sẽ lấy hotline mặc định)</label>
            <input
              name="phone"
              defaultValue={article?.phone ?? ""}
              placeholder="vd: 0964369789"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-ink-muted">
              Nút Gọi điện / Zalo trên bài này sẽ dùng số này thay cho hotline chung.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
          <div className="font-semibold text-ink">SEO</div>
          <div>
            <label className={labelCls}>Meta title</label>
            <input name="metaTitle" defaultValue={article?.metaTitle ?? ""} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Meta description</label>
            <textarea name="metaDescription" rows={3} defaultValue={article?.metaDescription ?? ""} className={inputCls} />
          </div>
        </div>

        {state && !state.ok && (
          <p className="rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
        >
          <Save className="h-5 w-5" /> {pending ? "Đang lưu…" : "Lưu bài viết"}
        </button>
      </div>
    </form>
  );
}
