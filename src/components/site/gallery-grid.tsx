import Image from "@/components/site/anh-nen";
import { gallery, type GalleryItem } from "@/lib/gallery";

export function GalleryGrid({
  items,
  aspect = "square",
  eager = 0,
}: {
  items?: GalleryItem[];
  aspect?: "square" | "landscape";
  /** Số ảnh đầu tải ngay (chỉ trang mà lưới nằm ở đầu màn hình, vd /thu-vien). */
  eager?: number;
}) {
  const list = items ?? gallery;
  const aspectCls = aspect === "landscape" ? "aspect-[4/3]" : "aspect-square";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {list.map((g, i) => (
        <figure
          key={g.src}
          className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-sm"
          style={{
            backgroundImage:
              "linear-gradient(#fff,#fff), linear-gradient(120deg,#ec5e5e,#f2a93c 50%,#1fb6a2)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          {/* Nền xám nhấp nháy khi ảnh chưa về — trước đây ô trắng tinh, khách tưởng web hỏng. */}
          <div className={`relative ${aspectCls} w-full overflow-hidden`}>
            <div aria-hidden className="absolute inset-0 animate-pulse bg-slate-200" />
            <Image
              src={g.src}
              alt={g.caption}
              fill
              // Ô rộng tối đa ~300px (lưới 4 cột trong khung 1280px). Khai "25vw" thì màn
              // retina rộng tải bản 1080px: /thu-vien 52 ảnh nặng 9,5MB (đo 29/10/2026).
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 25vw, 50vw"
              loading={i < eager ? "eager" : "lazy"}
              fetchPriority={i < eager ? "high" : "auto"}
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            {g.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
