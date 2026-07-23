/**
 * Google Ads conversion tracking utility
 *
 * Sử dụng cho cả Phone calls + Contact (Zalo, email, etc.)
 * Conversion ID cố định: AW-16640243113
 * Conversion Label thay đổi theo campaign (Đức/Úc/Hàn/Canada/UK)
 */

const CONVERSION_ACCOUNT_ID = "16640243113";

export function trackConversion(conversionLabel: string) {
  if (typeof window === "undefined") return;

  // gtag được inject bởi GTM (GTM-W9TVBQKV)
  if (!window.gtag) {
    console.warn("[trackConversion] gtag not found — GTM may not be loaded");
    return;
  }

  window.gtag("event", "conversion", {
    send_to: `AW-${CONVERSION_ACCOUNT_ID}/${conversionLabel}`,
    value: 1.0,
    currency: "VND",
  });
}
