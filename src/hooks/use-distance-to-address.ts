"use client";

import { useEffect, useMemo, useState } from "react";

interface Coordinates {
  lat: number;
  lon: number;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

const haversineKm = (a: Coordinates, b: Coordinates) => {
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 6000,
      maximumAge: 5 * 60 * 1000,
    });
  });

const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { lat: number | null; lon: number | null };
  if (typeof data.lat !== "number" || typeof data.lon !== "number") return null;
  return { lat: data.lat, lon: data.lon };
};

const afterFirstUserGesture = () =>
  new Promise<void>((resolve) => {
    const handler = () => {
      window.removeEventListener("pointerdown", handler, true);
      window.removeEventListener("keydown", handler, true);
      resolve();
    };
    window.addEventListener("pointerdown", handler, true);
    window.addEventListener("keydown", handler, true);
  });

type PermissionStateLike = "granted" | "denied" | "prompt";
type GeolocationPermissionName = "geolocation";
type PermissionsLike = {
  query: (descriptor: { name: GeolocationPermissionName }) => Promise<{
    state: PermissionStateLike;
  }>;
};

export const useDistanceToAddress = (address: string) => {
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (!window.isSecureContext) return;
        const now = Date.now();

        const locKey = "geo:me:v1";
        let me: Coordinates | null = null;
        try {
          const cached = sessionStorage.getItem(locKey);
          if (cached) {
            const parsed = JSON.parse(cached) as Coordinates & { ts: number };
            if (
              typeof parsed?.lat === "number" &&
              typeof parsed?.lon === "number" &&
              typeof parsed?.ts === "number" &&
              now - parsed.ts < 10 * 60 * 1000
            ) {
              me = { lat: parsed.lat, lon: parsed.lon };
            }
          }
        } catch {
          // ignore cache parsing errors
        }

        if (!me) {
          // If browser is in "prompt" state, some environments only show the dialog
          // after a user gesture (click/tap/keydown). We'll wait for one.
          try {
            const permissions = (navigator as unknown as { permissions?: PermissionsLike })
              .permissions;
            if (permissions?.query) {
              const status = await permissions.query({ name: "geolocation" });
              if (status?.state === "prompt") {
                await afterFirstUserGesture();
              }
            }
          } catch {
            // ignore Permissions API errors
          }

          const pos = await getCurrentPosition();
          me = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          try {
            sessionStorage.setItem(locKey, JSON.stringify({ ...me, ts: now }));
          } catch {
            // ignore storage errors
          }
        }

        const addrKey = `geocode:${address}`;
        let venueGeo: Coordinates | null = null;
        try {
          const cached = localStorage.getItem(addrKey);
          if (cached) {
            const parsed = JSON.parse(cached) as Coordinates & { ts: number };
            if (
              typeof parsed?.lat === "number" &&
              typeof parsed?.lon === "number" &&
              typeof parsed?.ts === "number" &&
              now - parsed.ts < 30 * 24 * 60 * 60 * 1000
            ) {
              venueGeo = { lat: parsed.lat, lon: parsed.lon };
            }
          }
        } catch {
          // ignore cache parsing errors
        }

        if (!venueGeo) {
          venueGeo = await geocodeAddress(address);
          if (!venueGeo) return;
          try {
            localStorage.setItem(addrKey, JSON.stringify({ ...venueGeo, ts: now }));
          } catch {
            // ignore storage errors
          }
        }

        const km = haversineKm(me, venueGeo);
        if (!cancelled) setDistanceKm(km);
      } catch {
        // ignore geolocation/geocoding errors
      }
    };

    if (address) {
      void run();
    } else {
      setDistanceKm(null);
    }

    return () => {
      cancelled = true;
    };
  }, [address]);

  const distanceLabel = useMemo(() => {
    if (distanceKm === null) return null;
    if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
    return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
  }, [distanceKm]);

  return {
    distanceKm,
    distanceLabel,
  };
};

