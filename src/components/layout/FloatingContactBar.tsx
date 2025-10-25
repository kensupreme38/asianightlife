'use client';

import Link from "next/link";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

const contactLinks = [
  {
    name: 'WhatsApp',
    icon: <Image src="https://theme.hstatic.net/1000268128/1001303877/14/new_one_addthis_icon1_imec.png?v=156" alt="WhatsApp" width={48} height={48} className="rounded-full shadow-lg hover:scale-110 transition-transform" />,
    href: 'https://wa.me/6582808072',
    isImage: true,
  },
  {
    name: 'Telegram',
    icon: <Image src="https://theme.hstatic.net/1000268128/1001303877/14/new_one_addthis_icon3_imec.png?v=156" alt="Telegram" width={48} height={48} className="rounded-full shadow-lg hover:scale-110 transition-transform" />,
    href: 'https://t.me/asianightlifesg',
    isImage: true,
  },
  {
    name: 'YouTube',
    icon: <Image src="https://cdn-icons-png.flaticon.com/128/3670/3670147.png" alt="YouTube" width={48} height={48} className="rounded-full shadow-lg hover:scale-110 transition-transform" />,
    href: 'https://www.youtube.com/@anlasianightlife',
    isImage: true,
  },
];

export default function FloatingContactBar() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 items-center">
        {contactLinks.map((link) => (
          <Tooltip key={link.name}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={!link.isImage ? `flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform`: ''}
              >
                  {link.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
