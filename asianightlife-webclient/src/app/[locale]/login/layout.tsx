import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Login | Asia Night Life",
  "Sign in to your Asia Night Life account"
);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
