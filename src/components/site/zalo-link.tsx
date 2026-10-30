"use client";

import { trackConversion } from "@/lib/google-ads";

export function ZaloLink({
  href,
  className,
  children,
  conversionLabel,
  id,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  conversionLabel?: string;
  id?: string;
}) {
  return (
    <a
      id={id}
      href={href}
      className={className}
      onClick={() => conversionLabel && trackConversion(conversionLabel)}
    >
      {children}
    </a>
  );
}
