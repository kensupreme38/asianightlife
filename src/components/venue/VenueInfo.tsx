'use client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Wifi, 
  Car, 
  Music,
  Users,
  CreditCard,
  CheckCircle
} from "lucide-react";

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
    hours: string;
    description: string;
    amenities: string[];
    country: string;
  };
}

export const VenueInfo = ({ venue }: VenueInfoProps) => {
  const isOpen = venue.status === "open";
  
  const handleBooking = () => {
    const message = `Hello! I would like to book a spot at ${venue.name} - ${venue.address}. Please let me know about prices and availability.`;
    window.open(`https://wa.me/${venue.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${venue.phone}`, '_self');
  };

  const amenityIcons: { [key: string]: any } = {
    "Free Wifi": Wifi,
    "Parking": Car,
    "Premium Sound": Music,
    "VIP Rooms": Users,
    "Card Payment": CreditCard,
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{venue.category}</Badge>
              <Badge 
                variant={isOpen ? "default" : "destructive"}
                className={`${isOpen ? 'bg-green-500 hover:bg-green-600' : ''} text-white`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-gold fill-current" />
                <span className="font-medium">{venue.rating}</span>
                <span className="text-sm">(128 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{venue.address}</span>
              </div>
            </div>
          </div>
          
          <div className="text-left md:text-right shrink-0">
            <div className="text-3xl font-bold gradient-text mb-1">{venue.price}</div>
            <div className="text-sm text-muted-foreground">Starting price</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleBooking}
            size="lg" 
            variant="neon"
            className="flex-1 py-4 sm:py-2"
            disabled={!isOpen}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {isOpen ? "Book via WhatsApp" : "Temporarily Closed"}
          </Button>
          <Button 
            onClick={handleCall}
            size="lg" 
            variant="outline"
            className="flex-1 py-4 sm:py-2"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Description */}
        <div className="card-elevated p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
        </div>

        {/* Info */}
        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Info</h3>
          <div className="space-y-4">
            <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Sunday</span>
                  <span className="font-medium">{venue.hours}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Status</span>
                  <span className={`font-medium ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>
            </div>
            <div className="border-t border-border/40 my-4"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{venue.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{venue.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>24/7 WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
