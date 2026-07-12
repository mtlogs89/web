"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, Check, ImagePlus, Loader2, X, AlertCircle } from "lucide-react";
import { addGalleryImages, type FormState } from "../../actions";

type Pending = {
  key: string;
  name: string;
  preview: string; // local object URL để xem trước
  url: string; // đường dẫn sau khi upload xong
  caption: string;
  status: "uploading" | "done" | "error";
  error?: string;
};

export function AddGalleryForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(addGalleryImages, null);
  const [items, setItems] = useState<Pending[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File, key: string) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi tải ảnh");
      setItems((prev) =>
        prev.map((it) => (it.key === key ? { ...it, url: data.url, status: "done" } : it))
      );
    } catch (e) {
      setItems((prev) =>
        prev.map((it) =>
          it.key === key
            ? { ...it, status: "error", error: e instanceof Error ? e.message : "Lỗi tải ảnh" }
            : it
        )
      );
    }
  }

  async function handleFiles(files: FileList) {
    const arr = Array.from(files);
    const news: Pending[] = arr.map((f, i) => ({
      key: `${Date.now()}-${i}-${f.name}`,
      name: f.name,
      preview: URL.createObjectURL(f),
      url: "",
      caption: "",
      status: "uploading",
    }));
    setItems((prev) => [...prev, ...news]);

    // Tải tối đa 3 ảnh cùng lúc để không làm quá tải server (ảnh điện thoại nặng).
    const CONCURRENCY = 3;
    let cursor = 0;
    async function worker() {
      while (cursor < arr.length) {
        const i = cursor++;
        await uploadOne(arr[i], news[i].key);
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, arr.length) }, worker));
  }

  const ready = items.filter((it) => it.status === "done");
  const uploading = items.some((it) => it.status === "uploading");

  return (
    <div className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-ink">Thêm ảnh mới (chọn nhiều ảnh cùng lúc)</h2>
      <p className="mb-4 text-sm text-ink-muted">
        Bấm chọn nhiều ảnh một lần (giữ Cmd/Ctrl hoặc Shift để chọn nhiều). Ảnh tự nén nhẹ và hiện với khung
        viền gradient như trên web. Điền chú thích cho từng ảnh (không bắt buộc), rồi bấm “Thêm tất cả”.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
      >
        <ImagePlus className="h-5 w-5" /> Chọn ảnh từ máy
      </button>

      {items.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((it) => (
            <div key={it.key} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.preview} alt="" className="h-full w-full object-cover" />
                {it.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                  </div>
                )}
                {it.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-coral-50/90 p-2 text-center text-coral-700">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-[11px] font-medium">{it.error}</span>
                  </div>
                )}
                {it.status === "done" && (
                  <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white shadow">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.key !== it.key))}
                  className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-white transition hover:bg-ink"
                  title="Bỏ ảnh này"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                value={it.caption}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((x) => (x.key === it.key ? { ...x, caption: e.target.value } : x))
                  )
                }
                placeholder="Chú thích…"
                className="w-full border-t border-slate-100 px-2.5 py-2 text-xs outline-none focus:bg-brand-50/40"
              />
            </div>
          ))}
        </div>
      )}

      <form
        action={async (fd) => {
          fd.set("items", JSON.stringify(ready.map((it) => ({ src: it.url, caption: it.caption }))));
          await formAction(fd);
          setItems([]);
        }}
        className="mt-6 flex items-center gap-4"
      >
        <button
          type="submit"
          disabled={pending || uploading || ready.length === 0}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
          {pending
            ? "Đang thêm…"
            : uploading
              ? "Đang tải ảnh lên…"
              : `Thêm tất cả (${ready.length}) vào thư viện`}
        </button>
        {state?.ok && (
          <span className="flex items-center gap-1.5 font-semibold text-brand-600">
            <Check className="h-5 w-5" /> {state.message}
          </span>
        )}
        {state && !state.ok && <span className="font-medium text-coral-600">{state.message}</span>}
      </form>
    </div>
  );
}
