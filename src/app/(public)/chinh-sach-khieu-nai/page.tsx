import { PolicyView, policyMetadata } from "@/components/site/policy-page";

const SLUG = "chinh-sach-khieu-nai";
export const metadata = policyMetadata(SLUG);

export default function Page() {
  return <PolicyView slug={SLUG} />;
}
