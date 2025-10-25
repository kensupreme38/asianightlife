import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  const socialLinks = [
    {
      name: "YouTube",
      icon: "https://cdn-icons-png.flaticon.com/128/3670/3670147.png",
      href: "https://www.youtube.com/@anlasianightlife",
    },
    {
      name: "Instagram",
      icon: "https://cdn-icons-png.flaticon.com/128/15707/15707749.png",
      href: "https://www.instagram.com/asianightlife.sg?igsh=MWZzdjUzN21uZG00Yg==",
    },
    {
      name: "TikTok",
      icon: "https://img.icons8.com/ios-filled/50/000000/tiktok--v1.png",
      href: "https://www.tiktok.com/@asianightlife.sg?_t=ZS-90Sk98gy6Se&_r=1",
      className: "dark:invert",
    },
    {
      name: "Facebook",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg",
      href: "https://www.facebook.com/profile.php?id=61581713529692&mibextid=ZbWKwL",
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded bg-gradient-primary flex items-center justify-center">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1C55Ml5hc3-BvzEo2S5zwkgMyuTViR2Tt"
                  alt="Asia Night Life Logo"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-xl gradient-text">
                Asia Night Life
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              The leading booking platform for entertainment venues in Southeast
              Asia.
            </p>
          </div>

          {/* Contact Booking */}
          <div>
            <h3 className="font-semibold mb-4">CONTACT BOOKING</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Contact us now! We are always ready to support you 24/7
            </p>
            <div className="flex flex-col gap-3">
              {/* WhatsApp */}
              <Link
                href="https://wa.me/6582808072"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">+65 8280 8072</p>
                </div>
              </Link>

              {/* Telegram */}
              <Link
                href="https://t.me/asianightlifesg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                  alt="Telegram"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">Telegram</p>
                  <p className="text-sm text-muted-foreground">@asianightlifesg</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Connect with us */}
          <div>
            <h3 className="font-semibold mb-4">CONNECT WITH US</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Follow us on social media
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={link.icon}
                    alt={link.name}
                    width={40}
                    height={40}
                    className={`rounded-full shadow-lg hover:scale-110 transition-transform ${
                      link.className || ""
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
