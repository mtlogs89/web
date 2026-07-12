"use client";

import { useActionState, useRef } from "react";
import { Plus, Check } from "lucide-react";
import { addGalleryImage, type FormState } from "../../actions";
import { ImageUpload } from "@/components/site/image-upload";

export function AddGalleryForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(addGalleryImage, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
      }}
      className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-black text-ink">Thêm ảnh mới</h2>
      <p className="mb-4 text-sm text-ink-muted">
        Chọn ảnh từ máy (ảnh tự nén nhẹ) và viết chú thích ngắn. Ảnh sẽ hiện với khung viền gradient như trên web.
      </p>
      <div className="space-y-4">
        <ImageUpload name="src" label="Ảnh" aspect="square" />
        <div>
          <label className="text-sm font-semibold text-ink-soft">Chú thích (hiện khi rê chuột)</label>
          <input
            name="caption"
            placeholder="VD: Thùng hàng thực phẩm khô gửi đi Mỹ"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
          >
            <Plus className="h-5 w-5" /> {pending ? "Đang thêm…" : "Thêm vào thư viện"}
          </button>
          {state?.ok && (
            <span className="flex items-center gap-1.5 font-semibold text-brand-600">
              <Check className="h-5 w-5" /> {state.message}
            </span>
          )}
          {state && !state.ok && <span className="font-medium text-coral-600">{state.message}</span>}
        </div>
      </div>
    </form>
  );
}
