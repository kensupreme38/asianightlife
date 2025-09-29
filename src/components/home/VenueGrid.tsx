'use client';
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { getImage } from "@/lib/placeholder-images";
import { ktvData } from "@/lib/data";

export const VenueGrid = () => {
  const venues = [
    ...ktvData.map(ktv => ({
      id: ktv.id,
      name: ktv.name,
      image: ktv.image,
      category: "KTV",
      address: ktv.address,
      price: ktv.price,
      rating: parseFloat((Math.random() * (5 - 4.2) + 4.2).toFixed(1)),
      status: "open" as const,
      features: ktv.features,
      country: "singapore"
    }))
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

    