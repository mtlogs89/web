/**
 * Bên thứ ba nói về Minh Thiện Logistics — ChatGPT từng chê "chưa có đánh giá độc lập, thông tin
 * chủ yếu từ chính website" (31/10/2026). Chủ đưa danh sách 17/11/2026; đã kiểm từng link còn sống,
 * nhắc đúng tên + MST/hotline/địa chỉ 5/5 Nguyễn Văn Vĩnh. Thêm bài mới: kiểm như vậy rồi mới thêm.
 */
export type NguonNgoai = { site: string; ten: string; title: string; url: string; date?: string };

/** Báo chí chính thống (có link thật về web). */
export const BAO_CHI: NguonNgoai[] = [
  {
    site: "baoangiang.com.vn",
    ten: "Báo An Giang",
    title: "Gửi hàng đi Mỹ từ A - Z cùng Minh Thiện Logistics: Nhanh chóng, minh bạch và tiện lợi",
    url: "https://baoangiang.com.vn/gui-hang-di-my-tu-a-z-cung-minh-thien-logistics-nhanh-chong-minh-bach-va-tien-loi-a502277.html",
    date: "2026-11-12",
  },
  {
    site: "angiangtv.vn",
    ten: "Báo và Phát thanh, Truyền hình An Giang",
    title: "Minh Thiện Logistics – Giải pháp gửi hàng đi Mỹ uy tín, an toàn và tiết kiệm chi phí",
    url: "https://angiangtv.vn/san-pham-dich-vu/minh-thien-logistics-giai-phap-gui-hang-di-my-uy-tin-an-toan-va-tiet-kiem-chi-phi/",
  },
];

