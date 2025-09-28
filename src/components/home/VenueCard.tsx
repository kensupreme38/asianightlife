import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, MessageCircle, Heart } from "lucide-react";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    image: string;
    category: string;
    address: string;
    price: string;
    rating: number;
    status: "open" | "closed";
    features: string[];
    country: string;
  };
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  const isOpen = venue.status === "open";
  
  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Chào bạn! Tôi muốn đặt chỗ tại ${venue.name} - ${venue.address}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Link to={`/venue/${venue.id}`} className="group card-elevated rounded-xl overflow-hidden hover-glow transition-all duration-300 block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={isOpen ? "default" : "destructive"}
            className={`${isOpen ? 'bg-green-500 hover:bg-green-600' : ''} text-white font-medium`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {isOpen ? "Đang Mở" : "Đã Đóng"}
          </Badge>
        </div>

        {/* Heart Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Category & Price */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <Badge variant="secondary" className="bg-black/60 text-white">
            {venue.category}
          </Badge>
          <div className="text-white font-bold text-lg">
            {venue.price}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center space-x-1 shrink-0 ml-2">
            <Star className="h-4 w-4 text-gold fill-current" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="line-clamp-1">{venue.address}</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {venue.features.slice(0, 3).map((feature, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Booking Button */}
        <Button 
          onClick={handleBooking}
          className="w-full" 
          variant="neon"
          disabled={!isOpen}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {isOpen ? "Đặt Chỗ Ngay" : "Tạm Đóng Cửa"}
        </Button>
      </div>
    </Link>
  );
};
