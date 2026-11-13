import { PolicyView, policyMetadata } from "@/components/site/policy-page";

const SLUG = "chinh-sach-bao-mat";
export const metadata = policyMetadata(SLUG);

export default function Page() {
  return <PolicyView slug={SLUG} />;
}
