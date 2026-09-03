import Image from "next/image";
import { gallery, type GalleryItem } from "@/lib/gallery";

export function GalleryGrid({
  items,
  aspect = "square",
}: {
  items?: GalleryItem[];
  aspect?: "square" | "landscape";
}) {
  const list = items ?? gallery;
  const aspectCls = aspect === "landscape" ? "aspect-[4/3]" : "aspect-square";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {list.map((g) => (
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
          <div className={`relative ${aspectCls} w-full overflow-hidden`}>
            <Image
              src={g.src}
              alt={g.caption}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              loading="lazy"
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
