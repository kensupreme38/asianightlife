import { VenueCard } from "@/components/home/VenueCard";
import ktvSample from "@/assets/ktv-sample.jpg";
import clubSample from "@/assets/club-sample.jpg";
import livehouseSample from "@/assets/livehouse-sample.jpg";

interface SimilarVenuesProps {
  currentVenueId: string;
  category: string;
  country: string;
}

export const SimilarVenues = ({ currentVenueId, category, country }: SimilarVenuesProps) => {
  // Mock data - in real app, this would filter based on category/country and exclude current venue
  const similarVenues = [
    {
      id: "2", 
      name: "Platinum KTV",
      image: ktvSample,
      category: "KTV",
      address: "Orchard Road, Singapore",
      price: "$90/giờ",
      rating: 4.7,
      status: "open" as const,
      features: ["Phòng gia đình", "Buffet cao cấp", "Karaoke 4K"],
      country: "singapore"
    },
    {
      id: "3",
      name: "Diamond Club",
      image: clubSample,
      category: "Club", 
      address: "Marina Bay, Singapore",
      price: "$85/người",
      rating: 4.8,
      status: "open" as const,
      features: ["Rooftop terrace", "Premium bar", "Celebrity DJ"],
      country: "singapore"
    },
    {
      id: "4",
      name: "Royal KTV Lounge",
      image: ktvSample,
      category: "KTV",
      address: "Clarke Quay, Singapore", 
      price: "$75/giờ",
      rating: 4.6,
      status: "open" as const,
      features: ["Private rooms", "Premium sound", "24/7 service"],
      country: "singapore"
    }
  ].filter(venue => venue.id !== currentVenueId);

  return (
    <section className="py-12 border-t border-border/40">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="gradient-text">Địa Điểm Tương Tự</span>
          </h2>
          <p className="text-muted-foreground">
            Khám phá thêm các {category.toLowerCase()} khác tại {country === 'singapore' ? 'Singapore' : country}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Tìm thấy {similarVenues.length} địa điểm tương tự
          </p>
        </div>
      </div>
    </section>
  );
};
