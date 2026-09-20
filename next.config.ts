import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 43 bài cũ để ảnh bìa trỏ thẳng sang Unsplash. Không khai ở đây thì next/image
    // trả 400 và bài hiện ô trống — đã dính đúng như vậy tới 20/09/2026.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    serverActions: {
      // Mặc định 1MB — file bảng giá Excel có thể lớn hơn (file NCC kèm bảng
      // mã bưu điện vài nghìn dòng). Xem /admin/bang-gia.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
