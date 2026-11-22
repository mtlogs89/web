import { site } from "./site";

/**
 * Nguồn RSS của bài viết (/rss.xml). Khai ở <head> các trang để AI và trình đọc tin
 * thấy bài mới mà không phải dò sitemap (Perplexity coi trọng độ mới của nội dung).
 * Dùng trong metadata: alternates: { canonical, types: RSS_ALTERNATE }.
 */
export const RSS_PATH = "/rss.xml";

export const RSS_ALTERNATE = {
  "application/rss+xml": [{ url: `${site.url}${RSS_PATH}`, title: `${site.name} — bài mới` }],
};
