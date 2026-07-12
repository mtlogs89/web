import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { gallery } from "@/lib/gallery";
import { deleteGalleryImage, moveGalleryImage } from "../../actions";
import { AddGalleryForm } from "./add-form";

export const dynamic = "force-dynamic";

export default async function AdminGallery() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sort: "asc" }, { createdAt: "asc" }],
  });
  const usingDefault = images.length === 0;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Thư viện hàng thật</h1>
        <p className="mt-1 text-ink-muted">
          Ảnh hiện ở trang{" "}
          <a href="/thu-vien" target="_blank" className="font-semibold text-brand-600 hover:underline">
            /thu-vien
          </a>{" "}
          và mục thư viện trên trang chủ — tự động giữ khung viền gradient classy.
        </p>
      </div>

      <AddGalleryForm />

      {usingDefault && (
        <div className="mt-6 rounded-2xl border border-sun-200 bg-sun-50 px-5 py-4 text-sm text-ink-soft">
          Hiện đang hiển thị <strong>{gallery.length} ảnh mẫu</strong> có sẵn. Khi bạn thêm ảnh đầu tiên,
          thư viện sẽ chuyển sang dùng ảnh bạn tự quản lý.
        </div>
      )}

      <h2 className="mb-4 mt-8 text-lg font-black text-ink">
        Ảnh trong thư viện ({usingDefault ? gallery.length : images.length})
      </h2>

      {usingDefault ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {gallery.map((g) => (
            <figure key={g.src} className="overflow-hidden rounded-2xl border border-brand-50 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.caption} className="aspect-square w-full object-cover" />
              <figcaption className="p-2 text-xs text-ink-muted">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((g, i) => (
            <div key={g.id} className="overflow-hidden rounded-2xl border border-brand-50 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.caption} className="aspect-square w-full object-cover" />
              <div className="p-3">
                <p className="min-h-[2.5rem] text-sm text-ink-soft">{g.caption || <span className="text-ink-muted">(chưa có chú thích)</span>}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <form action={moveGalleryImage}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button
                        disabled={i === 0}
                        className="rounded-lg p-2 text-ink-muted hover:bg-brand-50 hover:text-brand-600 disabled:opacity-30"
                        title="Lên trước"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={moveGalleryImage}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button
                        disabled={i === images.length - 1}
                        className="rounded-lg p-2 text-ink-muted hover:bg-brand-50 hover:text-brand-600 disabled:opacity-30"
                        title="Xuống sau"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                  <form action={deleteGalleryImage}>
                    <input type="hidden" name="id" value={g.id} />
                    <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-coral-600 hover:bg-coral-50">
                      <Trash2 className="h-3.5 w-3.5" /> Xóa
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
