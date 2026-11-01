import type { NextConfig } from "next";
import landingMatHang from "./src/data/landing-mat-hang.json";

const nextConfig: NextConfig = {
  // Trên Desktop còn một bản web cũ (~/Desktop/minhthien-web, 9/7/2026) và một
  // package-lock.json lạc ở ~/Desktop. Không ghim gốc thì Turbopack lấy cả Desktop
  // làm workspace root và next dev biên dịch nhầm sang bản cũ đó.
  turbopack: { root: import.meta.dirname },
  images: {
    // 43 bài cũ để ảnh bìa trỏ thẳng sang Unsplash. Không khai ở đây thì next/image
    // trả 400 và bài hiện ô trống — đã dính đúng như vậy tới 20/09/2026.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // Landing tĩnh ở public/van-chuyen-hang-di-my/index.html. Next không tự phục vụ
  // index.html của thư mục trong public, nên phải trỏ đường dẫn gọn vào file đó.
  // Các landing "gửi <mặt hàng> đi Mỹ" sinh bằng scripts/tao-landing-mat-hang.py.
  async rewrites() {
    return ["van-chuyen-hang-di-my", ...landingMatHang].map((slug) => ({
      source: `/${slug}`,
      destination: `/${slug}/index.html`,
    }));
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
