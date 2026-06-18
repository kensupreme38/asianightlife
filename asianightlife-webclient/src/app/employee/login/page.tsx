import { redirect } from "next/navigation";

/** Legacy URL — team member portal lives at /employee */
export default function EmployeeLoginRedirectPage() {
  redirect("/employee");
}
