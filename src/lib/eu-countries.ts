// 27 quốc gia EU — dùng cho lưới "Gửi hàng đi Châu Âu"
export type EuCountry = {
  slug: string; // slug bài viết: gui-hang-di-<key>
  nameVi: string;
  flag: string; // emoji cờ
};

export const EU_COUNTRIES: EuCountry[] = [
  { slug: "gui-hang-di-austria", nameVi: "Áo", flag: "🇦🇹" },
  { slug: "gui-hang-di-belgium", nameVi: "Bỉ", flag: "🇧🇪" },
  { slug: "gui-hang-di-bulgaria", nameVi: "Bulgaria", flag: "🇧🇬" },
  { slug: "gui-hang-di-croatia", nameVi: "Croatia", flag: "🇭🇷" },
  { slug: "gui-hang-di-cyprus", nameVi: "Síp", flag: "🇨🇾" },
  { slug: "gui-hang-di-czech-republic", nameVi: "Séc", flag: "🇨🇿" },
  { slug: "gui-hang-di-denmark", nameVi: "Đan Mạch", flag: "🇩🇰" },
  { slug: "gui-hang-di-estonia", nameVi: "Estonia", flag: "🇪🇪" },
  { slug: "gui-hang-di-finland", nameVi: "Phần Lan", flag: "🇫🇮" },
  { slug: "gui-hang-di-france", nameVi: "Pháp", flag: "🇫🇷" },
  { slug: "gui-hang-di-germany", nameVi: "Đức", flag: "🇩🇪" },
  { slug: "gui-hang-di-greece", nameVi: "Hy Lạp", flag: "🇬🇷" },
  { slug: "gui-hang-di-hungary", nameVi: "Hungary", flag: "🇭🇺" },
  { slug: "gui-hang-di-ireland", nameVi: "Ireland", flag: "🇮🇪" },
  { slug: "gui-hang-di-italy", nameVi: "Ý", flag: "🇮🇹" },
  { slug: "gui-hang-di-latvia", nameVi: "Latvia", flag: "🇱🇻" },
  { slug: "gui-hang-di-lithuania", nameVi: "Litva", flag: "🇱🇹" },
  { slug: "gui-hang-di-luxembourg", nameVi: "Luxembourg", flag: "🇱🇺" },
  { slug: "gui-hang-di-malta", nameVi: "Malta", flag: "🇲🇹" },
  { slug: "gui-hang-di-netherlands", nameVi: "Hà Lan", flag: "🇳🇱" },
  { slug: "gui-hang-di-poland", nameVi: "Ba Lan", flag: "🇵🇱" },
  { slug: "gui-hang-di-portugal", nameVi: "Bồ Đào Nha", flag: "🇵🇹" },
  { slug: "gui-hang-di-romania", nameVi: "Romania", flag: "🇷🇴" },
  { slug: "gui-hang-di-slovakia", nameVi: "Slovakia", flag: "🇸🇰" },
  { slug: "gui-hang-di-slovenia", nameVi: "Slovenia", flag: "🇸🇮" },
  { slug: "gui-hang-di-spain", nameVi: "Tây Ban Nha", flag: "🇪🇸" },
  { slug: "gui-hang-di-sweden", nameVi: "Thụy Điển", flag: "🇸🇪" },
];

export const EU_CATEGORY = "Gửi hàng đi Châu Âu";

// Các điểm đến chính hiển thị trên đầu trang tin tức
export const DESTINATIONS: { category: string; label: string; flagImg: string }[] = [
  { category: "Gửi hàng đi Mỹ", label: "Mỹ", flagImg: "/images/flags/us.png" },
  { category: "Gửi hàng đi Châu Âu", label: "Châu Âu", flagImg: "/images/flags/eu.png" },
  { category: "Gửi hàng đi Úc", label: "Úc", flagImg: "/images/flags/au.png" },
  { category: "Gửi hàng đi Canada", label: "Canada", flagImg: "/images/flags/ca.png" },
  { category: "Gửi hàng đi Nhật Bản", label: "Nhật Bản", flagImg: "/images/flags/jp.png" },
  { category: "Gửi hàng đi Hàn Quốc", label: "Hàn Quốc", flagImg: "/images/flags/kr.png" },
];
