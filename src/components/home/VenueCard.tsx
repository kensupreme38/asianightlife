'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import Image from 'next/image';

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
  };
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  const isOpen = venue.status === "open";
  
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello! I would like to book a spot at ${venue.name} - ${venue.address}`;
    window.open(`https://wa.me/6582808072?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Link href={`/venue/${venue.id}`} className="group card-elevated rounded-xl overflow-hidden hover-glow transition-all duration-300 block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={venue.main_image_url} 
          alt={venue.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={venue.imageHint}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={isOpen ? "default" : "destructive"}
            className={`${isOpen ? 'bg-green-500 hover:bg-green-600' : ''} text-white font-medium`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>

        {/* Category & Price */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <Badge variant="secondary" className="bg-black/60 text-white">
            {venue.category}
          </Badge>
          <div className="hidden md:block text-white font-bold text-lg">
            {venue.price}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors font-headline">
              {venue.name}
            </h3>
          </div>

          <div className="flex items-center text-muted-foreground text-xs md:text-sm">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="line-clamp-1">{venue.address}</span>
          </div>
        </div>

        {/* Booking Button */}
        <Button 
          onClick={handleBooking}
          className="w-full"
          size="sm"
          variant="neon"
          disabled={!isOpen}
        >
          <MessageCircle className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">{isOpen ? (venue.category === 'Hotel' ? "Book Now" : "Make A Booking") : "Temporarily Closed"}</span>
        </Button>
      </div>
    </Link>
  );
};
