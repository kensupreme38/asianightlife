'use client';
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { getImage } from "@/lib/placeholder-images";

export const VenueGrid = () => {
  const ktvImage = getImage('ktv-sample');
  const clubImage = getImage('club-sample');
  const livehouseImage = getImage('livehouse-sample');

  // Mock data for demonstration
  const venues = [
    {
      id: "1",
      name: "Sky Lounge KTV",
      image: ktvImage?.imageUrl || "https://picsum.photos/seed/ktv/600/400",
      imageHint: ktvImage?.imageHint,
      category: "KTV",
      address: "Marina Bay, Singapore",
      price: "$80/giờ",
      rating: 4.8,
      status: "open" as const,
      features: ["Phòng VIP", "Đồ uống cao cấp", "Âm thanh 4K"],
      country: "singapore"
    },
    {
      id: "2", 
      name: "Neon Club",
      image: clubImage?.imageUrl || "https://picsum.photos/seed/club/600/400",
      imageHint: clubImage?.imageHint,
      category: "Club",
      address: "Quận 1, TP.HCM",
      price: "$50/người",
      rating: 4.6,
      status: "open" as const,
      features: ["DJ quốc tế", "Tầng nhảy rộng", "Bar service"],
      country: "vietnam"
    },
    {
      id: "3",
      name: "Echo Live House",
      image: livehouseImage?.imageUrl || "https://picsum.photos/seed/livehouse/600/400",
      imageHint: livehouseImage?.imageHint,
      category: "Live House",
      address: "Bangkok, Thailand",
      price: "$25/vé",
      rating: 4.7,
      status: "closed" as const,
      features: ["Nhạc sống", "Acoustic tuyệt vời", "Không gian ấm cúng"],
      country: "thailand"
    },
    {
      id: "4",
      name: "Royal KTV Palace",
      image: ktvImage?.imageUrl || "https://picsum.photos/seed/ktv2/600/400",
      imageHint: ktvImage?.imageHint,
      category: "KTV",
      address: "Kuala Lumpur, Malaysia",
      price: "$60/giờ",
      rating: 4.5,
      status: "open" as const,
      features: ["Phòng gia đình", "Buffet miễn phí", "Parking"],
      country: "malaysia"
    },
    {
      id: "5",
      name: "Underground Club",
      image: clubImage?.imageUrl || "https://picsum.photos/seed/club2/600/400",
      imageHint: clubImage?.imageHint,
      category: "Club",
      address: "Clarke Quay, Singapore",
      price: "$70/người",
      rating: 4.9,
      status: "open" as const,
      features: ["Rooftop view", "Premium drinks", "Celebrity DJ"],
      country: "singapore"
    },
    {
      id: "6",
      name: "Harmony Live",
      image: livehouseImage?.imageUrl || "https://picsum.photos/seed/livehouse2/600/400",
      imageHint: livehouseImage?.imageHint,
      category: "Live House",
      address: "Hà Nội, Vietnam",
      price: "$20/vé",
      rating: 4.4,
      status: "open" as const,
      features: ["Indie music", "Craft beer", "Weekly events"],
      country: "vietnam"
    }
  ];

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Địa Điểm Nổi Bật</span>
            </h2>
            <p className="text-muted-foreground">
              {venues.length} địa điểm được tìm thấy
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Cập nhật: vài phút trước
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Xem Thêm Địa Điểm
          </Button>
        </div>
      </div>
    </section>
  );
};
