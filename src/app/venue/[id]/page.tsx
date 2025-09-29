'use client';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { useCallback } from 'react';
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGallery } from "@/components/venue/VenueGallery";
import { VenueInfo } from "@/components/venue/VenueInfo";
import { SimilarVenues } from "@/components/venue/SimilarVenues";
import { getImage } from '@/lib/placeholder-images';
import { VenueImageMasonry } from '@/components/venue/VenueImageMasonry';

const VenueDetail = () => {
  const params = useParams();
  const id = params.id as string;

  const ktvSample = getImage('ktv-sample');
  const clubSample = getImage('club-sample');
  const livehouseSample = getImage('livehouse-sample');
  const heroBanner = getImage('hero-banner');

  // Mock data - in real app, this would fetch based on ID
  const venue = {
    id: id || "1",
    name: "Sky Lounge KTV",
    category: "KTV",
    address: "Marina Bay Sands, Singapore 018956",
    phone: "+6591234567",
    price: "$80/giờ",
    rating: 4.8,
    status: "open" as const,
    openHours: "18:00 - 03:00",
    description: "Sky Lounge KTV là một trong những địa điểm karaoke cao cấp nhất tại Singapore. Với thiết kế hiện đại, âm thanh chất lượng cao và dịch vụ tuyệt vời, chúng tôi mang đến trải nghiệm giải trí đẳng cấp. Các phòng được trang bị hệ thống karaoke 4K, âm thanh vòm và không gian sang trọng. Thích hợp cho các buổi tiệc sinh nhật, họp mặt bạn bè, hay các sự kiện công ty.",
    features: ["Phòng VIP", "Đồ uống cao cấp", "Âm thanh 4K", "Dịch vụ 24/7", "Buffet premium"],
    amenities: ["Wifi miễn phí", "Bãi đỗ xe", "Âm thanh cao cấp", "Phòng VIP", "Thanh toán thẻ"],
    rules: [
      "Tuổi tối thiểu: 18+",
      "Không hút thuốc trong phòng",
      "Thanh toán trước khi sử dụng",
      "Tối đa 8 người/phòng",
      "Không mang đồ ăn từ bên ngoài",
      "Giữ gìn vệ sinh và trang thiết bị"
    ],
    country: "singapore"
  };

  const images = [
    ktvSample?.imageUrl || '',
    clubSample?.imageUrl || '',
    livehouseSample?.imageUrl || '',
    heroBanner?.imageUrl || '',
    ktvSample?.imageUrl || '',
    clubSample?.imageUrl || ''
  ].filter(Boolean);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const shareData = {
      title: venue.name,
      text: `Khám phá ${venue.name} - ${venue.address}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Optional: Show a toast notification that the link has been copied.
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Fallback to clipboard copy if sharing fails for any reason
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Optional: Show a toast notification.
        alert('Sharing failed, link copied to clipboard!');
      } catch (copyError) {
        console.error("Copying to clipboard failed:", copyError);
        alert("Could not share or copy link.");
      }
    }
  }, [venue.name, venue.address]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <VenueGallery images={images} venueName={venue.name} />
        </div>

        {/* Venue Info */}
        <div className="mb-12">
          <VenueInfo venue={venue} />
        </div>

        {/* Masonry Gallery */}
        <div className="card-elevated p-6 rounded-xl mb-12">
           <h3 className="text-xl font-bold mb-4">Thư Viện Ảnh</h3>
           <VenueImageMasonry images={images} />
        </div>

        {/* Similar Venues */}
        <SimilarVenues 
          currentVenueId={venue.id}
          category={venue.category}
          country={venue.country}
        />
      </main>

      <Footer />
    </div>
  );
};

export default VenueDetail;
