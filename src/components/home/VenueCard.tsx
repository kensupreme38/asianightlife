"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { SimpleImage } from "@/components/ui/simple-image";
import { BookingForm } from "@/components/venue/BookingForm";
import { useState } from "react";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    main_image_url: string;
    imageHint?: string;
    category: string;
    address: string;
    price: string;
    rating: number;
    status: "open" | "closed";
    country: string;
    hours?: string | Record<string, string | undefined>;
  };
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isOpen = venue.status === "open";

  const handleBooking = () => {
    setIsBookingOpen(true);
  };

  return (
    <div className="group card-elevated rounded-xl overflow-hidden hover-glow transition-all duration-300 h-full flex flex-col">
      <Link
        href={`/venue/${venue.id}`}
        className="block flex-1 flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          <SimpleImage
            src={venue.main_image_url}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3 hidden md:block">
            <Badge
              variant={isOpen ? "default" : "destructive"}
              className={`${
                isOpen ? "bg-green-500 hover:bg-green-600" : ""
              } text-white font-medium`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 hidden md:block">
            <div className="hidden md:block text-white font-bold text-xs bg-black/60 px-4 py-1 rounded-xl">
                {venue.price}
            </div>
          </div>

          {/* Category & Price */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <Badge variant="secondary" className="bg-black/60 text-white truncate text-xs">
              {venue.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="md:p-4 px-2.5 space-y-3 py-1 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors font-headline">
                {venue.name}
              </h3>
            </div>

            <div className="flex items-center text-muted-foreground text-xs md:text-sm">
              <MapPin className="h-3 w-3 md:w-4 md:h-4 mr-1 shrink-0" />
              <span className="line-clamp-1">{venue.address}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Booking Button - Hidden for Hotels */}
      {venue.category !== "Hotel" ? (
        <div className="md:px-4 p-2.5 pt-0 mt-2 md:mt-0 flex-shrink-0">
          <Button
            onClick={handleBooking}
            className="w-full"
            size="sm"
            variant="neon"
            disabled={!isOpen}
          >
            <MessageCircle className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">
              {isOpen ? "Make A Booking" : "Temporarily Closed"}
            </span>
          </Button>
        </div>
      ) : (
        <div className="md:px-4 p-2.5 pt-0 mt-2 md:mt-0 flex-shrink-0"></div>
      )}

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
