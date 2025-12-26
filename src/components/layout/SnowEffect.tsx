'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;

    // Tạo số lượng bông tuyết
    const count = 50;
    const newSnowflakes: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 4, // 3-7 giây
      animationDelay: Math.random() * 2,
      size: 4 + Math.random() * 6, // 4-10px
      opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
    }));

    setSnowflakes(newSnowflakes);
  }, [isEnabled]);

  if (!isEnabled || snowflakes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake absolute top-0 select-none"
          style={{
            left: `${snowflake.left}%`,
            fontSize: `${snowflake.size}px`,
            opacity: snowflake.opacity,
            animation: `snowfall ${snowflake.animationDuration}s linear infinite`,
            animationDelay: `${snowflake.animationDelay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

