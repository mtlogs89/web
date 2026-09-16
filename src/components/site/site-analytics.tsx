"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Bộ đo hành vi khách (xem /admin): khách từ đâu tới, đọc trang nào bao lâu,
 * cuộn tới mục nào thì dừng, bấm gọi/Zalo ở nút nào.
 *
 * Nguyên tắc: KHÔNG được làm chậm hay hỏng bất cứ thứ gì của khách.
 * - Mọi thứ bọc try/catch, gửi bằng sendBeacon/keepalive, không chờ kết quả.
 * - Bắt click ở pha capture + passive, không bao giờ preventDefault → nút Gọi/Zalo,
 *   GTM, chuyển đổi Google Ads chạy y như cũ.
 * - Không lưu IP, tên, số điện thoại.
 */

type Payload = Record<string, unknown>;

function send(body: Payload) {
  try {
    const data = JSON.stringify(body);
    if (navigator.sendBeacon?.(("/api/t"), new Blob([data], { type: "application/json" }))) return;
    fetch("/api/t", { method: "POST", body: data, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
  } catch {
    // bỏ qua
  }
}

function store(kind: "session" | "local", key: string, make: () => string): string {
  try {
    const s = kind === "session" ? sessionStorage : localStorage;
    let v = s.getItem(key);
    if (!v) {
      v = make();
      s.setItem(key, v);
    }
    return v;
  } catch {
    return make();
  }
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/** Nguồn của phiên, xác định ở trang đầu tiên khách vào. */
function detectSource(): { source: string; refHost: string | null } {
  const q = new URLSearchParams(location.search);
  let refHost: string | null = null;
  try {
    refHost = document.referrer ? new URL(document.referrer).host.toLowerCase() : null;
  } catch {
    refHost = null;
  }
  const utm = (q.get("utm_source") || "").toLowerCase();
  const r = refHost || "";
  let source = "direct";
  if (q.has("gclid") || q.has("gbraid") || q.has("wbraid") || q.has("gad_source")) source = "google-ads";
  else if (utm.includes("chatgpt") || /chatgpt\.com|openai\.com/.test(r)) source = "chatgpt";
  else if (utm.includes("perplexity") || r.includes("perplexity")) source = "perplexity";
  else if (r.includes("gemini.google")) source = "gemini";
  else if (utm.includes("copilot") || /copilot\.microsoft|bing\.com/.test(r)) source = "copilot";
  else if (r.includes("claude.ai")) source = "claude";
  else if (/(^|\.)google\./.test(r)) source = "google";
  else if (utm.includes("facebook") || q.has("fbclid") || /facebook|fb\.com|messenger/.test(r)) source = "facebook";
  else if (utm.includes("zalo") || r.includes("zalo")) source = "zalo";
  else if (r.includes("coccoc")) source = "coccoc";
  else if (r && !r.endsWith("minhthienlogs.com")) source = "other";
  return { source, refHost: r && !r.endsWith("minhthienlogs.com") ? r : null };
}

export function SiteAnalytics() {
  const pathname = usePathname();

  // Bấm gì — 1 listener cho cả trang.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const el = (e.target as Element | null)?.closest?.("a,button");
        if (!el) return;
        const href = el.getAttribute("href") || "";
        let type: string | null = null;
        if (href.startsWith("tel:")) type = "call";
        else if (el.hasAttribute("data-phone")) type = "copy-phone";
        else if (href.includes("zalo.me")) type = "zalo";
        else if (/^https?:\/\//.test(href) && !href.includes(location.host)) type = "link-out";
        if (!type) return;
        const where = el.closest("[id]")?.id || "";
        const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
        send({
          k: "event",
          sid: store("session", "mt_quote_sid", uid),
          vid: (window as unknown as { __mtVisit?: string }).__mtVisit,
          path: location.pathname,
          type,
          label: (where || text || href).slice(0, 80),
        });
      } catch {
        // bỏ qua
      }
    };
    const onSubmit = (e: SubmitEvent) => {
      try {
        const f = e.target as HTMLFormElement;
        if (f.closest("[data-no-track]")) return;
        send({
          k: "event",
          sid: store("session", "mt_quote_sid", uid),
          vid: (window as unknown as { __mtVisit?: string }).__mtVisit,
          path: location.pathname,
          type: "form",
          label: (f.closest("[id]")?.id || f.getAttribute("name") || "form").slice(0, 80),
        });
      } catch {
        // bỏ qua
      }
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, []);

  // Mỗi trang: 1 lượt xem + cập nhật thời gian / độ cuộn / mục đọc tới khi rời trang.
  useEffect(() => {
    if (navigator.webdriver) return; // trình duyệt tự động (bot, test)
    let visitId: string;
    let sessionId: string;
    try {
      visitId = uid();
      sessionId = store("session", "mt_quote_sid", uid);
      const first = store("session", "mt_src", () => JSON.stringify({ ...detectSource(), landing: location.pathname }));
      const src = JSON.parse(first) as { source: string; refHost: string | null; landing: string };
      const isLanding = !sessionStorage.getItem("mt_seen");
      try {
        sessionStorage.setItem("mt_seen", "1");
      } catch {
        // bỏ qua
      }
      (window as unknown as { __mtVisit?: string }).__mtVisit = visitId;
      send({
        k: "view",
        id: visitId,
        sid: sessionId,
        vis: store("local", "mt_vid", uid),
        path: location.pathname,
        title: document.title.replace(/\s*\|\s*Minh Thiện Logistics$/, "").slice(0, 160),
        source: src.source,
        refHost: src.refHost,
        landing: isLanding,
        device: matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop",
      });
    } catch {
      return;
    }

    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    let maxScroll = 0;
    let lastSection = "";
    let sent = { d: -1, s: -1, sec: "" };

    const measure = () => {
      try {
        const doc = document.documentElement;
        const h = doc.scrollHeight - window.innerHeight;
        const pct = h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 100;
        if (pct > maxScroll) {
          maxScroll = pct;
          // Mục H2 xa nhất đã lên tới nửa trên màn hình.
          const heads = document.querySelectorAll("main h2");
          for (const hd of heads) {
            if (hd.getBoundingClientRect().top < window.innerHeight * 0.5) {
              lastSection = (hd.textContent || "").trim().slice(0, 120);
            }
          }
        }
      } catch {
        // bỏ qua
      }
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };

    const flush = () => {
      if (since) {
        visibleMs += Date.now() - since;
        since = document.visibilityState === "visible" ? Date.now() : 0;
      }
      const d = Math.min(3600, Math.round(visibleMs / 1000));
      if (d === sent.d && maxScroll === sent.s && lastSection === sent.sec) return;
      sent = { d, s: maxScroll, sec: lastSection };
      send({ k: "update", id: visitId, sid: sessionId, d, s: maxScroll, sec: lastSection || null });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else since = Date.now();
    };

    const t = setTimeout(measure, 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      flush(); // chuyển sang trang khác trong web
    };
  }, [pathname]);

  return null;
}
