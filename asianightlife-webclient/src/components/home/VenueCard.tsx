"use client";



import { memo, useState, lazy, Suspense } from "react";

import { Link } from "@/i18n/routing";

import { getVenueUrl } from "@/lib/venue-url";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { MapPin, Clock, MessageCircle, DollarSign } from "lucide-react";

import { SimpleImage } from "@/components/ui/simple-image";

import { usePathname } from "@/i18n/routing";

import { useDistanceToAddress } from "@/hooks/use-distance-to-address";



const BookingForm = lazy(() =>

  import("@/components/venue/BookingForm").then((m) => ({ default: m.BookingForm }))

);



interface VenueCardProps {

  venue: {

    id: string;

    slug: string;

    name: string;

    main_image_url: string;

    imageHint?: string;

    category: string;

    address: string;

    price: string;

    rating: number;

    status: "open" | "closed";

    country: string;

    hours?: string | Record<string, string | undefined>;

  };

  /** Distance uses geolocation + geocode per card — off in grids for performance */

  showDistance?: boolean;

}



const VenueCardInner = ({ venue, showDistance = false }: VenueCardProps) => {

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const isOpen = venue.status === "open";

  const pathname = usePathname();

  const { distanceLabel } = useDistanceToAddress(showDistance ? venue.address : "");



  const handleBooking = () => {

    setIsBookingOpen(true);

  };



  const handleVenueClick = () => {

    try {

      if (pathname === '/' || pathname.match(/^\/(en|vi|zh|id|ja|ko|ru|th)\/?$/)) {

        const currentUrl = window.location.pathname + window.location.search;

        sessionStorage.setItem('scrollRestoreReferrer', currentUrl);



        const urlParams = new URLSearchParams(window.location.search);

        const page = urlParams.get('page');

        sessionStorage.setItem('homePageNumber', page || '1');

      }

    } catch {

      // Ignore errors

    }

  };



  return (

    <div className="group card-elevated rounded-xl overflow-hidden hover-glow transition-transform duration-300 h-full flex flex-col hover:-translate-y-1">

      <Link

        href={getVenueUrl(venue)}

        className="flex-1 flex flex-col"

        onClick={handleVenueClick}

        prefetch={true}

      >

        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">

          <SimpleImage

            src={venue.main_image_url}

            alt={`${venue.name} - ${venue.category} in ${venue.country}. ${venue.address}. ${isOpen ? 'Currently open' : 'Currently closed'}.`}

            fill

            className="object-cover transition-transform duration-300 group-hover:scale-105"

          />



          <div className="absolute top-3 left-3 hidden md:block">

            <Badge

              variant={isOpen ? "default" : "destructive"}

              className={`${isOpen ? "bg-green-500 hover:bg-green-600" : ""} text-white font-medium`}

            >

              <Clock className="h-3 w-3 mr-1" />

              {isOpen ? "Open" : "Closed"}

            </Badge>

          </div>



          {showDistance && distanceLabel && (

            <div className="absolute top-3 right-3 hidden md:block">

              <div className="hidden md:flex items-center gap-1.5 text-black font-bold text-xs bg-white px-3 py-1 rounded-xl shadow-sm">

                <MapPin className="h-3.5 w-3.5" />

                <span>{distanceLabel}</span>

              </div>

            </div>

          )}



          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">

            <Badge variant="secondary" className="bg-black/60 text-white truncate text-xs">

              {venue.category}

            </Badge>

          </div>

        </div>



        <div className="md:p-4 px-2.5 space-y-3 py-1 flex-1 flex flex-col">

          <div className="flex-1">

            <div className="flex items-start justify-between mb-1">

              <h3 className="font-bold text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors font-headline">

                {venue.name}

              </h3>

            </div>



            <div className="flex items-center text-muted-foreground text-xs md:text-sm">

              <MapPin className="h-3 w-3 md:w-4 md:h-4 mr-1 shrink-0" />

              <span className="line-clamp-1">{venue.address}</span>

            </div>



            {showDistance && distanceLabel ? (

              <div className="mt-1 text-xs text-foreground/70 md:hidden">

                {distanceLabel} away

              </div>

            ) : null}



            <div className="mt-1 text-xs font-semibold text-foreground/80 flex items-center gap-1">

              <DollarSign className="h-3.5 w-3.5 shrink-0 opacity-80" />

              <span>{venue.price}</span>

            </div>

          </div>

        </div>

      </Link>



      {venue.category !== "Hotel" ? (

        <div className="md:px-4 p-2.5 pt-0 mt-2 md:mt-0 flex-shrink-0">

          <Button

            onClick={handleBooking}

            className="w-full"

            size="sm"

            variant="neon"

            disabled={!isOpen}

          >

            <MessageCircle className="h-4 w-4 md:mr-2" />

            <span className="hidden md:inline">

              {isOpen ? "Make A Booking" : "Temporarily Closed"}

            </span>

          </Button>

        </div>

      ) : (

        <div className="md:px-4 p-2.5 pt-0 mt-2 md:mt-0 flex-shrink-0" />

      )}



      {isBookingOpen && (

        <Suspense fallback={null}>

          <BookingForm

            open={isBookingOpen}

            onOpenChange={setIsBookingOpen}

            venueName={venue.name}

            venueAddress={venue.address}

          />

        </Suspense>

      )}

    </div>

  );

};



export const VenueCard = memo(VenueCardInner);


