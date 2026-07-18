"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

/**
 * Ô chọn/tải ảnh cho trang admin.
 * Giá trị (đường dẫn ảnh) lưu vào input ẩn tên `name` để submit cùng form.
 */
export function ImageUpload({
  name,
  defaultValue = "",
  label,
  hint,
  aspect = "video",
  suggestions = [],
}: {
  name: string;
  defaultValue?: string;
  label?: string;
  hint?: string;
  aspect?: "video" | "square";
  /** Ảnh gợi ý (VD: các ảnh có sẵn trong bài) — bấm 1 phát để dùng làm ảnh đại diện. */
  suggestions?: string[];
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải ảnh thất bại");
      setUrl(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Tải ảnh thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && <label className="text-sm font-semibold text-ink-soft">{label}</label>}
      {hint && <p className="mb-1.5 text-xs text-ink-muted">{hint}</p>}

      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <div
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-brand-100 bg-brand-50/40 ${
            aspect === "square" ? "h-32 w-32" : "h-32 w-56"
          }`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-muted">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4" /> {url ? "Đổi ảnh khác" : "Chọn ảnh từ máy"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="flex items-center gap-1.5 text-xs font-medium text-coral-600 hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Bỏ ảnh
            </button>
          )}
        </div>
      </div>

      {err && <p className="mt-1.5 text-sm font-medium text-coral-600">{err}</p>}

      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-ink-muted">
            Lấy nhanh ảnh có sẵn trong bài ({suggestions.length}) — bấm để chọn làm ảnh đại diện:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setUrl(s)}
                title="Dùng ảnh này làm ảnh đại diện"
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  url === s ? "border-brand-500 ring-2 ring-brand-200" : "border-transparent hover:border-brand-300"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