/** Trang toplist theo tỉnh có liệt kê Minh Thiện Logistics (dịch vụ gửi hàng đi Mỹ). */
export const TOPLIST: NguonNgoai[] = [
  {
    "site": "hcmtoplist.com",
    "ten": "TP.HCM",
    "title": "Top 10 công ty gửi hàng đi Mỹ tại TPHCM nhanh và tiết kiệm",
    "url": "https://www.hcmtoplist.com/cong-ty-gui-hang-di-my-tai-tphcm",
    "date": "2026-11-06"
  },
  {
    "site": "hanoitoplist.com",
    "ten": "Hà Nội",
    "title": "Top 10 đơn vị gửi hàng đi Mỹ tại Hà Nội giao hàng nhanh, cước rẻ",
    "url": "https://www.hanoitoplist.com/dich-vu/don-vi-gui-hang-di-my-tai-ha-noi",
    "date": "2026-11-09"
  },
  {
    "site": "top10danang.com",
    "ten": "Đà Nẵng",
    "title": "Top 11 công ty gửi hàng đi Mỹ tại Đà Nẵng giao hàng đúng hẹn",
    "url": "https://top10danang.com/top-11-cong-ty-gui-hang-di-my-tai-da-nang-giao-hang-dung-hen/",
    "date": "2026-11-09"
  },
  {
    "site": "vinhlongtoplist.com",
    "ten": "Vĩnh Long",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Vĩnh Long nhanh chóng, giá rẻ",
    "url": "https://www.vinhlongtoplist.com/top-5-don-vi-gui-hang-di-my-tai-vinh-long-nhanh-chong-gia-re/",
    "date": "2026-11-10"
  },
  {
    "site": "haiduongtoplist.com",
    "ten": "Hải Dương",
    "title": "Top 5+ công ty gửi hàng đi Mỹ tại Hải Dương giao nhận đúng hẹn",
    "url": "https://haiduongtoplist.com/dich-vu-gui-hang-di-my-tai-hai-duong/",
    "date": "2026-11-07"
  },
  {
    "site": "angiangtoplist.com",
    "ten": "An Giang",
    "title": "Top 5 công ty gửi hàng đi Mỹ tại An Giang uy tín, giá rẻ",
    "url": "https://angiangtoplist.com/top-5-cong-ty-gui-hang-di-my-tai-an-giang-uy-tin-gia-re/",
    "date": "2026-11-06"
  },
  {
    "site": "bentretoplist.com",
    "ten": "Bến Tre",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Bến Tre nhanh chóng, an toàn",
    "url": "https://bentretoplist.com/top-5-don-vi-gui-hang-di-my-tai-ben-tre-nhanh-chong-an-toan/",
    "date": "2026-11-06"
  },
  {
    "site": "ngheantoplist.net",
    "ten": "Nghệ An",
    "title": "Top 10 đơn vị gửi hàng đi Mỹ tại Nghệ An chất lượng hàng đầu",
    "url": "https://ngheantoplist.net/dich-vu/top-10-don-vi-gui-hang-di-my-tai-nghe-an-chat-luong-hang-dau",
    "date": "2026-11-06"
  },
  {
    "site": "phuthotoplist.com",
    "ten": "Phú Thọ",
    "title": "5+ đơn vị gửi hàng đi Mỹ tại Phú Thọ chuyên nghiệp, nhanh chóng",
    "url": "https://phuthotoplist.com/5-don-vi-gui-hang-di-my-tai-phu-tho-chuyen-nghiep-nhanh-chong/",
    "date": "2026-11-07"
  },
  {
    "site": "thanhhoatoplist.com",
    "ten": "Thanh Hóa",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Thanh Hóa nhanh chóng, uy tín",
    "url": "https://www.thanhhoatoplist.com/gui-hang-di-my-tai-thanh-hoa/",
    "date": "2026-11-06"
  },
  {
    "site": "quangnamtoplist.com",
    "ten": "Quảng Nam",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Quảng Nam nhanh & tiết kiệm",
    "url": "https://quangnamtoplist.com/top-5-don-vi-gui-hang-di-my-tai-quang-nam-nhanh-tiet-kiem/",
    "date": "2026-11-06"
  },
  {
    "site": "binhduongtoplist.com",
    "ten": "Bình Dương",
    "title": "Top 5 đơn vị gửi hàng đi Mỹ tại Bình Dương hỗ trợ tận tình",
    "url": "https://www.binhduongtoplist.com/top-5-don-vi-gui-hang-di-my-tai-binh-duong-ho-tro-tan-tinh/",
    "date": "2026-11-09"
  },
  {
    "site": "quangbinhtoplist.com",
    "ten": "Quảng Bình",
    "title": "Top 5 công ty gửi hàng đi Mỹ tại Quảng Bình có cước phí hợp lý",
    "url": "https://quangbinhtoplist.com/top-5-cong-ty-gui-hang-di-my-tai-quang-binh-co-cuoc-phi-hop-ly/",
    "date": "2026-11-09"
  },
  {
    "site": "thanhpho.danang.vn",
    "ten": "Đà Nẵng (thanhpho.danang.vn)",
    "title": "Top 10 đơn vị gửi hàng đi Mỹ tại Đà Nẵng uy tín, giá cước hợp lý",
    "url": "https://thanhpho.danang.vn/gui-hang-di-my-tai-da-nang/",
    "date": "2026-11-07"
  },
  {
    "site": "huetoplist.vn",
    "ten": "Huế",
    "title": "Top 5 dịch vụ gửi hàng đi Mỹ tại Huế có quy trình rõ ràng",
    "url": "https://huetoplist.vn/top-5-dich-vu-gui-hang-di-my-tai-hue-co-quy-trinh-ro-rang/",
    "date": "2026-11-09"
  },
  {
    "site": "binhdinhtoplist.com",
    "ten": "Bình Định",
    "title": "Top 5+ công ty gửi hàng đi Mỹ tại Bình Định tiết kiệm, đúng hẹn",
    "url": "https://binhdinhtoplist.com/cong-ty-gui-hang-di-my-tai-binh-dinh/",
    "date": "2026-11-10"
  },
  {
    "site": "haiphongtoplist.com",
    "ten": "Hải Phòng",
    "title": "Top 5 đơn vị gửi hàng đi Mỹ tại Hải Phòng uy tín, giá tốt",
    "url": "https://haiphongtoplist.com/don-vi-gui-hang-di-my-tai-hai-phong/",
    "date": "2026-11-10"
  },
  {
    "site": "bacninhtoplist.com",
    "ten": "Bắc Ninh",
    "title": "Top 5+ công ty gửi hàng đi Mỹ tại Bắc Ninh an toàn, tận tình",
    "url": "https://bacninhtoplist.com/top-5-cong-ty-gui-hang-di-my-tai-bac-ninh-an-toan-tan-tinh/",
    "date": "2026-11-06"
  },
  {
    "site": "hatinhtoplist.com",
    "ten": "Hà Tĩnh",
    "title": "Top 6 công ty gửi hàng đi Mỹ tại Hà Tĩnh có dịch vụ tận tâm",
    "url": "https://www.hatinhtoplist.com/top-6-cong-ty-gui-hang-di-my-tai-ha-tinh-co-dich-vu-tan-tam/",
    "date": "2026-11-09"
  },
  {
    "site": "tiengiangtoplist.vn",
    "ten": "Tiền Giang",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Tiền Giang uy tín, giá rẻ",
    "url": "https://tiengiangtoplist.vn/top-5-don-vi-gui-hang-di-my-tai-tien-giang-uy-tin-gia-re/",
    "date": "2026-11-07"
  },
  {
    "site": "lamdongtoplist.com",
    "ten": "Lâm Đồng",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Lâm Đồng nhanh chóng, tiết kiệm",
    "url": "https://www.lamdongtoplist.com/don-vi-gui-hang-di-my-tai-lam-dong/",
    "date": "2026-11-10"
  },
  {
    "site": "ninhbinhtoplist.com",
    "ten": "Ninh Bình",
    "title": "Top 5 công ty gửi hàng đi Mỹ tại Ninh Bình hỗ trợ thủ tục tận tình",
    "url": "https://ninhbinhtoplist.com/cong-ty-gui-hang-di-my-tai-ninh-binh/",
    "date": "2026-11-09"
  },
  {
    "site": "dongthaptoplist.com",
    "ten": "Đồng Tháp",
    "title": "Top 5+ đơn vị gửi hàng đi Mỹ tại Đồng Tháp nhanh, cước phí thấp",
    "url": "https://www.dongthaptoplist.com/top-5-don-vi-gui-hang-di-my-tai-dong-thap-nhanh-cuoc-phi-thap/",
    "date": "2026-11-06"
  },
  {
    "site": "canthotoplist.com",
    "ten": "Cần Thơ",
    "title": "Top 5 đơn vị gửi hàng đi Mỹ tại Cần Thơ uy tín, nhanh chóng",
    "url": "https://canthotoplist.com/top-5-don-vi-gui-hang-di-my-tai-can-tho-uy-tin-nhanh-chong/",
    "date": "2026-11-06"
  }
];
