import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Instagram, 
  Music, 
  Facebook, 
  Send,
  LogIn,
  UserPlus 
} from "lucide-react";

export const Header = () => {
  const socialLinks = [
    { icon: MessageCircle, href: "https://wa.me/", label: "WhatsApp" },
    { icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
    { icon: Music, href: "https://tiktok.com/", label: "TikTok" },
    { icon: Facebook, href: "https://facebook.com/", label: "Facebook" },
    { icon: Send, href: "https://t.me/", label: "Telegram" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-gradient-primary flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">NightLife</span>
        </div>

        {/* Social Links */}
        <div className="hidden md:flex items-center space-x-1">
          {socialLinks.map((social) => (
            <Button
              key={social.label}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-secondary hover-glow"
              asChild
            >
              <a 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-sm">
            <LogIn className="h-4 w-4 mr-2" />
            LOGIN
          </Button>
          <Button variant="neon" size="sm" className="text-sm">
            <UserPlus className="h-4 w-4 mr-2" />
            JOIN
          </Button>
        </div>
      </div>
    </header>
  );
};
