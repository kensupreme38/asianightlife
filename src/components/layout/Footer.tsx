import { Button } from "@/components/ui/button";
import { Music, MessageCircle, Instagram, Facebook, Send } from "lucide-react";
import Link from 'next/link';

export const Footer = () => {
  const socialLinks = [
    { icon: MessageCircle, href: "https://wa.me/", label: "WhatsApp" },
    { icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/", label: "Facebook" },
    { icon: Send, href: "https://t.me/", label: "Telegram" }
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded bg-gradient-primary flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">NightLife</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Nền tảng đặt chỗ hàng đầu cho các địa điểm giải trí tại Đông Nam Á.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-secondary hover-glow"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Địa Điểm</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Đặt Chỗ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Danh Mục</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">KTV</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Clubs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Live House</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Khuyến Mãi</Link></li>
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="font-semibold mb-4">Quốc Gia</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">🇸🇬 Singapore</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">🇻🇳 Vietnam</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">🇹🇭 Thailand</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">🇲🇾 Malaysia</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 NightLife. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Điều Khoản
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Chính Sách
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Hỗ Trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
