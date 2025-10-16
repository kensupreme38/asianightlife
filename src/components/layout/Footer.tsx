import { Music} from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export const Footer = () => {
  const socialLinks = [
    {
      name: 'YouTube',
      icon: "https://cdn-icons-png.flaticon.com/128/3670/3670147.png",
      href: 'https://www.youtube.com/@anlasianightlife',
    },
    {
      name: 'Instagram',
      icon: "https://cdn-icons-png.flaticon.com/128/15707/15707749.png",
      href: 'https://www.instagram.com/asianightlife.sg?igsh=MWZzdjUzN21uZG00Yg==',
    },
    {
      name: 'TikTok',
      icon: "https://cdn-icons-png.flaticon.com/128/4782/4782345.png",
      href: 'https://www.tiktok.com/@asianightlife.sg?_t=ZS-90Sk98gy6Se&_r=1',
    },
    {
      name: 'Facebook',
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg",
      href: 'https://www.facebook.com/profile.php?id=61581713529692&mibextid=ZbWKwL',
    }
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded bg-gradient-primary flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">NightLife</span>
            </div>
            <p className="text-muted-foreground mb-4">
              The leading booking platform for entertainment venues in Southeast Asia.
            </p>
          </div>

          {/* Connect with us */}
          <div>
            <h3 className="font-semibold mb-4">CONNECT WITH US</h3>
            <p className="text-muted-foreground text-sm mb-4">Contact us now! We are always ready to support you 24/7</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Link key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
                  <Image src={link.icon} alt={link.name} width={40} height={40} className="rounded-full shadow-lg hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
};
