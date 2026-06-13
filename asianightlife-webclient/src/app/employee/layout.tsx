import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Employee Portal | Asia Night Life",
  "Employee profile management"
);

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
