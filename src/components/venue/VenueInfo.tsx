"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BookingForm } from "@/components/venue/BookingForm";
import { useState } from "react";

interface VenueInfoProps {
  venue: {
    id: string;
    name: string;
    category: string;
    address: string;
    phone: string;
    price: string;
    rating: number;
    status: "open" | "closed";
    hours: string | Record<string, string>;
    description: string;
    amenities: string[];
    country: string;
  };
}

export const VenueInfo = ({ venue }: VenueInfoProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isOpen = venue.status === "open";

  const handleWhatsAppBooking = () => {
    setIsBookingOpen(true);
  };

  const handleTelegramBooking = () => {
    const message = `Hello! I would like to book a spot at ${venue.name} - ${venue.address}. Please let me know about prices and availability.`;
    window.open(
      `https://t.me/asianightlifesg?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="truncate max-w-[200px]">{venue.category}</Badge>
              <Badge
                variant={isOpen ? "default" : "destructive"}
                className={`${
                  isOpen ? "bg-green-500 hover:bg-green-600" : ""
                } text-white`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-headline">
              {venue.name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{venue.address}</span>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <div className="text-3xl font-bold gradient-text mb-1">
              {venue.price}
            </div>
            <div className="text-sm text-muted-foreground">Starting price</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
            {/* First Row - WhatsApp */}
            <Button
              onClick={handleWhatsAppBooking}
              size="lg"
              variant="neon"
              className="w-full py-4"
              disabled={!isOpen}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {isOpen ? "Make A Booking" : "Temporarily Closed"}
            </Button>

            {/* Second Row - Telegram */}
            <Button
              onClick={handleTelegramBooking}
              size="lg"
              variant="outline"
              className="w-full py-4"
              disabled={!isOpen}
            >
              <Send className="h-5 w-5 mr-2" />
              {isOpen ? "Book via Telegram" : "Temporarily Closed"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Description */}
        <div className="card-elevated p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 font-headline">Description</h2>
          <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-headings:font-headline prose-headings:text-foreground prose-strong:text-foreground prose-strong:font-semibold">
            <ReactMarkdown>{venue.description}</ReactMarkdown>
          </div>
        </div>

        {/* Info */}
        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 font-headline">Info</h3>
          <div className="space-y-4">
            <div className="space-y-2 text-muted-foreground">
              {typeof venue.hours === "string" ? (
                <div className="flex justify-between">
                  <span>Monday - Sunday</span>
                  <span className="font-medium">{venue.hours}</span>
                </div>
              ) : (
                Object.entries(venue.hours).map(([day, time]) => (
                  <div className="flex justify-between" key={day}>
                    <span>{day}</span>
                    <span className="font-medium">{time}</span>
                  </div>
                ))
              )}
              <div className="flex justify-between">
                <span>Current Status</span>
                <span
                  className={`font-medium ${
                    isOpen ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
            <div className="border-t border-border/40 my-4"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{venue.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>24/7 WhatsApp Support</span>
              </div>
            </div>

            {/* Amenities for Hotels */}
            {venue.category === "Hotel" && venue.amenities && (
              <>
                <div className="border-t border-border/40 my-4"></div>
                <div>
                  <h4 className="text-md font-semibold mb-3 font-headline">
                    Amenities
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <BookingForm
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        venueName={venue.name}
        venueAddress={venue.address}
      />
    </div>
  );
};
