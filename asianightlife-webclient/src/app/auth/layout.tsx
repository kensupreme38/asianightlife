import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Authentication | Asia Night Life",
  "Completing sign in"
);

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
