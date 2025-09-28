import { Button } from "@/components/ui/button";
import { Music, MessageCircle, Instagram, Facebook, Send } from "lucide-react";

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
              <li><a href="#" className="hover:text-primary transition-colors">Trang Chủ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Địa Điểm</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Đặt Chỗ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Liên Hệ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Danh Mục</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">KTV</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Clubs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Live House</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Khuyến Mãi</a></li>
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="font-semibold mb-4">Quốc Gia</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">🇸🇬 Singapore</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">🇻🇳 Vietnam</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">🇹🇭 Thailand</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">🇲🇾 Malaysia</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 NightLife. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Điều Khoản
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Chính Sách
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Hỗ Trợ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
