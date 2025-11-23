import { Metadata } from "next";
import DJProfileForm from "@/components/dj/DJProfileForm";

export const metadata: Metadata = {
  title: "Edit DJ Profile - Asia Night Life",
  description: "Edit your DJ profile",
};

export default function EditDJProfilePage() {
  return <DJProfileForm isEdit={true} />;
}

