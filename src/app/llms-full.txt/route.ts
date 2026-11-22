import { GET as llms } from "../llms.txt/route";

export const dynamic = "force-dynamic";

/**
 * llms-full.txt — bản đầy đủ cho AI (chuẩn llmstxt.org). llms.txt của Minh Thiện đã liệt kê
 * đủ toàn bộ bài và dữ kiện, nên bản full dùng chung nội dung, chỉ khác địa chỉ.
 */
export async function GET() {
  return llms();
}
