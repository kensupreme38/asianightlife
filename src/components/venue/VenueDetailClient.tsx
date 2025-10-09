'use client';
import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGallery } from "@/components/venue/VenueGallery";
import { VenueInfo } from "@/components/venue/VenueInfo";
import { SimilarVenues } from "@/components/venue/SimilarVenues";
import { VenueImageMasonry } from '@/components/venue/VenueImageMasonry';
import { ktvData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const VenueDetailClient = ({ id }: { id: string }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const venue = useMemo(() => {
    if (!hasMounted) return null;

    const foundVenue = ktvData.find(v => v.id.toString() === id);
    if (foundVenue) {
      return {
        ...foundVenue,
        id: foundVenue.id.toString(),
        rating: 4.8,
        status: "open" as const,
        amenities: ["Free Wifi", "Parking", "Premium Sound", "VIP Rooms", "Card Payment"],
        hours: typeof foundVenue.hours === 'object' ? 'Various' : foundVenue.hours,
      };
    }

    // Fallback mock data if not found, using some defaults
    return {
      id: id || "1",
      name: "Sky Lounge KTV",
      category: "KTV",
      address: "Marina Bay Sands, Singapore 018956",
      phone: "+6591234567",
      price: "$80/hour",
      rating: 4.8,
      status: "open" as const,
      hours: "18:00 - 03:00",
      description: "Sky Lounge KTV is one of the most premium karaoke places in Singapore. With a modern design, high-quality sound, and excellent service, we deliver a top-class entertainment experience. Rooms are equipped with 4K karaoke systems, surround sound, and luxurious spaces. Suitable for birthday parties, friend gatherings, or corporate events.",
      country: "singapore",
      main_image_url: "https://picsum.photos/seed/ktv-fallback/1200/800",
      images: [
        "https://picsum.photos/seed/ktv-fallback-1/1200/800",
        "https://picsum.photos/seed/ktv-fallback-2/1200/800",
        "https://picsum.photos/seed/ktv-fallback-3/1200/800",
      ],
      amenities: ["Free Wifi", "Parking", "Premium Sound", "VIP Rooms", "Card Payment"],
    };
  }, [id, hasMounted]);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined' || !venue) return;

    const shareData = {
      title: venue.name,
      text: `Discover ${venue.name} - ${venue.address}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error("Share failed:", error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Sharing failed, link copied to clipboard!');
      } catch (copyError) {
        console.error("Copying to clipboard failed:", copyError);
        alert("Could not share or copy link.");
      }
    }
  }, [venue]);

  if (!hasMounted || !venue) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-[550px] w-full rounded-lg mb-8" />
          <Skeleton className="h-40 w-full rounded-lg mb-12" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </main>
        <Footer />
      </div>
    );
  }

  const galleryImages = [venue.main_image_url, ...venue.images];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to list
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <VenueGallery images={galleryImages} venueName={venue.name} />
        </div>

        {/* Venue Info */}
        <div className="mb-12">
          <VenueInfo venue={venue} />
        </div>

        {/* Masonry Gallery */}
        <div className="card-elevated p-6 rounded-xl mb-12">
           <h3 className="text-xl font-bold mb-4">Image Library</h3>
           <VenueImageMasonry images={galleryImages} />
        </div>

        {/* Similar Venues */}
        <SimilarVenues 
          currentVenueId={venue.id.toString()}
          category={venue.category}
          country={venue.country}
        />
      </main>

      <Footer />
    </div>
  );
};

export default VenueDetailClient;
