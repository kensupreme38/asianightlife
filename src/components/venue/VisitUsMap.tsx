"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

interface VisitUsMapProps {
  address: string | undefined;
  venueName?: string;
  country?: string;
  phone?: string | undefined;
  mapEmbedUrl?: string;
  onOpenBooking?: () => void;
}

export function VisitUsMap({ address, venueName, country, phone, mapEmbedUrl, onOpenBooking }: VisitUsMapProps) {
  if (!address) return null;

  const encoded = encodeURIComponent(address);
  const mapSrc = mapEmbedUrl || `https://www.google.com/maps?q=${encoded}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  const defaultPhone = "+65 8280 8072";
  const phoneToUse = phone && phone !== "N/A" ? phone : defaultPhone;

  return (
    <section className="w-full">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold font-headline">
          <span>Visit </span>
          <span className="gradient-text">Us</span>
        </h2>
        <p className="text-muted-foreground mt-3">
          {country
            ? `Located at the heart of ${country}'s entertainment district`
            : venueName || "Come say hi at our location"}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Contact Card */}
        <div className="card-elevated rounded-xl p-6">
          <h3 className="text-2xl font-bold font-headline mb-6">Contact Information</h3>

          {/* Address */}
          <div className="flex gap-4 items-start mb-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-red-deep to-red-orange text-white shadow-md flex-shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Address</p>
              <p className="mt-1 font-medium leading-relaxed">
                {address}
              </p>
              <div className="mt-3">
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex gap-4 items-start mb-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-red-deep to-red-orange text-white shadow-md">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Contact</p>
              <div className="mt-1 space-y-1">
                <div className="font-medium block">
                  Phone: <span className="font-normal">{phoneToUse}</span>
                </div>
                <div
                  className="block"
                >
                  WhatsApp: <span className="font-normal">{phoneToUse}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 border-t border-border/40">
            <Button variant="neon" size="lg" className="w-full mt-4" onClick={onOpenBooking}>Make a Booking</Button>
          </div>
        </div>

        {/* Right: Map */}
        <div className="rounded-xl overflow-hidden border card-elevated">
          <AspectRatio ratio={16 / 9} className="overflow-hidden">
            <iframe
              src={mapSrc}
              className="h-full w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={venueName ? `${venueName} location` : "Venue location"}
            />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
}


