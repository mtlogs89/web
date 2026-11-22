/**
 * Đổi phần <main> của một trang HTML sang Markdown gọn cho tác tử AI (Accept: text/markdown).
 * Chỉ lo các thẻ nội dung web này dùng: tiêu đề, đoạn, danh sách, bảng, đậm/nghiêng, link,
 * ảnh (lấy chữ alt), hỏi–đáp <details>. Bỏ script/style/svg/nút/form — không phải nội dung.
 */
const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };
const giaiMa = (s: string) =>
  s
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_, k: string) => ENT[k])
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)));

export function htmlToMarkdown(html: string, base: string): string {
  let s = html;
  const m = s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (m) s = m[1];
  s = s
    .replace(/<(script|style|svg|noscript|template|form|button|select|iframe)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // hỏi–đáp: <summary> thành tiêu đề câu hỏi
    .replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, (_, t: string) => `\n\n#### ${t.replace(/<[^>]+>/g, "").trim()}\n\n`)
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_, t: string) => `\n\n# ${t}\n\n`)
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, t: string) => `\n\n## ${t}\n\n`)
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, t: string) => `\n\n### ${t}\n\n`)
    .replace(/<h[4-6]\b[^>]*>([\s\S]*?)<\/h[4-6]>/gi, (_, t: string) => `\n\n#### ${t}\n\n`)
    // bảng: mỗi hàng một dòng "| ô | ô |", thêm dòng kẻ sau hàng tiêu đề
    .replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_, row: string) => {
      const cells = [...row.matchAll(/<(t[hd])\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)];
      const line = "| " + cells.map((c) => c[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).join(" | ") + " |";
      const head = cells.length > 0 && cells.every((c) => c[1].toLowerCase() === "th");
      return `\n${line}${head ? "\n|" + cells.map(() => " --- |").join("") : ""}`;
    })
    .replace(/<\/table>/gi, "\n\n")
    .replace(/<caption\b[\s\S]*?<\/caption>/gi, "")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/(ul|ol)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|figure|figcaption|blockquote|dl|dd|dt|details)>/gi, "\n\n")
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t: string) => (t.trim() ? `**${t.trim()}**` : ""))
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t: string) => (t.trim() ? `*${t.trim()}*` : ""))
    .replace(/<img\b[^>]*alt="([^"]+)"[^>]*>/gi, (_, alt: string) => `\n*[Ảnh: ${alt}]*\n`)
    .replace(/<a\b[^>]*href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, t: string) => {
      const chu = t.replace(/<[^>]+>/g, "").trim();
      if (!chu) return "";
      const url = href.startsWith("/") ? `${base}${href}` : href;
      return /^(https?:|tel:|mailto:)/.test(url) ? `[${chu}](${url})` : chu;
    })
    .replace(/<[^>]+>/g, "");
  s = giaiMa(s)
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n[ \t]+(?=\S)/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return s + "\n";
}
