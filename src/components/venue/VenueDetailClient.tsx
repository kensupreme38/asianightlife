"use client";
import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGallery } from "@/components/venue/VenueGallery";
import { VenueInfo } from "@/components/venue/VenueInfo";
import { SimilarVenues } from "@/components/venue/SimilarVenues";
import { VenueImageMasonry } from "@/components/venue/VenueImageMasonry";
import { VisitUsMap } from "@/components/venue/VisitUsMap";
import { BookingForm } from "@/components/venue/BookingForm";
import { ktvData } from "@/lib/data";

const VenueDetailClient = ({ id }: { id: string }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useMemo(() => {
    return new URLSearchParams(searchParams?.toString() ?? "");
  }, [searchParams]);

  const searchQuery = params.get("q") || "";

  useEffect(() => {
    // Mount immediately for venue detail pages
    setHasMounted(true);
  }, []);

  const handleSearchChange = (query: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`/?${newParams.toString()}`);
  };

  const venue = useMemo(() => {
    if (!hasMounted) return null;

    const foundVenue = ktvData.find((v) => v.id.toString() === id);
    if (foundVenue) {
      return {
        ...foundVenue,
        id: foundVenue.id.toString(),
        phone: foundVenue.phone || "",
        rating: 4.8,
        status: "open" as const,
        amenities: [
          "Free Wifi",
          "Parking",
          "Premium Sound",
          "VIP Rooms",
          "Card Payment",
        ],
        hours:
          typeof foundVenue.hours === "string"
            ? foundVenue.hours
            : "Check with venue",
        description: foundVenue.description || "No description available",
        mapEmbedUrl: (foundVenue as any).mapEmbedUrl,
        country: foundVenue.country || "Unknown",
      };
    }
    return null;
  }, [id, hasMounted]);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined" || !venue) return;

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
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Sharing failed, link copied to clipboard!");
      } catch (copyError) {
        console.error("Copying to clipboard failed:", copyError);
        alert("Could not share or copy link.");
      }
    }
  }, [venue]);

  const [bookingOpen, setBookingOpen] = useState(false);

  if (!hasMounted || !venue) {
    return null;
  }

  const galleryImages = [venue.main_image_url, ...venue.images];

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="container py-8 px-4 sm:px-8">
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
          <h3 className="text-xl font-bold mb-4 font-headline">
            Image Library
          </h3>
          <VenueImageMasonry images={galleryImages} />
        </div>

        {/* Similar Venues */}
        <SimilarVenues
          currentVenueId={venue.id.toString()}
          category={venue.category}
          country={venue.country}
        />

        {/* Visit Us - Google Maps */}
        <div className="mt-10">
          <VisitUsMap
            address={venue.address}
            venueName={venue.name}
            country={venue.country}
            phone={venue.phone}
            mapEmbedUrl={venue.mapEmbedUrl}
            onOpenBooking={() => setBookingOpen(true)}
          />
        </div>
      </main>

      <Footer />

      {/* Shared Booking Form for this detail page */}
      <BookingForm
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        venueName={venue.name}
        venueAddress={venue.address}
      />
    </div>
  );
};

export default VenueDetailClient;
