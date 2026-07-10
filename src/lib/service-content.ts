export type ServiceDetail = {
  intro: string;
  highlights: { title: string; desc: string }[];
  items: string[];
  faqs: { q: string; a: string }[];
};

export const serviceImages: Record<string, string> = {
  "gui-hang-di-my": "/images/plane.jpg",
  "gui-hang-di-uc": "/images/cargo-port.jpg",
  "gui-hang-di-canada": "/images/worker.jpg",
  "gui-hang-di-chau-au": "/images/containers.jpg",
  "gui-hang-di-nhat": "/images/delivery.jpg",
  "gui-hang-di-han": "https://images.unsplash.com/photo-1546874177-9e664107314e?w=1200&q=80",
  "nhap-hang-mua-ho": "/images/truck.jpg",
};

export const serviceContent: Record<string, ServiceDetail> = {
  "gui-hang-di-my": {
    intro:
      "Minh Thiện Logistics nhận gửi hàng đi Mỹ trọn gói: lấy hàng tận nơi, đóng gói chuẩn quốc tế, khai báo FDA và giao đến tận địa chỉ người nhận trên toàn nước Mỹ. Phù hợp gửi quà tặng, thực phẩm, thuốc và hàng kinh doanh.",
    highlights: [
      { title: "Khai báo FDA", desc: "Hỗ trợ thủ tục cho thực phẩm, mỹ phẩm để thông quan nhanh." },
      { title: "Toàn nước Mỹ", desc: "Giao tới California, Texas, New York, Florida và mọi bang." },
      { title: "3–7 ngày", desc: "Thời gian vận chuyển nhanh, theo dõi đơn 24/7." },
    ],
    items: ["Thực phẩm khô, đặc sản", "Thuốc, thực phẩm chức năng", "Quà tặng, đồ cá nhân", "Hàng kinh doanh, mẫu hàng"],
    faqs: [
      { q: "Gửi hàng đi Mỹ mất bao lâu?", a: "Thông thường 3–7 ngày tùy bang và loại dịch vụ." },
      { q: "Có gửi được thực phẩm đi Mỹ không?", a: "Có, với thực phẩm khô đóng gói đúng chuẩn và khai báo FDA hợp lệ." },
      { q: "Cước gửi hàng đi Mỹ tính thế nào?", a: "Theo trọng lượng thực hoặc quy đổi (số lớn hơn). Liên hệ 0589.77.89.89 để báo giá chính xác." },
    ],
  },
  "gui-hang-di-uc": {
    intro:
      "Dịch vụ gửi hàng đi Úc của Minh Thiện Logistics đến Sydney, Melbourne, Brisbane, Perth… Hỗ trợ thủ tục cho thực phẩm khô và đặc sản Việt, đóng gói an toàn, giao tận nhà.",
    highlights: [
      { title: "Khắp nước Úc", desc: "Sydney, Melbourne, Brisbane, Perth, Adelaide." },
      { title: "Đặc sản Việt", desc: "Hỗ trợ thủ tục cho thực phẩm khô được phép." },
      { title: "An toàn", desc: "Đóng gói chuẩn, bảo hiểm hàng hóa." },
    ],
    items: ["Thực phẩm khô, đặc sản", "Quần áo, đồ dùng cá nhân", "Quà tặng cho du học sinh", "Hàng kinh doanh"],
    faqs: [
      { q: "Gửi hàng đi Úc mất bao lâu?", a: "Khoảng 4–8 ngày tùy bang và dịch vụ." },
      { q: "Gửi thực phẩm đi Úc có bị kiểm tra không?", a: "Úc kiểm soát thực phẩm nghiêm; Minh Thiện tư vấn mặt hàng được phép và cách khai báo." },
    ],
  },
  "gui-hang-di-canada": {
    intro:
      "Gửi hàng đi Canada tới Toronto, Vancouver, Montreal, Calgary với cam kết thời gian và theo dõi đơn hàng 24/7. Phù hợp gửi quà, thực phẩm và hàng cá nhân cho người thân.",
    highlights: [
      { title: "Các thành phố lớn", desc: "Toronto, Vancouver, Montreal, Calgary." },
      { title: "Cam kết thời gian", desc: "Lịch trình rõ ràng, tracking từng chặng." },
      { title: "Tư vấn tận tâm", desc: "Hỗ trợ thủ tục, đóng gói miễn phí." },
    ],
    items: ["Thực phẩm khô", "Quà tặng, đồ cá nhân", "Hàng cho du học sinh", "Hàng kinh doanh nhỏ"],
    faqs: [
      { q: "Gửi hàng đi Canada bao lâu tới?", a: "Khoảng 5–9 ngày tùy thành phố và dịch vụ." },
    ],
  },
  "gui-hang-di-chau-au": {
    intro:
      "Minh Thiện Logistics gửi hàng đi Châu Âu — Anh, Pháp, Đức và toàn khối EU. Giải pháp cho cả cá nhân gửi quà lẫn doanh nghiệp xuất khẩu hàng mẫu, hàng thương mại.",
    highlights: [
      { title: "Toàn khối EU", desc: "Anh, Pháp, Đức, Hà Lan, Bỉ và hơn thế." },
      { title: "Cá nhân & doanh nghiệp", desc: "Linh hoạt cho mọi nhu cầu." },
      { title: "Chứng từ đầy đủ", desc: "Hỗ trợ hóa đơn, khai báo xuất khẩu." },
    ],
    items: ["Quà tặng, đồ cá nhân", "Thực phẩm khô được phép", "Hàng mẫu, hàng thương mại", "Tài liệu, chứng từ"],
    faqs: [
      { q: "Gửi hàng đi Châu Âu mất bao lâu?", a: "Khoảng 4–8 ngày tùy quốc gia." },
    ],
  },
  "gui-hang-di-nhat": {
    intro:
      "Dịch vụ gửi hàng đi Nhật Bản — Tokyo, Osaka, Nagoya, Fukuoka… Phù hợp gửi đồ ăn, thuốc và đồ dùng cá nhân cho du học sinh, người lao động và việt kiều tại Nhật. Lấy hàng tận nơi, giao tận tay.",
    highlights: [
      { title: "Khắp Nhật Bản", desc: "Tokyo, Osaka, Nagoya, Fukuoka, Sapporo." },
      { title: "Cho du học sinh", desc: "Gửi đồ ăn, thuốc, đồ dùng cá nhân." },
      { title: "Nhanh & an toàn", desc: "Theo dõi đơn, đóng gói chuẩn." },
    ],
    items: ["Đồ ăn, thực phẩm khô", "Thuốc, đồ dùng cá nhân", "Quà tặng", "Hàng kinh doanh"],
    faqs: [
      { q: "Gửi hàng đi Nhật Bản mất bao lâu?", a: "Khoảng 3–6 ngày tùy loại dịch vụ." },
      { q: "Gửi đồ ăn cho du học sinh ở Nhật được không?", a: "Được với đồ khô đóng gói kỹ; nên tránh đồ tươi và khai báo rõ ràng." },
    ],
  },
  "gui-hang-di-han": {
    intro:
      "Gửi hàng đi Hàn Quốc 3–6 ngày, giao tận nhà Seoul, Busan, Incheon, Daegu và các khu công nghiệp Ansan, Hwaseong. Chuyên thùng đồ ăn quê cho lao động EPS, du học sinh và các gia đình Việt–Hàn: lấy hàng tận nơi, đóng gói miễn phí, khai báo chuẩn — tuyệt đối không để lọt hàng cấm ảnh hưởng visa người nhận.",
    highlights: [
      { title: "Bay 3–6 ngày", desc: "Chuyến dày TP.HCM – Incheon, tracking 24/7 tới khi ký nhận." },
      { title: "Chuyên EPS & gia đình Việt–Hàn", desc: "Giao tận nhà trọ, KTX công ty ở Ansan, Hwaseong và toàn quốc." },
      { title: "Lọc hàng cấm miễn phí", desc: "Hàn phạt sản phẩm thịt tới chục triệu won — Minh Thiện kiểm từng món trước khi bay." },
    ],
    items: [
      "Đồ ăn khô: mì, phở, gia vị, cá khô, tôm khô",
      "Thuốc thông dụng, dầu gió, thực phẩm chức năng",
      "Quà gia đình, đồ cho mẹ và bé, sách tiếng Việt",
      "Quần áo, mỹ phẩm, đồ dùng cá nhân",
    ],
    faqs: [
      { q: "Gửi hàng đi Hàn Quốc mất bao lâu?", a: "3–6 ngày làm việc tuỳ thành phố: Seoul/Gyeonggi nhận sớm nhất, Busan thêm khoảng 1 ngày. Có tracking theo dõi 24/7." },
      { q: "Gửi đồ ăn cho người lao động EPS ở Ansan được không?", a: "Được — đây là tuyến quen của Minh Thiện: giao tận nhà trọ, KTX công ty. Cần địa chỉ tiếng Hàn nguyên văn và số điện thoại 010 của người nhận." },
      { q: "Vì sao không được gửi khô bò, lạp xưởng đi Hàn?", a: "Hàn cấm nghiêm mọi sản phẩm thịt (phòng dịch tả heo châu Phi), phạt tới cả chục triệu won và ảnh hưởng hồ sơ visa người nhận. Thay bằng cá khô, tôm khô, mực khô hút chân không — đi êm 100%." },
      { q: "Gửi quà Tết đi Hàn cần lưu ý gì?", a: "Tết Việt trùng Seollal Hàn — bưu vận Hàn quá tải trước lễ cả tuần. Nên gửi trước Tết 3 tuần để chắc chắn kịp giao thừa." },
      { q: "Cước gửi hàng đi Hàn tính thế nào?", a: "Theo trọng lượng thực hoặc cân quy đổi (Dài × Rộng × Cao)/5000 — lấy số lớn hơn. Chụp ảnh kiện hàng gửi Zalo 0589.77.8989, Ms Min báo giá trong 15 phút." },
    ],
  },
  "nhap-hang-mua-ho": {
    intro:
      "Dịch vụ nhập hàng và mua hộ của Minh Thiện Logistics: nhập hàng Trung Quốc, Thái Lan, Âu – Mỹ; mua hộ Taobao, 1688, Amazon. Thanh toán hộ, kiểm hàng tại kho và ship tận nơi về Việt Nam.",
    highlights: [
      { title: "Thanh toán hộ", desc: "Đặt và trả tiền hàng bằng ngoại tệ giúp bạn." },
      { title: "Kiểm hàng tại kho", desc: "Kiểm tra trước khi vận chuyển về Việt Nam." },
      { title: "Ship tận nơi", desc: "Gom hàng, vận chuyển và giao tận địa chỉ." },
    ],
    items: ["Mua hộ Taobao, 1688, Tmall", "Mua hộ Amazon, eBay", "Nhập sỉ hàng Trung Quốc", "Nhập hàng Thái Lan"],
    faqs: [
      { q: "Mua hộ Taobao tính phí thế nào?", a: "Phí mua hộ theo % giá trị đơn cộng cước vận chuyển; liên hệ 0589.77.89.89 để báo giá." },
      { q: "Nhập hàng Trung Quốc về Việt Nam mất bao lâu?", a: "Thường 5–12 ngày tùy hình thức vận chuyển (đường bộ/biển/bay)." },
    ],
  },
};
