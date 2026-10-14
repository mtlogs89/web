<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Web Minh Thiện — những thứ dễ làm sai

Cập nhật 14/10/2026. Đọc trước khi đụng vào robot đăng bài hoặc nội dung bài viết.

## Robot đăng bài SEO KHÔNG còn chạy trên GitHub Actions

Từ 14/10/2026 chạy bằng cron trên VPS `root@222.255.214.188`:

- Code: `/var/www/robot-seo/robot_vps.py` (repo nguồn `~/minhthien-seo`, file `robot_vps.py`)
- Lịch: `0 8,14,20 * * *` — nhật ký `/var/log/robot-seo.log`
- Khoá: `/etc/robot-seo.env` (chmod 600)
- Tiến độ thật nằm ở `/var/www/robot-seo/progress.txt`, **không phải** file trong git

Lịch trong `.github/workflows/auto_post.yml` đã gỡ có chủ ý (repo riêng tư nên GitHub
tính phút Actions rồi bỏ dần lượt chạy). **Đừng bật lại** — hai bên cùng chạy sẽ đăng trùng.

## Bẫy kỹ thuật

- **Cloudflare trả 403 cho request không có `User-Agent`.** Mọi script gọi API của web
  phải khai UA, cả `/api/upload` lẫn `/api/articles`.
- Đăng bài: `POST /api/articles` với header `x-api-key: $ARTICLE_API_KEY`. Upload ảnh:
  `POST /api/upload` (field `file`), cùng khoá đó.
- **Ảnh bìa để API tự vẽ** bằng `gpt-image-2` (trả base64). `dall-e-3` đã bị OpenAI gỡ —
  code cũ gọi nó luôn rơi vào except và lặng lẽ dùng ảnh kho, nên 219 bài cũ chỉ xoay vòng
  57 tấm ảnh.
- **metaTitle KHÔNG kèm "| Minh Thiện Logistics"** — mẫu tiêu đề của web đã tự nối, kèm
  vào là thẻ `<title>` lặp tên công ty hai lần. (25 bài cũ còn dính, chưa dọn.)
- Khối link nội bộ cuối bài có dấu mốc `<!--link-noi-bo-->…<!--/link-noi-bo-->`.
  Có dấu này rồi thì **đừng chèn thêm**. Script: `~/minhthien-seo/va_link_noi_bo.py`.
- Gắn `faqJsonLd(...)` thì **bắt buộc** phải có khối hỏi–đáp hiện ra trên trang.
  Đã vi phạm 3 lần, Search Console báo lỗi.
- Đổi bảng trong `prisma/dev.db` của web: dùng `ALTER` trực tiếp, không `prisma db push`.

## Quy tắc nội dung chủ đặt

- **Không ghi số tiền trong bài.** Ô giá trong bảng ghi "Liên hệ Hotline 0589.77.89.89".
- **Không nêu tên đại lý tư nhân khác.** Chỉ được nhắc DHL/FedEx/UPS/bưu điện.
- Địa chỉ là **5/5 Nguyễn Văn Vĩnh, P. Tân Sơn Nhất, TP.HCM**. Không còn Quận Tân Bình.
  Không đưa địa chỉ đăng ký kinh doanh (41 An Phú Đông 1) lên web.
- **Không bao giờ xoá bài** trên minhthienlogs.com — chỉ thêm hoặc sửa.
- Không hiện tên nhà cung cấp vận chuyển ở bất kỳ đâu khách thấy được.
