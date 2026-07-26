"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const workspaceRoutes = ["/workspace"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (workspaceRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return null;
  return children;
}
