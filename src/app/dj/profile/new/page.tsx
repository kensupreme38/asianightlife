import { Metadata } from "next";
import DJProfileForm from "@/components/dj/DJProfileForm";

export const metadata: Metadata = {
  title: "Create DJ Profile - Asia Night Life",
  description: "Create your DJ profile and start receiving votes",
};

export default function NewDJProfilePage() {
  return <DJProfileForm />;
}

