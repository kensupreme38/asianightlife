'use client';

import { Suspense } from "react";
import DJClient from "@/components/dj/DJClient";
import Loading from "../loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DJClient />
    </Suspense>
  );
}