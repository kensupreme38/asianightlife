import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "DJ Profile | Asia Night Life",
  "Create or edit your DJ profile"
);

export default function DJProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
