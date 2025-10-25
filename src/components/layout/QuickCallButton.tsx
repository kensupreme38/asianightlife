'use client';

import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const QuickCallButton = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // const phoneNumber = '6582808072'; // WhatsApp number

  // const handleWhatsApp = () => {
  //   const message = 'Hello! I would like to get more information about your services.';
  //   window.open(
  //     `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
  //     "_blank"
  //   );
  // };


  const phoneNumber = '+6582808072'; // số điện thoại

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <Button
        variant="neon"
        size="icon"
        onClick={handleCall}
        className='relative h-12 w-12 rounded-full shadow-lg transition-opacity animate-ripple'
        style={{
          animationDuration: '1s',
        }}
        aria-label="WhatsApp Now"
      >
        <Phone className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default QuickCallButton;
