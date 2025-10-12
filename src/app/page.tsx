import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';
import Loading from './loading';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeClient />
    </Suspense>
  );
}
