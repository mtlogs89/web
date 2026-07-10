export const site = {
  name: "Minh Thiện Logistics",
  shortName: "Minh Thiện",
  legalName: "Công ty Minh Thiện Logistics",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://minhthienlogs.com",
  description:
    "Minh Thiện Logistics — dịch vụ vận chuyển, gửi hàng quốc tế tới hơn 200 quốc gia: Mỹ, Úc, Canada, Châu Âu, Nhật, Hàn… và nhập hàng Trung Quốc, Thái Lan. Tư vấn miễn phí, báo giá nhanh.",
  phone: "0589778989",
  phoneDisplay: "0589.77.89.89",
  contactName: "Ms Min",
  email: "info@minhthienlogs.com",
  address: {
    street: "5/5 Nguyễn Văn Vĩnh",
    ward: "Phường Tân Sơn Nhất",
    city: "TP. Hồ Chí Minh",
    country: "VN",
  },
  addressFull: "5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất, TP. Hồ Chí Minh",
  hours: "T2–CN: 8:00 – 21:00",
  geo: { lat: 10.8231, lng: 106.6297 },
  zalo: "https://zalo.me/0589778989",
  facebook: "#",
  foundingYear: 2018,
  branches: [
    {
      name: "Trụ sở TP. Hồ Chí Minh",
      address: "5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất, TP. Hồ Chí Minh",
      phones: ["0589.77.89.89"],
    },
    {
      name: "Chi nhánh Nha Trang",
      address: "45 Nguyễn Xiển, P. Bắc Nha Trang, Khánh Hòa",
      phones: ["0964.369.789"],
    },
  ],
} as const;

export const nav = [
  { label: "Trang chủ", href: "/" },
  { label: "Gửi hàng đi", href: "/gui-hang" },
  { label: "Nhập hàng", href: "/nhap-hang" },
  { label: "Thư viện", href: "/thu-vien" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Tra cứu đơn", href: "/tra-cuu" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  accent: "brand" | "coral" | "sun";
  group: "gui-hang" | "nhap-hang";
  flag?: string; // mã cờ quốc gia (us, au, ca, eu, jp, kr) — dùng ảnh cờ làm icon
};

export const services: Service[] = [
  {
    slug: "gui-hang-di-my",
    flag: "us",
    title: "Gửi hàng đi Mỹ",
    short:
      "Thực phẩm, thuốc, quà tặng, hàng kinh doanh. Khai báo FDA, giao tận nhà toàn nước Mỹ.",
    icon: "Flag",
    accent: "brand",
    group: "gui-hang",
  },
  {
    slug: "gui-hang-di-uc",
    flag: "au",
    title: "Gửi hàng đi Úc",
    short:
      "Tuyến Sydney, Melbourne, Brisbane, Perth. Hàng thực phẩm khô, đặc sản Việt được hỗ trợ thủ tục.",
    icon: "Ship",
    accent: "sun",
    group: "gui-hang",
  },
  {
    slug: "gui-hang-di-canada",
    flag: "ca",
    title: "Gửi hàng đi Canada",
    short:
      "Toronto, Vancouver, Montreal, Calgary. Cam kết thời gian, theo dõi đơn hàng 24/7.",
    icon: "Mountain",
    accent: "coral",
    group: "gui-hang",
  },
  {
    slug: "gui-hang-di-chau-au",
    flag: "eu",
    title: "Gửi hàng đi Châu Âu",
    short:
      "Anh, Pháp, Đức và toàn khối EU. Giải pháp cho cả cá nhân và doanh nghiệp xuất khẩu.",
    icon: "Castle",
    accent: "brand",
    group: "gui-hang",
  },
  {
    slug: "gui-hang-di-nhat",
    flag: "jp",
    title: "Gửi hàng đi Nhật Bản",
    short:
      "Tokyo, Osaka, Nagoya… Gửi đồ ăn, thuốc, đồ dùng cho du học sinh, người lao động, việt kiều.",
    icon: "Globe",
    accent: "sun",
    group: "gui-hang",
  },
  {
    slug: "gui-hang-di-han",
    flag: "kr",
    title: "Gửi hàng đi Hàn Quốc",
    short:
      "Seoul, Busan, Incheon… Gửi đồ ăn, thuốc, quà cho du học sinh, người lao động, việt kiều.",
    icon: "Flag",
    accent: "brand",
    group: "gui-hang",
  },
  {
    slug: "nhap-hang-mua-ho",
    title: "Nhập hàng & mua hộ",
    short:
      "Nhập hàng Trung Quốc, Thái Lan, Âu–Mỹ. Mua hộ Taobao, 1688, Amazon — thanh toán hộ, ship tận kho.",
    icon: "Warehouse",
    accent: "brand",
    group: "nhap-hang",
  },
];

export const partners = ["FedEx", "DHL", "UPS", "USPS", "Taobao", "Amazon", "1688"];
