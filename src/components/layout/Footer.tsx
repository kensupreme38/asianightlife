import { Music} from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export const Footer = () => {
  const socialLinks = [
    {
      name: 'TikTok',
      icon: "https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png",
      href: 'https://www.tiktok.com/@asianightlife.sg?_t=ZS-90Sk98gy6Se&_r=1',
    },
    {
      name: 'WhatsApp',
      icon: "https://theme.hstatic.net/1000268128/1001303877/14/new_one_addthis_icon1_imec.png?v=156",
      href: 'https://wa.me/',
    },
    {
      name: 'Telegram',
      icon: "https://theme.hstatic.net/1000268128/1001303877/14/new_one_addthis_icon3_imec.png?v=156",
      href: 'https://t.me/asianightlifesg',
    },
    {
      name: 'KakaoTalk',
      icon: "https://theme.hstatic.net/1000268128/1001303877/14/new_one_addthis_icon4_imec.png?v=156",
      href: 'kakaotalk://',
    },
    {
      name: 'Zalo',
      icon: "https://theme.hstatic.net/1000268128/1001303877/14/new_one_addthis_icon5_imec.png?v=156",
      href: 'https://zalo.me/',
    },
     {
      name: 'Facebook',
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg",
      href: 'https://www.facebook.com/profile.php?id=61581713529692&mibextid=ZbWKwL',
    },
    {
      name: 'YouTube',
      icon: "https://cdn-icons-png.flaticon.com/128/3670/3670147.png",
      href: 'https://www.youtube.com/@anlasianightlife',
    }
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
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

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Venues</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Bookings</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Connect with us */}
          <div>
            <h3 className="font-semibold mb-4">KẾT NỐI VỚI CHÚNG TÔI</h3>
            <p className="text-muted-foreground text-sm mb-4">Liên hệ ngay! Chúng tôi luôn sẵn sàng hỗ trợ 24/7</p>
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
