import { PolicyView, policyMetadata } from "@/components/site/policy-page";

const SLUG = "dieu-khoan-su-dung";
export const metadata = policyMetadata(SLUG);

export default function Page() {
  return <PolicyView slug={SLUG} />;
}
