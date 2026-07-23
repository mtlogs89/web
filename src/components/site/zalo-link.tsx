"use client";

import { trackConversion } from "@/lib/google-ads";

export function ZaloLink({
  href,
  className,
  children,
  conversionLabel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  conversionLabel?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => conversionLabel && trackConversion(conversionLabel)}
    >
      {children}
    </a>
  );
}
