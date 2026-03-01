"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGallery } from "@/components/venue/VenueGallery";
import { VenueInfo } from "@/components/venue/VenueInfo";
import { RelatedVenues } from "@/components/venue/RelatedVenues";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { ktvData } from "@/lib/data";
import { generateSlug } from "@/lib/slug-utils";

// Dynamic imports for heavy components - only load when needed
const VenueImageMasonry = dynamic(
  () => import("@/components/venue/VenueImageMasonry").then((mod) => ({ default: mod.VenueImageMasonry })),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
    ssr: false, // Disable SSR for masonry layout
  }
);

const VisitUsMap = dynamic(
  () => import("@/components/venue/VisitUsMap").then((mod) => ({ default: mod.VisitUsMap })),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-lg" />,
  }
);

const BookingForm = dynamic(
  () => import("@/components/venue/BookingForm").then((mod) => ({ default: mod.BookingForm })),
  {
    loading: () => null, // No loading state for modal
  }
);

const VenueDetailClient = ({ id }: { id: string }) => {
  const t = useTranslations();
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
        slug: generateSlug(foundVenue.name),
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
      text: t('venue.discover', { venueName: venue.name, address: venue.address }),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('bookingForm.linkCopied'));
      }
    } catch (error) {
      console.error("Share failed:", error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('bookingForm.shareFailed'));
      } catch (copyError) {
        console.error("Copying to clipboard failed:", copyError);
        alert(t('bookingForm.couldNotShare'));
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

      <main id="main-content" className="container py-8 px-4 sm:px-8">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: venue.name, href: `/venue/${venue.slug}` }
            ]}
          />
        </nav>
        
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => {
              // Navigate về trang chủ, VenueGrid sẽ tự động restore page từ sessionStorage
              try {
                const savedUrl = sessionStorage.getItem('scrollRestoreReferrer');
                if (savedUrl) {
                  // Navigate đến URL đã lưu (có thể có page parameter)
                  router.push(savedUrl);
                } else {
                  // Nếu không có URL đã lưu, navigate về trang chủ
                  router.push('/');
                }
              } catch (error) {
                // Fallback về trang chủ nếu có lỗi
                router.push('/');
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('venue.backToHome')}
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share venue">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <article id="venue-content" itemScope itemType="https://schema.org/LocalBusiness">
          {/* Gallery Section */}
          <section className="mb-8" aria-label="Venue gallery">
            <VenueGallery images={galleryImages} venueName={venue.name} />
          </section>

          {/* Venue Info Section */}
          <section className="mb-12" aria-label="Venue information">
            <VenueInfo venue={venue} />
          </section>

          {/* Image Library Section */}
          <section className="card-elevated p-6 rounded-xl mb-12" aria-label="Image library">
            <h2 className="text-xl font-bold mb-4 font-headline">
              Image Library
            </h2>
            <VenueImageMasonry images={galleryImages} />
          </section>

          {/* Related Venues Section - Better for SEO with internal linking */}
          <section aria-label="Related venues" className="mt-8">
            <RelatedVenues
              currentVenueId={venue.id.toString()}
              category={venue.category}
              country={venue.country}
              initialLimit={6}
            />
          </section>

          {/* Contact & Location Section */}
          <section className="mt-10" aria-label="Contact and location">
            <VisitUsMap
              address={venue.address}
              venueName={venue.name}
              country={venue.country}
              phone={venue.phone}
              mapEmbedUrl={venue.mapEmbedUrl}
              onOpenBooking={() => setBookingOpen(true)}
            />
          </section>
        </article>
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
