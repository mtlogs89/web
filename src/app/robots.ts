import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Chủ chốt 18/09/2026: MỜI TẤT CẢ bot tìm kiếm & AI vào đọc (AEO/GEO) — chỉ chặn trang quản trị và API.
 * Mỗi bot liệt kê đích danh để chắc chắn được phép (một số bot chỉ đọc nhóm mang tên nó,
 * và nhóm riêng thay thế hẳn nhóm "*", nên mỗi nhóm phải lặp lại phần chặn /admin, /api/).
 */
const AI_AND_SEARCH_BOTS = [
  // OpenAI (ChatGPT)
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  // Anthropic (Claude)
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "Claude-Web", "anthropic-ai",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // Google (Tìm kiếm, Gemini, AI Overviews)
  "Googlebot", "Google-Extended", "GoogleOther",
  // Microsoft (Bing, Copilot — ChatGPT Search cũng dùng Bing)
  "Bingbot",
  // Apple (Siri, Apple Intelligence)
  "Applebot", "Applebot-Extended",
  // Meta (Meta AI trong Facebook, Messenger, WhatsApp, Instagram)
  "meta-externalagent", "meta-externalfetcher", "FacebookBot", "facebookexternalhit",
  // Amazon (Alexa), ByteDance (TikTok), DuckDuckGo, Mistral, Cohere, You.com
  "Amazonbot", "Bytespider", "DuckAssistBot", "MistralAI-User", "cohere-ai", "YouBot",
  // Common Crawl — kho dữ liệu nhiều AI dùng chung
  "CCBot",
  // Cốc Cốc (trình duyệt/tìm kiếm phổ biến ở Việt Nam)
  "coccocbot",
];

const PRIVATE = ["/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
