import { Suspense } from "react";
import DJClient from "@/components/dj/DJClient";
import { Metadata } from "next";
import Loading from "../loading";

export const metadata: Metadata = {
  title: "DJ Voting - Asia Night Life",
  description: "Vote for your favorite DJs and see who's trending",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DJClient />
    </Suspense>
  );
}