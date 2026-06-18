import { getCategoryBySlug } from "./categories";
import { getCountryById, getCountryBySlug } from "./countries";
import { getCityByCode, getCityBySlug } from "./cities";
import { routing } from "@/i18n/routing";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

const LOCALES = new Set<string>(routing.locales);

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveSegmentLabel(segment: string, parentSegment?: string): string {
  if (parentSegment === "countries") {
    return getCountryBySlug(segment)?.name ?? formatSlug(segment);
  }
  if (parentSegment === "categories") {
    return getCategoryBySlug(segment)?.name ?? formatSlug(segment);
  }
  if (parentSegment === "guides") {
    return formatSlug(segment);
  }
  if (parentSegment === "trips") {
    return formatSlug(segment);
  }
  if (parentSegment === "dj") {
    return segment;
  }

  const cityBySlug = getCityBySlug(segment);
  if (cityBySlug) return cityBySlug.heroTitle;

  const cityByCode = getCityByCode(segment);
  if (cityByCode) return cityByCode.name;

  if (segment === "guides") return "Guides";
  if (segment === "trips") return "Trips";
  if (segment === "dj") return "DJs";
  if (segment === "book") return "Book";
  if (segment === "about") return "About";
  if (segment === "contact") return "Contact";
  if (segment === "countries") return "Countries";
  if (segment === "categories") return "Categories";

  return formatSlug(segment);
}

/** Build breadcrumb items from a pathname (locale-aware). */
export function breadcrumbsFromPathname(
  pathname: string,
  labels: { home: string; countries: string; categories: string; guides: string; trips: string; djs: string }
): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean);
  const result: BreadcrumbItem[] = [{ label: labels.home, href: "/" }];

  let currentPath = "";
  let prevSegment: string | undefined;

  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i];
    currentPath += `/${segment}`;

    if (i === 0 && LOCALES.has(segment)) {
      continue;
    }

    let label = resolveSegmentLabel(segment, prevSegment);

    if (segment === "countries" && i < paths.length - 1) {
      label = labels.countries;
    } else if (segment === "categories" && i < paths.length - 1) {
      label = labels.categories;
    } else if (segment === "guides" && i < paths.length - 1) {
      label = labels.guides;
    } else if (segment === "trips" && i < paths.length - 1) {
      label = labels.trips;
    } else if (segment === "dj" && i < paths.length - 1) {
      label = labels.djs;
    }

    result.push({ label, href: currentPath });
    prevSegment = segment;
  }

  return result;
}

export function countryBreadcrumbs(
  country: { name: string; slug: string },
  labels: { home: string; countries: string }
): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.countries, href: "/#country-selector" },
    { label: country.name, href: `/countries/${country.slug}` },
  ];
}

export function categoryBreadcrumbs(
  category: { name: string; slug: string },
  labels: { home: string; categories: string }
): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.categories, href: "/#country-selector" },
    { label: category.name, href: `/categories/${category.slug}` },
  ];
}

export function cityBreadcrumbs(
  city: { country: string; slug: string; heroTitle: string },
  labels: { home: string; countries: string }
): BreadcrumbItem[] {
  const country = getCountryById(city.country);
  const items: BreadcrumbItem[] = [
    { label: labels.home, href: "/" },
    { label: labels.countries, href: "/#country-selector" },
  ];
  if (country) {
    items.push({
      label: country.name,
      href: `/countries/${country.slug}`,
    });
  }
  items.push({ label: city.heroTitle, href: `/${city.slug}` });
  return items;
}

export function guidesIndexBreadcrumbs(labels: {
  home: string;
  guides: string;
}): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.guides, href: "/guides" },
  ];
}

export function guideBreadcrumbs(
  guide: { title: string; slug: string },
  labels: { home: string; guides: string }
): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.guides, href: "/guides" },
    { label: guide.title, href: `/guides/${guide.slug}` },
  ];
}

export function tripsIndexBreadcrumbs(labels: {
  home: string;
  trips: string;
}): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.trips, href: "/trips" },
  ];
}

export function tripBreadcrumbs(
  pkg: { title: string; slug: string },
  labels: { home: string; trips: string }
): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.trips, href: "/trips" },
    { label: pkg.title, href: `/trips/${pkg.slug}` },
  ];
}

export function djIndexBreadcrumbs(labels: {
  home: string;
  djs: string;
}): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.djs, href: "/dj" },
  ];
}

export function djBreadcrumbs(
  dj: { name: string },
  id: string,
  labels: { home: string; djs: string }
): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.djs, href: "/dj" },
    { label: dj.name, href: `/dj/${id}` },
  ];
}

export function bookBreadcrumbs(labels: {
  home: string;
  book: string;
}): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: labels.book, href: "/book" },
  ];
}

export function trustPageBreadcrumbs(
  page: { title: string; slug: string },
  labels: { home: string }
): BreadcrumbItem[] {
  return [
    { label: labels.home, href: "/" },
    { label: page.title, href: `/${page.slug}` },
  ];
}

export function venueBreadcrumbs(
  venue: { name: string; country: string },
  venuePath: string,
  labels: { home: string; countries: string }
): BreadcrumbItem[] {
  const country = getCountryById(venue.country);
  const items: BreadcrumbItem[] = [
    { label: labels.home, href: "/" },
    { label: labels.countries, href: "/#country-selector" },
  ];
  if (country) {
    items.push({
      label: country.name,
      href: `/countries/${country.slug}`,
    });
  }
  items.push({ label: venue.name, href: venuePath });
  return items;
}
