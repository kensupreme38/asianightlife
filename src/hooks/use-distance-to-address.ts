"use client";

import { useEffect, useMemo, useState } from "react";

interface Coordinates {
  lat: number;
  lon: number;
}

const DISTANCE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const LOCATION_CACHE_TTL_MS = 10 * 60 * 1000; // 10 mins
const GEOCODE_MIN_INTERVAL_MS = 1200; // Nominatim-friendly throttle

const memoryGeocodeCache = new Map<
  string,
  { value: Coordinates | null; ts: number }
>();
const inflightGeocode = new Map<string, Promise<Coordinates | null>>();
let inflightLocation: Promise<Coordinates | null> | null = null;
let lastGeocodeRequestAt = 0;

const isGeoDebugEnabled = () => {
  if (typeof window === "undefined") return false;
  try {
    const queryEnabled = new URLSearchParams(window.location.search).get("geoDebug") === "1";
    const storageEnabled = window.localStorage.getItem("geoDebug") === "1";
    return queryEnabled || storageEnabled;
  } catch {
    return false;
  }
};

const geoDebug = (...args: unknown[]) => {
  if (isGeoDebugEnabled()) {
    console.log("[geo-distance]", ...args);
  }
};

const toErrorInfo = (error: unknown) => {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { message: String(error) };
};

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
  const now = Date.now();
  const cached = memoryGeocodeCache.get(address);
  if (cached && now - cached.ts < DISTANCE_CACHE_TTL_MS) {
    geoDebug("memory geocode cache hit", { address });
    return cached.value;
  }

  const inflight = inflightGeocode.get(address);
  if (inflight) {
    geoDebug("reuse inflight geocode request", { address });
    return inflight;
  }

  const requestPromise = (async () => {
    const waitMs = Math.max(0, GEOCODE_MIN_INTERVAL_MS - (Date.now() - lastGeocodeRequestAt));
    if (waitMs > 0) {
      geoDebug("throttle geocode request", { address, waitMs });
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    lastGeocodeRequestAt = Date.now();
    const debug = isGeoDebugEnabled();
    geoDebug("call /api/geocode", { address, debug });
    const query = new URLSearchParams({ address });
    if (debug) query.set("geoDebug", "1");
    const res = await fetch(`/api/geocode?${query.toString()}`);
    if (!res.ok) {
      geoDebug("/api/geocode failed", { address, status: res.status });
      memoryGeocodeCache.set(address, { value: null, ts: Date.now() });
      return null;
    }
    const data = (await res.json()) as { lat: number | null; lon: number | null };
    if (typeof data.lat !== "number" || typeof data.lon !== "number") {
      geoDebug("/api/geocode returned empty coordinates", { address, data });
      memoryGeocodeCache.set(address, { value: null, ts: Date.now() });
      return null;
    }

    const value = { lat: data.lat, lon: data.lon };
    geoDebug("/api/geocode success", { address, value });
    memoryGeocodeCache.set(address, { value, ts: Date.now() });
    return value;
  })();

  inflightGeocode.set(address, requestPromise);
  try {
    return await requestPromise;
  } finally {
    inflightGeocode.delete(address);
  }
};

const getMyLocation = async (): Promise<Coordinates | null> => {
  if (inflightLocation) {
    geoDebug("reuse inflight geolocation request");
    return inflightLocation;
  }

  inflightLocation = (async () => {
    const now = Date.now();
    const locKey = "geo:me:v1";
    try {
      const cached = sessionStorage.getItem(locKey);
      if (cached) {
        const parsed = JSON.parse(cached) as Coordinates & { ts: number };
        if (
          typeof parsed?.lat === "number" &&
          typeof parsed?.lon === "number" &&
          typeof parsed?.ts === "number" &&
          now - parsed.ts < LOCATION_CACHE_TTL_MS
        ) {
          geoDebug("session geolocation cache hit", {
            ageMs: now - parsed.ts,
            coords: { lat: parsed.lat, lon: parsed.lon },
          });
          return { lat: parsed.lat, lon: parsed.lon };
        }
      }
    } catch {
      // ignore cache parsing errors
    }

    // If browser is in "prompt" state, some environments only show the dialog
    // after a user gesture (click/tap/keydown). We'll wait for one.
    try {
      const permissions = (navigator as unknown as { permissions?: PermissionsLike })
        .permissions;
      if (permissions?.query) {
        const status = await permissions.query({ name: "geolocation" });
        geoDebug("geolocation permission status", { state: status?.state });
        if (status?.state === "prompt") {
          geoDebug("waiting for first user gesture");
          await afterFirstUserGesture();
        }
      }
    } catch {
      // ignore Permissions API errors
    }

    const pos = await getCurrentPosition();
    const me = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    };
    geoDebug("geolocation success", me);
    try {
      sessionStorage.setItem(locKey, JSON.stringify({ ...me, ts: Date.now() }));
    } catch {
      // ignore storage errors
    }
    return me;
  })();

  try {
    return await inflightLocation;
  } catch (error: unknown) {
    geoDebug("geolocation failed", toErrorInfo(error));
    return null;
  } finally {
    inflightLocation = null;
  }
};

const loadVenueGeoFromStorage = (address: string): Coordinates | null => {
  const now = Date.now();
  const addrKey = `geocode:${address}`;
  try {
    const cached = localStorage.getItem(addrKey);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as Coordinates & { ts: number };
    if (
      typeof parsed?.lat === "number" &&
      typeof parsed?.lon === "number" &&
      typeof parsed?.ts === "number" &&
      now - parsed.ts < DISTANCE_CACHE_TTL_MS
    ) {
      geoDebug("local geocode cache hit", { address });
      return { lat: parsed.lat, lon: parsed.lon };
    }
  } catch {
    // ignore cache parsing errors
  }
  return null;
};

const saveVenueGeoToStorage = (address: string, venueGeo: Coordinates) => {
  const addrKey = `geocode:${address}`;
  try {
    localStorage.setItem(addrKey, JSON.stringify({ ...venueGeo, ts: Date.now() }));
  } catch {
    // ignore storage errors
  }
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
        if (!window.isSecureContext) {
          geoDebug("abort: insecure context");
          return;
        }
        const me = await getMyLocation();
        if (!me) {
          geoDebug("abort: cannot resolve current location");
          return;
        }

        let venueGeo = loadVenueGeoFromStorage(address);

        if (!venueGeo) {
          venueGeo = await geocodeAddress(address);
          if (!venueGeo) {
            geoDebug("abort: geocode returned null", { address });
            return;
          }
          saveVenueGeoToStorage(address, venueGeo);
        }

        const km = haversineKm(me, venueGeo);
        geoDebug("distance calculated", { address, km });
        if (!cancelled) setDistanceKm(km);
      } catch (error: unknown) {
        geoDebug("distance pipeline failed", { address, ...toErrorInfo(error) });
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

