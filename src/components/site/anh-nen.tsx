"use client";

import Image, { type ImageProps } from "next/image";
import anhLoader from "@/lib/anh-loader";

// Dùng thay next/image ở trang khách: ảnh nội bộ đi /anh-nen/... để Cloudflare tự lưu sẵn.
// Không đặt `loader: "custom"` trong next.config — làm vậy Next TẮT luôn /_next/image,
// mà /anh-nen lại nhờ chính /_next/image nén ảnh.
export default function AnhNen(props: ImageProps) {
  return <Image loader={anhLoader} {...props} />;
}
