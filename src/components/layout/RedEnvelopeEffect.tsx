'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface RedEnvelope {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
  iconUrl: string;
}

// Danh sách các icon bao lì xì từ Flaticon
const ENVELOPE_ICONS = [
  'https://cdn-icons-png.flaticon.com/128/16865/16865045.png',
  'https://cdn-icons-png.flaticon.com/128/3954/3954620.png',
  'https://cdn-icons-png.flaticon.com/128/9464/9464632.png',
  'https://cdn-icons-png.flaticon.com/128/2932/2932069.png',
  'https://cdn-icons-png.flaticon.com/128/17095/17095040.png',
];

export default function RedEnvelopeEffect() {
  const [envelopes, setEnvelopes] = useState<RedEnvelope[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;

    // Tạo số lượng bao lì xì
    const count = 12;
    const newEnvelopes: RedEnvelope[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 4 + Math.random() * 5, // 4-9 giây
      animationDelay: Math.random() * 3,
      size: 24 + Math.random() * 16, // 24-40px
      opacity: 0.6 + Math.random() * 0.4, // 0.6-1.0
      iconUrl: ENVELOPE_ICONS[Math.floor(Math.random() * ENVELOPE_ICONS.length)],
    }));

    setEnvelopes(newEnvelopes);
  }, [isEnabled]);

  if (!isEnabled || envelopes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {envelopes.map((envelope) => (
        <div
          key={envelope.id}
          className="red-envelope absolute top-0 select-none"
          style={{
            left: `${envelope.left}%`,
            width: `${envelope.size}px`,
            height: `${envelope.size}px`,
            opacity: envelope.opacity,
            animation: `envelope-fly ${envelope.animationDuration}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            animationDelay: `${envelope.animationDelay}s`,
          }}
        >
          <Image
            src={envelope.iconUrl}
            alt="Bao lì xì"
            width={envelope.size}
            height={envelope.size}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
