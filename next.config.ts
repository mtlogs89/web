import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Mặc định 1MB — file bảng giá Excel có thể lớn hơn (file NCC kèm bảng
      // mã bưu điện vài nghìn dòng). Xem /admin/bang-gia.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
