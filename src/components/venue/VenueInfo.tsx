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
    openHours: string;
    description: string;
    features: string[];
    amenities: string[];
    rules: string[];
    country: string;
  };
}

export const VenueInfo = ({ venue }: VenueInfoProps) => {
  const isOpen = venue.status === "open";
  
  const handleBooking = () => {
    const message = `Chào bạn! Tôi muốn đặt chỗ tại ${venue.name} - ${venue.address}. Vui lòng cho tôi biết thông tin về giá và thời gian có sẵn.`;
    window.open(`https://wa.me/${venue.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${venue.phone}`, '_self');
  };

  const amenityIcons: { [key: string]: any } = {
    "Wifi miễn phí": Wifi,
    "Bãi đỗ xe": Car,
    "Âm thanh cao cấp": Music,
    "Phòng VIP": Users,
    "Thanh toán thẻ": CreditCard,
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{venue.category}</Badge>
              <Badge 
                variant={isOpen ? "default" : "destructive"}
                className={`${isOpen ? 'bg-green-500 hover:bg-green-600' : ''} text-white`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {isOpen ? "Đang Mở" : "Đã Đóng"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-gold fill-current" />
                <span className="font-medium">{venue.rating}</span>
                <span className="text-sm">(128 đánh giá)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{venue.address}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text mb-1">{venue.price}</div>
            <div className="text-sm text-muted-foreground">Giá khởi điểm</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleBooking}
            size="lg" 
            variant="neon"
            className="flex-1"
            disabled={!isOpen}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {isOpen ? "Đặt Chỗ Qua WhatsApp" : "Tạm Đóng Cửa"}
          </Button>
          <Button 
            onClick={handleCall}
            size="lg" 
            variant="outline"
            className="flex-1"
          >
            <Phone className="h-5 w-5 mr-2" />
            Gọi Điện
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="card-elevated p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Mô Tả</h2>
        <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
      </div>

      {/* Hours & Contact */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Giờ Hoạt Động</h3>
          <div className="space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Thứ 2 - Chủ Nhật</span>
              <span className="font-medium">{venue.openHours}</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái hiện tại</span>
              <span className={`font-medium ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
              </span>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Liên Hệ</h3>
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
              <span>Hỗ trợ WhatsApp 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features & Amenities */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Tiện Nghi</h3>
          <div className="grid grid-cols-1 gap-3">
            {venue.amenities.map((amenity, index) => {
              const IconComponent = amenityIcons[amenity] || CheckCircle;
              return (
                <div key={index} className="flex items-center gap-3">
                  <IconComponent className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Đặc Trưng</h3>
          <div className="flex flex-wrap gap-2">
            {venue.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
