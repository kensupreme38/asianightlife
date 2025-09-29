'use client';
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { getImage } from "@/lib/placeholder-images";

export const VenueGrid = () => {
  const clubImage = getImage('club-sample');
  const livehouseImage = getImage('livehouse-sample');

  const venues = [
    {
        id: "1",
        name: "277 KTV",
        image: "https://nightlifeasia.wiki/images/thumb/0/0c/277-ktv.jpg/100px-277-ktv.jpg",
        category: "KTV",
        address: "277 Geylang Rd",
        price: "S$50 (HH)",
        rating: 4.5,
        status: "open" as const,
        features: ["Vietnam", "Medium - High"],
        country: "singapore"
    },
    {
        id: "2",
        name: "Ace Club",
        image: "https://nightlifeasia.wiki/images/thumb/9/92/Club-ace-ktv.jpg/100px-Club-ace-ktv.jpg",
        category: "KTV",
        address: "48 Foch Rd, Level 2, Singapore 209272",
        price: "S$50 (HH)",
        rating: 4.6,
        status: "open" as const,
        features: ["Vietnam", "High"],
        country: "singapore"
    },
    {
        id: "3",
        name: "Avatar KTV",
        image: "https://nightlifeasia.wiki/images/thumb/4/40/Avatar_ktv_logo1.png/100px-Avatar_ktv_logo1.png",
        category: "KTV",
        address: "35 Selegie Road, #05-26, Parklane Shopping Mall",
        price: "S$100 (NH)",
        rating: 4.8,
        status: "open" as const,
        features: ["Vietnam", "Hot"],
        country: "singapore"
    },
    {
        id: "4",
        name: "Azit Korean KTV",
        image: "https://nightlifeasia.wiki/images/thumb/c/ce/Azit_korean_ktv_logo1.png/100px-Azit_korean_ktv_logo1.png",
        category: "KTV",
        address: "5 Coleman Street Excelsior Tower Lobby, Hotel, #05-00 Peninsula Excelsior",
        price: "???",
        rating: 4.2,
        status: "open" as const,
        features: ["Korea"],
        country: "singapore"
    },
    {
        id: "5",
        name: "B12 KTV",
        image: "https://nightlifeasia.wiki/images/thumb/4/4c/B12-Delux-Logo.jpg/100px-B12-Delux-Logo.jpg",
        category: "KTV",
        address: "#B1-19, Havelock 2, 2 Havelock Rd",
        price: "$50 HH",
        rating: 4.7,
        status: "open" as const,
        features: ["Vietnam", "High"],
        country: "singapore"
    },
    {
        id: "6",
        name: "Catwalk KTV (Singapore)",
        image: "https://nightlifeasia.wiki/images/thumb/c/cc/Catwalk-ktv2.jpg/100px-Catwalk-ktv2.jpg",
        category: "KTV",
        address: "200 Jalan Sultan Textile Centre Level 7",
        price: "S$70 (HH)",
        rating: 4.8,
        status: "open" as const,
        features: ["Vietnam", "Hot"],
        country: "singapore"
    },
    {
        id: "7",
        name: "Club Chanel",
        image: "https://nightlifeasia.wiki/images/thumb/a/ae/Club-chanel.jpg/100px-Club-chanel.jpg",
        category: "KTV",
        address: "35 Selegie Road, #B1-09, Parklane Shopping Mall",
        price: "S$100",
        rating: 4.3,
        status: "open" as const,
        features: ["China", "Low"],
        country: "singapore"
    },
    {
        id: "8",
        name: "Club Diamond",
        image: "https://nightlifeasia.wiki/images/thumb/c/ca/Club_diamond_logo1.jpg/100px-Club_diamond_logo1.jpg",
        category: "KTV",
        address: "6001 Beach Road, Golden Mile Tower #B1-10",
        price: "???",
        rating: 4.4,
        status: "open" as const,
        features: ["Thailand"],
        country: "singapore"
    },
    {
      id: "9", 
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
      id: "10",
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
      id: "11",
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
      id: "12",
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
