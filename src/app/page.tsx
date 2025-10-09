'use client';
import { Suspense } from 'react';
import HomeComponent from '@/components/home/HomeComponent';

function HomeComponentWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}

export default function Page() {
  return <HomeComponentWithSuspense />;
}
